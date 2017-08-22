import React from 'react';
import ReactDOM  from 'react-dom';

import UI from 'ui';
import Login from './login';
import Game from 'game';
import { authenticate } from './actions';
import { ENTITY_ACTIONS, CHAT_ACTIONS, AUTH_ACTIONS } from './constants';
import { decode } from 'shared/utils';

import './client.css';

window.LR = {};

var socket;

var chat = [];

socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', () => {});

socket.addEventListener('message', handleMessage)

function handleMessage(message) {
  const action = decode(message.data)

  console.log('message', action);

  switch(action.type) {
    case ENTITY_ACTIONS.UPDATE:
      if(window.LR.Game && window.LR.Game.started && action.payload) {
        console.log('update', action.payload)
        window.LR.Game.handleRemoteEntities(action.payload)
      }
      break;
    case CHAT_ACTIONS.MESSAGE:
      updateChat(action.payload);
      break;
    case AUTH_ACTIONS.UNAUTHENTICATED:
      renderLogin(true);
      break;
    case AUTH_ACTIONS.AUTHENTICATED:
      handleAuthenticated(action.payload)
      break;
    default:
      break;
  }
}

function updateChat(update) {
  chat = [ ...chat, update]
  renderUI();
}

function handleAuthenticated({ playerId, entities }) {
  unmountLogin();

  window.LR.Game = new Game(socket, playerId, entities)
  
  window.LR.Game.load()

  renderUI();
}

function unmountLogin() {
  ReactDOM.unmountComponentAtNode(document.getElementById('game'));
}

function renderUI() {
  ReactDOM.render(<UI socket={socket} chat={chat} />, document.getElementById('ui'));
}

function renderLogin(invalid) {
  ReactDOM.render(<Login socket={socket} invalid={invalid} />, document.getElementById('game'));
}

renderLogin();