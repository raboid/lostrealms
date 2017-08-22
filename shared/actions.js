import { CHAT_ACTIONS, AUTH_ACTIONS, ENTITY_ACTIONS, CHAT_CHANNELS, ENTITY_TYPES } from './constants';
import { encode } from './utils';

export const chatMessage = ({ time, to, from, message, channel=CHAT_CHANNELS.GLOBAL }) => encode({
  type: CHAT_ACTIONS.MESSAGE,
  payload: {
    time,
    to,
    from,
    message,
    channel
  }
})

export const noChatRecipient = ({ to, from }) => encode({
  type: CHAT_ACTIONS.NO_RECIPIENT,
  payload: { to, from }
})

export const authenticate = (token) => encode({
  type: AUTH_ACTIONS.AUTHENTICATE,
  payload: {
    token
  }
})

export const unauthenticated = (error) => encode({
  type: AUTH_ACTIONS.UNAUTHENTICATED,
  payload: {
    error
  }
})

export const authenticated = (playerId, entities) => encode({
  type: AUTH_ACTIONS.AUTHENTICATED,
  payload: { playerId, entities }
})

export const updatedEntities = (updates) => {
  if(updates.length > 0) {
    return encode({
      type: ENTITY_ACTIONS.UPDATE,
      payload: updates
    })
  }

  return encode({ type: ENTITY_ACTIONS.UPDATE })
}

export const addPlayer = name => ({
  type: ENTITY_ACTIONS.ADD,
  payload: {
    type: ENTITY_TYPES.PLAYER,
    name
  }
})