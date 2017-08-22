export const REDIS_CHANNELS = {
  CHAT: 'chat',
  GAME: 'game',
  ENTITY: 'entity'
}

export const CHAT_ACTIONS = {
  MESSAGE: 'chat.MESSAGE',
  NO_RECIPIENT: 'chat.NO_RECIPIENT'
}

export const AUTH_ACTIONS = {
  AUTHENTICATE: 'auth.AUTHENTICATE',
  AUTHENTICATED: 'auth.AUTHENTICATED',
  UNAUTHENTICATED: 'auth.UNAUTHENTICATED'
}

export const ENTITY_ACTIONS = {
  ADD: 'entity.ADD',
  UPDATE: 'entity.UPDATE',
  REMOVE: 'entity.REMOVE',
  MOVE_UP: 'entity.MOVE_UP',
  MOVE_DOWN: 'entity.MOVE_DOWN',
  MOVE_RIGHT: 'entity.MOVE_RIGHT',
  MOVE_LEFT: 'entity.MOVE_LEFT',
  STOP: 'entity.STOP',
  ACTIONS: 'entity.ACTIONS',
}

export const CHAT_CHANNELS = {
  GLOBAL: 'GLOBAL',
  LOCAL: 'LOCAL'
}

export const ENTITY_TYPES = {
  PLAYER: 'PLAYER'
};