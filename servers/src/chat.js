import Redis from 'ioredis';

import { CHAT_CHANNELS, CHAT_ACTIONS, REDIS_CHANNELS } from './constants';
import { chatMessage } from './actions';
import { decode } from './utils';

const config = {
  port: 6379,
};

const RETRY_TIME = 1000;

const redis = new Redis(config);

function playerExists(id) {
  return redis.exists(`player:${id}`);
}

function validatePrivateMessage(action) {
  if(playerExists(action.payload.to)) {
    return true;
  }
  return false;
}

function sendPrivateMessage(action) {
  redis.publish(action.payload.to, chatMessage(action.payload));
}

function updateChat(action) {
  switch(action.type) {
    case CHAT_ACTIONS.MESSAGE:
      switch(action.payload.channel) {
        case CHAT_CHANNELS.GLOBAL:
        case CHAT_CHANNELS.LOCAL:
          redis.publish(REDIS_CHANNELS.CHAT, chatMessage(action.payload))
          break;
        default:
          if(validatePrivateMessage(action)) {
            sendPrivateMessage(action);
          } else {
            redis.publish(action.payload.from, noChatRecipient(action.payload));
          }
      }
  }
}

function handleChat(resultArray) {
  const action = decode(resultArray[1])
  //console.log('CHAT: Action', Object.keys(action), Object.values(action))//action.payload.channel, action.payload.to, action.payload.from, action.payload.message);
  updateChat(action);
  redis.brpop('actions:chat', 0).then(handleChat);
}

redis.brpop('actions:chat', 0).then(handleChat);
