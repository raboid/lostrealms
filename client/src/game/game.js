import React from 'react';
import Stats from 'stats.js';
import path from 'path';

import * as Actions from 'actions';
import EntitySystem from './systems/entity';
import Renderer from './renderer'
import { decode, encode } from 'shared/utils'

import 'assets/sheets/creatures.png';
import 'assets/sheets/items.png';
import 'assets/sheets/effects.png';
import 'assets/sheets/world.png';

import creaturesJson from 'assets/sheets/creatures.json';
import itemsJson from 'assets/sheets/items.json';
import effectsJson from 'assets/sheets/effects.json';
import worldJson from 'assets/sheets/world.json';

const TICK_RATE = 20

const TIMESTEP = parseInt(1000 / TICK_RATE) //ms

const SERVER_UPDATE = 60;

export const bindings = {
  ui: {
    toggleMenu: 'm'
  },
  game: {
    moveUp: 'w',
    moveDown: 's',
    moveLeft: 'a',
    moveRight: 'd',
    attack: ' '
  }
}

export default class Game {
  constructor(socket, playerId, remoteEntities) {
    this.socket = socket;

    this.playerId = playerId;

    this.started = false;

    this.remoteActions = [];

    this.remoteEntities = remoteEntities;

    this.stats = {};
    this.stats.game = new Stats();
    this.stats.render = new Stats();
    this.stats.game.dom.style.cssText = 'z-index:10000;margin-left:46px';
    this.stats.render.dom.style.cssText = 'z-index:10000;margin-left:46px';
    this.stats.game.showPanel(0);
    this.stats.render.showPanel(0);
  }

  load() {
    console.log('loading game');
    PIXI.loader
      .add('creatures', creaturesJson)
      .add('world', worldJson)
      .add('items', itemsJson)
      .add('effects', effectsJson)
      .load(this.start);
  }

  start = () => {
    this.renderer = new Renderer();

    this.entitySystem = new EntitySystem(this.remoteEntities, [], this.renderer)

    this.registerEventHandlers();

    this.render();

    setInterval(this.update, TIMESTEP);

    setInterval(this.sendRemoteActions, SERVER_UPDATE)

    console.log('game started')
    this.started = true;
  }

  registerEventHandlers() {
    window.addEventListener('click', this.handleClick)
    window.addEventListener("keydown", this.handleKeyDown)
    window.addEventListener("keyup", this.handleKeyUp)
  }

  render = () => {
    this.renderer.render()

    requestAnimationFrame(this.render)
  }

  update = () => {
    this.entitySystem.update()
  }

  addRemoteEntity(entity) {
    this.socket.send(Actions.addEntity(entity));
  }

  removeRemoteEntity(entity) {
    this.socket.send(Actions.removeEntity(entity));
  }

  handleRemoteEntities(remoteEntities) {
    console.log('MERGING', remoteEntities);
    this.entitySystem.mergeEntities(remoteEntities);
  }

  addAction(action) {
    if(typeof action === 'object') {
      this.remoteActions.push(encode(action));
      this.entitySystem.addAction(action);
    } else if(typeof action === 'string') {
      this.remoteActions.push(action);
      this.entitySystem.addAction(decode(action));
    }
  }

  sendRemoteActions = () => {
    if(this.remoteActions.length > 0) {
      console.log('sending actions', this.remoteActions)
      this.socket.send(Actions.entityActions(this.remoteActions));
      this.remoteActions = [];
    }
  }

  shoot(x, y, tX, tY) {
    const bolt = { type: 'bolt',
      startTime: new Date().getTime(),
      x,
      y,
      tX,
      tY,
    };

    this.entitySystem.addEntity(bolt)
    this.addRemoteEntity(bolt)
  }

  handleClick = (event) => {
    if(event.target.localName !== 'canvas') {
      return;
    }

    //entitySystem.addAction(shoot(this.playerId, { x: event.clientX, y: event.clientY }));
  }

  getActionFromKeyDown = (key) => {
   switch(key) {
    case bindings.game.moveUp:
      return Actions.moveUp(this.playerId);
    case bindings.game.moveLeft:
      return Actions.moveLeft(this.playerId);
    case bindings.game.moveRight:
      return Actions.moveRight(this.playerId);
    case bindings.game.moveDown:
      return Actions.moveDown(this.playerId);
    }
  }

  getActionFromKeyUp = key => {
    switch(key) {
      case bindings.game.moveUp:
      case bindings.game.moveDown:
        return Actions.stopUpDown(this.playerId);
      case bindings.game.moveLeft:
      case bindings.game.moveRight:
        return Actions.stopRightLeft(this.playerId);
    }
  }

  handleKeyDown = (event) => {
    const action = this.getActionFromKeyDown(event.key)
    if(action) {
      this.addAction(action);
    }
  }

  handleKeyUp = (event) => {
    const action = this.getActionFromKeyUp(event.key)
    if(action) {
      this.addAction(action);
    }
  }
}