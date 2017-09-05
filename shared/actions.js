import {
  CHAT_ACTIONS,
  AUTH_ACTIONS,
  ENTITY_ACTIONS,
  PLAYER_ACTIONS,
  CHAT_CHANNELS,
  ENTITY_TYPES
} from "./constants"

export const chatMessage = ({
  time,
  to,
  from,
  message,
  channel = CHAT_CHANNELS.GLOBAL
}) => ({
  type: CHAT_ACTIONS.MESSAGE,
  payload: {
    time,
    to,
    from,
    message,
    channel
  }
})

export const noChatRecipient = ({ to, from }) => ({
  type: CHAT_ACTIONS.NO_RECIPIENT,
  payload: { to, from }
})

export const authenticate = token => ({
  type: AUTH_ACTIONS.AUTHENTICATE,
  payload: {
    token
  }
})

export const unauthenticated = error => ({
  type: AUTH_ACTIONS.UNAUTHENTICATED,
  payload: {
    error
  }
})

export const authenticated = (playerId, entities) => ({
  type: AUTH_ACTIONS.AUTHENTICATED,
  payload: { playerId, entities }
})

export const updatedEntities = updates => {
  if (updates.length > 0) {
    return {
      type: ENTITY_ACTIONS.UPDATE,
      payload: updates
    }
  }

  return { type: ENTITY_ACTIONS.UPDATE }
}

export const addPlayer = player => ({
  type: PLAYER_ACTIONS.ADD,
  payload: player
})

export function addEntity(entity) {
  const { sprite, ...socketEntity } = entity

  return {
    type: ENTITY_ACTIONS.ADD,
    id: entity.id,
    payload: socketEntity
  }
}

export function removeEntity(entity) {
  const { sprite, ...socketEntity } = entity

  return {
    type: ENTITY_ACTIONS.REMOVE,
    id: entity.id,
    payload: socketEntity
  }
}

export function moveUp(entityId) {
  return {
    type: ENTITY_ACTIONS.MOVE_UP,
    id: entityId
  }
}

export function moveDown(entityId) {
  return {
    type: ENTITY_ACTIONS.MOVE_DOWN,
    id: entityId
  }
}

export function moveRight(entityId) {
  return {
    type: ENTITY_ACTIONS.MOVE_RIGHT,
    id: entityId
  }
}

export function moveLeft(entityId) {
  return {
    type: ENTITY_ACTIONS.MOVE_LEFT,
    id: entityId
  }
}

export function stopLeftRight(entityId) {
  return {
    type: ENTITY_ACTIONS.STOP_LEFT_RIGHT,
    id: entityId
  }
}

export function stopUpDown(entityId) {
  return {
    type: ENTITY_ACTIONS.STOP_UP_DOWN,
    id: entityId
  }
}

export function shoot(sourceId, cid, origin, target) {
  return {
    type: ENTITY_ACTIONS.SHOOT,
    id: sourceId,
    payload: { origin, target, cid }
  }
}
