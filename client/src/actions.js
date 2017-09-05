import {
  AUTH_ACTIONS,
  CHAT_ACTIONS,
  ENTITY_ACTIONS,
  CHAT_CHANNELS
} from "shared/constants"
import { generateId } from "utils"

export const chatMessage = ({
  time,
  to,
  message,
  channel = CHAT_CHANNELS.GLOBAL
}) => ({
  type: CHAT_ACTIONS.MESSAGE,
  payload: {
    time,
    to,
    from: window.LR.name,
    message,
    channel
  }
})

export const noChatRecipient = ({ to, from }) => ({
  type: CHAT_ACTIONS.NO_RECIPIENT,
  payload: { to, from }
})

export const authenticate = name => ({
  type: AUTH_ACTIONS.AUTHENTICATE,
  payload: name
})

// change to entityUpdates
export function updatedEntities(updates) {
  if (updates.length > 0) {
    updates = updates.map(({ sprite, ...socketEntity }) => socketEntity)

    return {
      type: ENTITY_ACTIONS.UPDATE,
      payload: updates
    }
  }

  return { type: ENTITY_ACTIONS.UPDATE }
}

export function entityActions(actions) {
  return {
    type: ENTITY_ACTIONS.ACTIONS,
    payload: actions
  }
}
