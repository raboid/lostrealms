import React from "react"
import ReactDOM from "react-dom"

import Socket from "./socket"
import UI from "ui"
import Login from "./login"
import Game from "game"
import { authenticate } from "./actions"
import {
  ENTITY_ACTIONS,
  CHAT_ACTIONS,
  PLAYER_ACTIONS,
  AUTH_ACTIONS
} from "shared/constants"
import { decode } from "shared/utils"

import "./index.css"

window.LR = {}

var socket = new Socket(onAction)

window.LR.Game = new Game(socket, reset)

window.LR.Game.load()

var chat = []

function onAction(action) {
  console.log("RECEIVED", action)

  switch (action.type) {
    case PLAYER_ACTIONS.ADD:
      renderUI()
      window.LR.Game.handlePlayer(action.payload)
      break
    case ENTITY_ACTIONS.UPDATE:
      if (window.LR.Game && action.payload) {
        window.LR.Game.handleRemoteEntities(action.payload)
      }
      break
    case CHAT_ACTIONS.MESSAGE:
      updateChat(action.payload)
      break
    case AUTH_ACTIONS.UNAUTHENTICATED:
      renderLogin(true)
      break
    case AUTH_ACTIONS.AUTHENTICATED:
      handleAuthenticated()
      break
    default:
      break
  }
}

function updateChat(update) {
  chat = [...chat, update]

  renderUI()
}

function reset() {
  unmountUI()

  renderLogin()
}

function handleAuthenticated() {
  unmountLogin()
}

function unmountUI() {
  ReactDOM.unmountComponentAtNode(document.getElementById("ui"))
}

function unmountLogin() {
  ReactDOM.unmountComponentAtNode(document.getElementById("login"))
}

function renderUI() {
  ReactDOM.render(
    <UI socket={socket} chat={chat} />,
    document.getElementById("ui")
  )
}

function renderLogin(invalid) {
  ReactDOM.render(
    <Login socket={socket} invalid={invalid} />,
    document.getElementById("login")
  )
}

renderLogin()
