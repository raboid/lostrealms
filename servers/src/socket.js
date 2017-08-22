import WebSocket from 'uws';
import Redis from 'ioredis';

import { REDIS_CHANNELS, AUTH_ACTIONS, ENTITY_ACTIONS } from './constants';
import * as Actions from './actions';
import { decode, encode } from './utils';

const TICK_RATE = 20

const TIMESTEP = parseInt(1000 / TICK_RATE) //ms

const config = {
  port: 6379,
};

const port = process.env.PORT || 3000;

const redis = new Redis(config);
const sub = new Redis(config);

const wss = new WebSocket.Server({ port });

const clients = {};
const localEntities = {};
let updatedEntities = [];

sub.subscribe(REDIS_CHANNELS.GAME, REDIS_CHANNELS.CHAT);

function handleSubscriptions(channel, data) {
  console.log('WSS: SUB', channel, data);
  if(channel === REDIS_CHANNELS.CHAT) {
    sendChat(data);
  } else if(channel === REDIS_CHANNELS.GAME) {

  } else if(/^entity/.test(channel)) {
    updateEntity(decode(data));
  }
}

sub.on('message', handleSubscriptions);

function authenticate(name) {
  return redis.exists(`player:${name}`)
}

// use shared entity
function Player(name) {
  return {
    type: 'player',
    name,
    x: 100,
    y: 100,
    vX: 0,
    vY: 0
  };
}

function updateEntity(entity) {
  console.log('updating', entity);
  updatedEntities.push(entity);
  localEntities[entity.id] = entity;
}

function addEntity(entity) {
  subscribeToEntity(entity.id);
  updateEntity(entity);
}

function createPlayer(name) {
  const player = Player(name);
  
  redis.incr('next_entity_id').then(playerId => {
    player.id = parseInt(playerId);

    this.playerId = player.id

    clients[this.playerId] = new Client(this, player);
    subscribeToPlayer(player)

    addEntity(player);

    const pipeline = redis.pipeline();

    pipeline.hmset(`entity:${player.id}`, player, (err, results) => console.log(err))
    pipeline.hmset(`player:${name}`, player, (err, results) => console.log(err))

    pipeline.exec((err, results) => {
      console.log(player)
      redis.publish('entities', encode(player))
      this.send(Actions.authenticated(this.playerId, localEntities))
    })
  });
}

function subscribeToPlayer(player) {
  sub.subscribe(`player:${player.name}`)
}

function subscribeToEntity(entityId) {
  console.log(`subscribe entity:${entityId}`)
  sub.subscribe(`entity:${entityId}`);
}

function onAuthenticate({ payload: name }) {
  authenticate(name).then((invalid) => {
    if(invalid) {
      this.send(Actions.unauthenticated('Invalid name'))
    } else {
      createPlayer.call(this, name)
    }
  })
}

function getChannelForAction({ type }) {
  return type ? type.split('.')[0] : null;
}

function publishChatAction(action) {
  redis.publish(REDIS_CHANNELS.CHAT, encode(action));
}

function publishEntityAction(action) {
  switch(action.type) {
    case ENTITY_ACTIONS.ACTIONS:
      action.payload.forEach(action => {
        action = decode(action);
        console.log(`publishing actions:${action.id}`, action);
        const actionHandlers = redis.publish(`actions:${action.id}`, encode(action));

        if(!actionHandlers) {
          console.log('no handlers', action.id)
          ///smething
        }
      })
      break;
  }

}

function publishAction(action) {
  const channel = getChannelForAction(action);
  //console.log(channel);
  switch(channel) {
    case REDIS_CHANNELS.CHAT:
      publishChatAction(action);
      break;
    case REDIS_CHANNELS.GAME:
      break;
    case REDIS_CHANNELS.ENTITY:
      publishEntityAction(action)
      break;
    default:
      console.log('Bad action', action);
  }
}

function handleMessage(message) {
  const action = decode(message)
  console.log('Received: ', action)
  switch(action.type) {
    case AUTH_ACTIONS.AUTHENTICATE:
      onAuthenticate.call(this, action)
      break
    default:
      publishAction(action);
  }
}

function handleClose() {
  if(!this.playerId) {
    return
  }
  console.log('closing', this.playerId)
  sub.unsubscribe(`entity:${this.playerId}`);
  sub.unsubscribe(`player:${localEntities[this.playerId].name}`)
  delete localEntities[this.playerId]
  delete clients[this.playerId]
}

wss.on('connection', function(ws) {
  console.log('WSS: Connection received.')

  ws.on('message', handleMessage)
  ws.on('close', handleClose)
})

function updateClient(action) {
  return function(clientId) {
    console.log('updating client', clientId, action);
    clients[clientId].send(action)
  }
}

function sendChat(action) {
  Object.keys(clients).forEach(updateClient(action));
}

function sendUpdatedEntities() {
  if(updatedEntities.length > 0) {
    const action = Actions.updatedEntities(updatedEntities);
    Object.keys(clients).forEach(updateClient(action))

    updatedEntities = [];
  }
}

setInterval(sendUpdatedEntities, TIMESTEP)


class Client {
  constructor(socket, player) {
    this.socket = socket;
    this.player = player;

    this.lag = 0;

    this.entityIds = [this.player.id];
  } 

  send(action) {
    this.socket.send(action)
  }
}
