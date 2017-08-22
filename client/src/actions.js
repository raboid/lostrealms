import { CHAT_ACTIONS, AUTH_ACTIONS, ENTITY_ACTIONS, CHAT_CHANNELS } from './constants';
import { encode } from 'shared/utils';

export const chatMessage = ({ time, to, message, channel=CHAT_CHANNELS.GLOBAL }) => encode({
  type: CHAT_ACTIONS.MESSAGE,
  payload: {
    time,
    to,
    from: window.LR.name,
    message,
    channel
  }
})

export const noChatRecipient = ({ to, from }) => encode({
  type: CHAT_ACTIONS.NO_RECIPIENT,
  payload: { to, from }
})

export const authenticate = (name) => encode({
  type: AUTH_ACTIONS.AUTHENTICATE,
  payload: name
})

// change to entityUpdates
export function updatedEntities(updates) {
  if(updates.length > 0) {
    updates = updates.map(({ sprite, ...socketEntity }) => socketEntity);

    return encode({
      type: ENTITY_ACTIONS.UPDATE,
      payload: updates
    })
  }

  return encode({ type: ENTITY_ACTIONS.UPDATE })
}

export function entityActions(actions) {
  return encode({
    type: ENTITY_ACTIONS.ACTIONS,
    payload: actions
  })
}

export function addEntity(entity) {
  const { sprite, ...socketEntity } = entity;

  return encode({
    type: ENTITY_ACTIONS.ADD,
    payload: socketEntity
  })
}

export function removeEntity(entity) {
  const { sprite, ...socketEntity } = entity;

  return encode({
    type: ENTITY_ACTIONS.REMOVE,
    payload: socketEntity
  })
}

export function moveUp(entityId) {
  return encode({
    type: ENTITY_ACTIONS.MOVE_UP,
    id: entityId
  })
}

export function moveDown(entityId) {
  return encode({
    type: ENTITY_ACTIONS.MOVE_DOWN,
    id: entityId
  })
}

export function moveRight(entityId) {
  return encode({
    type: ENTITY_ACTIONS.MOVE_RIGHT,
    id: entityId
  })
}

export function moveLeft(entityId) {
  return encode({
    type: ENTITY_ACTIONS.MOVE_LEFT,
    id: entityId
  })
}

export function stopRightLeft(entityId) {
  return encode({
    type: ENTITY_ACTIONS.STOP_RIGHT_LEFT,
    id: entityId
  })
}

export function stopUpDown(entityId) {
  return encode({
    type: ENTITY_ACTIONS.STOP_UP_DOWN,
    id: entityId
  })
}