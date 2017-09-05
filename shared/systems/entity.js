const acceleration = 5

import Bolt from "../entities/bolt"

export const ENTITY_ACTIONS = {
  ADD: "entity.ADD",
  UPDATE: "entity.UPDATE",
  REMOVE: "entity.REMOVE",
  MOVE_UP: "entity.MOVE_UP",
  MOVE_DOWN: "entity.MOVE_DOWN",
  MOVE_RIGHT: "entity.MOVE_RIGHT",
  MOVE_LEFT: "entity.MOVE_LEFT",
  STOP_LEFT_RIGHT: "entity.STOP_LEFT_RIGHT",
  STOP_UP_DOWN: "entity.STOP_UP_DOWN",
  ACTIONS: "entity.ACTIONS",
  SHOOT: "entity.SHOOT"
}

export default class EntitySystem {
  constructor(entities = {}, actions = []) {
    this.entities = entities
    this.actions = actions

    this.updatedEntityIds = new Set()

    this.count = this.count.bind(this)
    this.get = this.get.bind(this)
    this.removeEntity = this.removeEntity.bind(this)
    this.addEntity = this.addEntity.bind(this)
    this.addAction = this.addAction.bind(this)
    this.shoot = this.shoot.bind(this)
    this.applyAction = this.applyAction.bind(this)
    this.processUpdate = this.processUpdate.bind(this)
    this.updateEntity = this.updateEntity.bind(this)
    this.update = this.update.bind(this)
    this.updatePosition = this.updatePosition.bind(this)
    this.checkDuration = this.checkDuration.bind(this)
  }

  count() {
    return Object.keys(this.entities).length
  }

  get(id) {
    return this.entities[id]
  }

  destroy() {
    this.updatedEntityIds = new Set()
    this.entities = {}
    this.actions = []
  }

  removeEntity(entity) {
    delete this.entities[entity.id || entity.cid]
  }

  addEntity(entity) {
    console.log("adding entity", entity)
    this.entities[entity.id || entity.cid] = entity

    this.updatedEntityIds.add(entity.id || entity.cid)

    return entity
  }

  addAction(action) {
    this.actions.push(action)
  }

  checkDuration(entity) {
    if (entity.expiration && entity.expiration < this.currentTime) {
      entity.deleted = true
      return true
    }
    return false
  }

  checkCollision(entity) {
    return Object.values(this.entities).some(otherEntity => {
      if (
        otherEntity !== entity &&
        otherEntity.collidable &&
        this.hitTestRectangle(entity, otherEntity)
      ) {
        entity.collision = otherEntity.id || otherEntity.cid
        otherEntity.collision = entity.id || entity.cid
        this.updatedEntityIds.add(otherEntity.id || otherEntity.cid)
        return true
      }
      return false
    })
  }

  hitTestRectangle(entityA, entityB) {
    const vx = entityA.centerX - entityB.centerX
    const vy = entityA.centerY - entityB.centerY

    const combinedHalfWidths = entityA.halfWidth + entityB.halfWidth
    const combinedHalfHeights = entityA.halfHeight + entityB.halfHeight

    return (
      Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights
    )
  }

  updatePosition(entity) {
    if (!(entity.vX || entity.vY)) {
      return false
    }

    //console.log('ENT SYS: updating position', entity.x, entity.y, typeof entity.x, typeof entity.y)

    entity.x += entity.vX // * dt
    entity.y += entity.vY // * dt

    entity.centerX = entity.x + entity.halfWidth
    entity.centerY = entity.y + entity.halfHeight

    if (entity.sprite) {
      entity.sprite.position.x = entity.x
      entity.sprite.position.y = entity.y
    }

    return true
  }

  shoot(source, { origin, target, cid }) {
    const bolt = {
      type: "bolt",
      cid,
      x: source.x,
      y: source.y,
      origin,
      target
    }

    this.addEntity(bolt)
  }

  applyAction(action) {
    const entity = this.entities[action.id]

    if (!entity) {
      return
    }

    switch (action.type) {
      case ENTITY_ACTIONS.MOVE_UP:
        entity.vY = -acceleration
        break
      case ENTITY_ACTIONS.MOVE_DOWN:
        entity.vY = acceleration
        break
      case ENTITY_ACTIONS.MOVE_LEFT:
        entity.vX = -acceleration
        break
      case ENTITY_ACTIONS.MOVE_RIGHT:
        entity.vX = acceleration
        break
      case ENTITY_ACTIONS.STOP_UP_DOWN:
        entity.vY = 0
        break
      case ENTITY_ACTIONS.STOP_LEFT_RIGHT:
        entity.vX = 0
        break
      case ENTITY_ACTIONS.SHOOT:
        this.shoot(entity, action.payload)
        break
      case ENTITY_ACTIONS.REMOVE:
        entity.deleted = true
        break
      default:
        return
    }

    this.updatedEntityIds.add(entity.id || entity.cid)
  }

  updateEntity(entity) {
    const updatedPosition = this.updatePosition(entity)
    const collision = updatedPosition ? this.checkCollision(entity) : false
    collision && console.log("collision")
    const durationExpired = this.checkDuration(entity)
    if (updatedPosition || durationExpired || collision) {
      this.updatedEntityIds.add(entity.id || entity.cid)
    }
  }

  processUpdate(updates, updatedEntityId) {
    const updatedEntity = this.entities[updatedEntityId]

    if (!updatedEntity) {
      return updates
    }

    if (updatedEntity.deleted || updatedEntity.health <= 0) {
      this.removeEntity(updatedEntity)
    }

    if (updatedEntity.collision) {
      switch (updatedEntity.type) {
        case "bolt":
          updatedEntity.deleted = true
          break
        case "player":
          if (this.entities[updatedEntity.collision].type === "bolt") {
            updatedEntity.health -= 100
          }
          break
      }
    }

    updates.push(updatedEntityId)

    return updates
  }

  update() {
    this.currentTime = new Date().getTime()

    this.actions.forEach(this.applyAction)

    Object.values(this.entities).forEach(this.updateEntity)

    const updatedEntityIds = Array.from(this.updatedEntityIds).reduce(
      this.processUpdate,
      []
    )

    this.actions = []

    this.updatedEntityIds = new Set()

    return updatedEntityIds
  }
}
