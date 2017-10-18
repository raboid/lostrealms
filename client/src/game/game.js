import React from "react"
import Stats from "stats.js"
import path from "path"

import * as Actions from "actions"
import * as SharedActions from "shared/actions"
import EntitySystem from "./systems/entity"
import Renderer from "./Renderer"
import { decode, encode, generateId } from "shared/utils"

import "assets/sheets/sheet.png"
import sheetJson from "assets/sheets/sheet.json"

const TICK_RATE = 20

const TIMESTEP = parseInt(1000 / TICK_RATE) //ms

const SERVER_UPDATE = 60

export default class Game {
  constructor(socket, reset, renderUI) {
    this.socket = socket

    this.reset = reset

    this.renderUI = renderUI

    this.loaded = false

    this.init()

    this.handleClick = this.handleClick.bind(this)

    this.renderer = new Renderer(this.handleClick)

    this.entitySystem = new EntitySystem([], [], this.renderer)

    this.stats = {}
    this.stats.game = new Stats()
    this.stats.render = new Stats()
    this.stats.game.dom.style.cssText = "z-index:10000;margin-left:46px"
    this.stats.render.dom.style.cssText = "z-index:10000;margin-left:46px"
    this.stats.game.showPanel(0)
    this.stats.render.showPanel(0)
  }

  init() {
    this.started = false

    this.remoteActions = []

    this.remoteEntities = []

    this.pendingEntities = {}
  }

  load() {
    console.log("loading game")
    PIXI.loader.add("sheet", sheetJson).load(this.onLoad)
  }

  onLoad = () => {
    this.loaded = true

    if (this.pendingPlayer) {
      this.start()
      delete this.pendingPlayer
    }
  }

  handlePlayer(player) {
    this.playerId = player.id

    this.bindings = player.bindings

    this.pendingPlayer = player

    if (this.loaded) {
      this.start()
    }
  }

  start() {
    this.renderer.setup()

    this.handleRemoteUpdates([this.pendingPlayer])

    const pendingEnts = Object.values(this.pendingEntities)

    if (pendingEnts.length > 0) {
      this.entitySystem.mergeUpdates(pendingEnts)
      delete this.pendingEntities
    }

    this.registerEventHandlers()

    this.updateIntervalId = setInterval(this.update, TIMESTEP)

    this.actionIntervalId = setInterval(this.sendRemoteActions, SERVER_UPDATE)

    this.render()

    this.started = true

    console.log("game started")
  }

  registerEventHandlers() {
    window.addEventListener("keydown", this.handleKeyDown)
    window.addEventListener("keyup", this.handleKeyUp)
    window.addEventListener("beforeunload", this.handleUnload)
  }

  render = () => {
    const player = this.entitySystem.get(this.playerId)

    if (player) {
      this.renderer.render(player.sprite.position)
      requestAnimationFrame(this.render)
    } else {
      console.log("player died")
      this.stop()
    }
  }

  stop = () => {
    clearInterval(this.updateIntervalId)
    clearInterval(this.actionIntervalId)

    this.entitySystem.destroy()
    this.renderer.destroy()

    this.reset()

    this.init()
  }

  update = () => {
    const updates = this.entitySystem.update()
    if (updates.length > 0) {
      if (updates.some(({ id }) => id === this.playerId)) {
        this.renderUI({ player: this.entitySystem.get(this.playerId) })
      }
    }
  }

  addLocalEntity(entity) {
    this.entitySystem.addAction(SharedActions.addEntity(entity))
  }

  addRemoteEntity(entity) {
    this.socket.send(Actions.entityActions([SharedActions.addEntity(entity)]))
  }

  removeRemoteEntity(entity) {
    this.socket.send(
      Actions.entityActions([SharedActions.removeEntity(entity)])
    )
  }

  handleRemoteUpdates(updates) {
    if (this.started) {
      this.entitySystem.mergeUpdates(updates)
    } else {
      updates.forEach(
        update =>
          (this.pendingEntities[update.id || update.cid] = {
            ...(this.pendingEntities[update.id || update.cid] || {}),
            ...update
          })
      )
    }
  }

  addAction(action, playerAction) {
    if (playerAction) {
      action.id = this.playerId
    }

    if (typeof action === "object") {
      this.remoteActions.push(encode(action))
      this.entitySystem.addAction(action)
    } else if (typeof action === "string") {
      this.remoteActions.push(action)
      this.entitySystem.addAction(decode(action))
    }
  }

  sendRemoteActions = () => {
    if (this.remoteActions.length > 0) {
      this.socket.send(Actions.entityActions(this.remoteActions))
      this.remoteActions = []
    }
  }

  handleClick(target) {
    this.addAction(SharedActions.move(this.playerId, target))
  }

  // getActionFromKeyDown = key => {
  //   switch (key) {
  //     case this.bindings.game.moveUp:
  //       return SharedActions.moveUp(this.playerId)
  //     case this.bindings.game.moveLeft:
  //       return SharedActions.moveLeft(this.playerId)
  //     case this.bindings.game.moveRight:
  //       return SharedActions.moveRight(this.playerId)
  //     case this.bindings.game.moveDown:
  //       return SharedActions.moveDown(this.playerId)
  //   }
  // }

  // getActionFromKeyUp = key => {
  //   switch (key) {
  //     case this.bindings.game.moveUp:
  //     case this.bindings.game.moveDown:
  //       return SharedActions.stopUpDown(this.playerId)
  //     case this.bindings.game.moveLeft:
  //     case this.bindings.game.moveRight:
  //       return SharedActions.stopLeftRight(this.playerId)
  //   }
  // }

  handleUnload = () => {
    this.removeRemoteEntity({ id: this.playerId })
  }

  handleKeyDown = event => {
    const action = this.getActionFromKeyDown(event.key)
    if (action) {
      this.addAction(action)
    }
  }

  handleKeyUp = event => {
    const action = this.getActionFromKeyUp(event.key)
    if (action) {
      this.addAction(action)
    }
  }
}
