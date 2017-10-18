import { CHAT_CHANNELS } from "./constants"

export const AUTH_ACTIONS = {
  AUTHENTICATE: "auth.AUTHENTICATE",
  AUTHENTICATED: "auth.AUTHENTICATED",
  UNAUTHENTICATED: "auth.UNAUTHENTICATED"
}

export const CHAT_ACTIONS = {
  MESSAGE: "chat.MESSAGE",
  NO_RECIPIENT: "chat.NO_RECIPIENT"
}

export const ENTITY_ACTIONS = {
  ADD: "entity.ADD",
  UPDATE: "entity.UPDATE",
  REMOVE: "entity.REMOVE",
  MOVE: "entity.MOVE",
  MOVE_UP: "entity.MOVE_UP",
  MOVE_DOWN: "entity.MOVE_DOWN",
  MOVE_RIGHT: "entity.MOVE_RIGHT",
  MOVE_LEFT: "entity.MOVE_LEFT",
  STOP_LEFT_RIGHT: "entity.STOP_LEFT_RIGHT",
  STOP_UP_DOWN: "entity.STOP_UP_DOWN",
  STOP: "entity.STOP",
  ACTIONS: "entity.ACTIONS",
  SHOOT: "entity.SHOOT",
  GAIN_MANA: "entity.GAIN_MANA",
  GAIN_HEALTH: "entity.GAIN_HEALTH",
  USE_KEY: "entity.USE_KEY"
}

export const PLAYER_ACTIONS = {
  ADD: "player.ADD"
}

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

export function move(entityId, target) {
  return {
    type: ENTITY_ACTIONS.MOVE,
    id: entityId,
    payload: target
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
