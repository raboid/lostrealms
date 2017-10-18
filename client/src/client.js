import React from "react"
import ReactDOM from "react-dom"

import Socket from "./Socket"
import UI from "ui/UI"
import Login from "./Login"
import Game from "game/Game"
import { authenticate } from "./actions"
import {
  ENTITY_ACTIONS,
  CHAT_ACTIONS,
  PLAYER_ACTIONS,
  AUTH_ACTIONS
} from "shared/actions"
import { decode } from "shared/utils"

import "./index.css"

window.LR = {}

class Client {
  constructor() {
    this.reset = this.reset.bind(this)
    this.onAction = this.onAction.bind(this)
    this.renderUI = this.renderUI.bind(this)
    this.renderLogin = this.renderLogin.bind(this)
    this.unmountUI = this.unmountUI.bind(this)
    this.unmountLogin = this.unmountLogin.bind(this)
    this.startGame = this.startGame.bind(this)

    this.socket = new Socket(this.onAction)

    this.game = new Game(this.socket, this.reset, this.renderUI)
    window.LR.Game = this.game

    this.chat = []

    this.game.load()

    this.loggedIn = false

    this.renderLogin()
  }

  reset() {
    this.unmountUI()

    this.renderLogin()
  }

  renderLogin(invalid, valid) {
    ReactDOM.render(
      <Login socket={this.socket} invalid={invalid} valid={valid} />,
      document.getElementById("login")
    )
  }

  unmountLogin() {
    ReactDOM.unmountComponentAtNode(document.getElementById("login"))
  }

  renderUI({ player, chat }) {
    let update = false

    if (player) {
      this.player = { ...this.player, ...player }
      update = true
    }

    if (chat) {
      this.chat = [...this.chat, chat]
      update = true
    }

    if (update) {
      ReactDOM.render(
        <UI socket={this.socket} chat={this.chat} player={this.player} />,
        document.getElementById("ui")
      )
    }
  }

  unmountUI() {
    ReactDOM.unmountComponentAtNode(document.getElementById("ui"))
  }

  startGame(player) {
    if (this.authenticated) {
      this.renderUI({ player })
      this.game.handlePlayer(player)
    } else {
      setTimeout(() => this.startGame(player), 500)
    }
  }

  onAction(action) {
    //console.log("RECEIVED", action)

    switch (action.type) {
      case PLAYER_ACTIONS.ADD:
        this.startGame(action.payload)
        break
      case ENTITY_ACTIONS.UPDATE:
        if (action.payload) {
          this.game.handleRemoteUpdates(action.payload)
        }
        break
      case CHAT_ACTIONS.MESSAGE:
        this.renderUI({ chat: action.payload })
        break
      case AUTH_ACTIONS.UNAUTHENTICATED:
        this.renderLogin(true)
        break
      case AUTH_ACTIONS.AUTHENTICATED:
        this.renderLogin(false, true)
        setTimeout(() => {
          this.authenticated = true
          this.unmountLogin()
        }, 500)
        break
      default:
        break
    }
  }
}

window.LR.Client = new Client()
