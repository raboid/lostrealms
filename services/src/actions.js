import { AUTH_ACTIONS } from "./shared/actions"

export const authenticated = (playerId, entities) => ({
  type: AUTH_ACTIONS.AUTHENTICATED
})

export const unauthenticated = error => ({
  type: AUTH_ACTIONS.UNAUTHENTICATED,
  payload: {
    error
  }
})
