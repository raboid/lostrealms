import React from "react"
import Stats from "stats.js"
import path from "path"

import * as Actions from "actions"
import * as SharedActions from "shared/actions"
import EntitySystem from "./systems/entity"
import Renderer from "./renderer"
import { decode, encode, generateId } from "shared/utils"

import "assets/sheets/creatures.png"
import "assets/sheets/items.png"
import "assets/sheets/effects.png"
import "assets/sheets/world.png"

import creaturesJson from "assets/sheets/creatures.json"
import itemsJson from "assets/sheets/items.json"
import effectsJson from "assets/sheets/effects.json"
import worldJson from "assets/sheets/world.json"

const TICK_RATE = 20

const TIMESTEP = parseInt(1000 / TICK_RATE) //ms

const SERVER_UPDATE = 60

export const bindings = {
  ui: {
    toggleMenu: "m"
  },
  game: {
    moveUp: "w",
    moveDown: "s",
    moveLeft: "a",
    moveRight: "d",
    attack: " "
  }
}

export default class Game {
  constructor(socket, reset) {
    this.socket = socket

    this.reset = reset

    this.loaded = false

    this.init()

    this.renderer = new Renderer()

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
    PIXI.loader
      .add("creatures", creaturesJson)
      .add("world", worldJson)
      .add("items", itemsJson)
      .add("effects", effectsJson)
      .load(this.onLoad)
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

    this.pendingPlayer = player

    if (this.loaded) {
      this.start()
    }
  }

  start() {
    this.renderer.setup()

    this.entitySystem.addEntity(this.pendingPlayer)

    const pendingEnts = Object.values(this.pendingEntities)

    if (pendingEnts.length > 0) {
      this.entitySystem.mergeEntities(pendingEnts)
      delete this.pendingEntities
    }

    this.registerEventHandlers()

    this.updateIntervalId = setInterval(this.update, TIMESTEP)

    this.actionIntervalId = setInterval(this.sendRemoteActions, SERVER_UPDATE)

    this.render()

    this.started = true
  }

  registerEventHandlers() {
    window.addEventListener("click", this.handleClick)
    window.addEventListener("keydown", this.handleKeyDown)
    window.addEventListener("keyup", this.handleKeyUp)
    window.addEventListener("beforeunload", this.handleUnload)
  }

  render = () => {
    const player = this.entitySystem.get(this.playerId)
    if (player) {
      this.renderer.render(player)
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
    this.entitySystem.update()
  }

  addRemoteEntity(entity) {
    this.socket.send(Actions.entityActions([SharedActions.addEntity(entity)]))
  }

  removeRemoteEntity(entity) {
    this.socket.send(
      Actions.entityActions([SharedActions.removeEntity(entity)])
    )
  }

  handleRemoteEntities(remoteEntities) {
    //console.log('MERGING', remoteEntities);
    if (this.started) {
      this.entitySystem.mergeEntities(remoteEntities)
    } else {
      remoteEntities.forEach(
        ent => (this.pendingEntities[ent.id || ent.cid] = ent)
      )
    }
  }

  addAction(action) {
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
      console.log("sending actions", this.remoteActions)
      this.socket.send(Actions.entityActions(this.remoteActions))
      this.remoteActions = []
    }
  }

  handleClick = event => {
    if (event.target.localName !== "canvas") {
      return
    }

    const player = this.entitySystem.get(this.playerId)

    const origin = {
      x: player.sprite.worldTransform.tx,
      y: player.sprite.worldTransform.ty
    }

    const target = {
      x: event.clientX,
      y: event.clientY
    }

    this.addAction(
      SharedActions.shoot(this.playerId, generateId(), origin, target)
    )
  }

  getActionFromKeyDown = key => {
    switch (key) {
      case bindings.game.moveUp:
        return SharedActions.moveUp(this.playerId)
      case bindings.game.moveLeft:
        return SharedActions.moveLeft(this.playerId)
      case bindings.game.moveRight:
        return SharedActions.moveRight(this.playerId)
      case bindings.game.moveDown:
        return SharedActions.moveDown(this.playerId)
    }
  }

  getActionFromKeyUp = key => {
    switch (key) {
      case bindings.game.moveUp:
      case bindings.game.moveDown:
        return SharedActions.stopUpDown(this.playerId)
      case bindings.game.moveLeft:
      case bindings.game.moveRight:
        return SharedActions.stopLeftRight(this.playerId)
    }
  }

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
