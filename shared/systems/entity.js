import Types, { ITEM_TYPES } from "../types"
import { ENTITY_ACTIONS } from "../actions"
import { generateId } from "../utils"

const acceleration = 5

const getFirstBagSlot = bags => {
  for (let bagSlot = 0; bagSlot < bags.length; bagSlot++) {
    const bag = bags[bagSlot]

    for (let r = 0; r < bag.height; r++) {
      for (let c = 0; c < bag.width; c++) {
        const slot = r * bag.width + c

        if (!bag[slot]) {
          return { bagSlot, slot }
        }
      }
    }
  }
}

export default class EntitySystem {
  constructor(entities = {}, actions = []) {
    this.entities = entities

    this.collidables = Object.values(entities).reduce((collidables, entity) => {
      if (entity.collidable) {
        collidables.add(entity.id)
      }

      return collidables
    }, new Set())

    this.activeEntities = Object.values(
      entities
    ).reduce((activeEntities, entity) => {
      if (entity.vX || entity.vY || entity.duration || entity.dest) {
        activeEntities.add(entity.id)
      }

      return activeEntities
    }, new Set())

    this.actions = actions

    this.count = this.count.bind(this)
    this.get = this.get.bind(this)
    this.removeEntity = this.removeEntity.bind(this)
    this.addEntity = this.addEntity.bind(this)
    this.addAction = this.addAction.bind(this)
    this.shoot = this.shoot.bind(this)
    this.applyAction = this.applyAction.bind(this)
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
    this.entities = {}
    this.actions = []
  }

  removeEntity(id) {
    this.collidables.delete(id)

    this.activeEntities.delete(id)

    delete this.entities[id]
  }

  addEntity(entity) {
    console.log("adding entity", entity)

    if (!entity.id) {
      entity.id = generateId()
    }

    this.entities[entity.id || entity.cid] = entity

    if (entity.collidable) {
      this.collidables.add(entity.id)
    }

    return entity
  }

  addAction(action) {
    this.actions.push(action)
  }

  checkDuration(entity) {
    if (entity.expiration && entity.expiration < this.currentTime) {
      entity.deleted = true
      return { deleted: true }
    }
    return {}
  }

  // getOppositeSide(side) {
  //   switch(side) {
  //     case 'top': return 'bottom'
  //     case 'bottom': return 'top'
  //     case 'left': return 'right'
  //     case 'right': return 'left'
  //   }
  // }

  checkCollision(entity) {
    for (let id of this.collidables) {
      if (id === entity.id) {
        continue
      }

      const otherEntity = this.entities[id]

      if (
        otherEntity.x === entity.x &&
        otherEntity.y === entity.y &&
        otherEntity.collidable
      ) {
        return {
          collision: id
        }
      }
    }

    return {}
  }

  updatePosition(entity) {
    let update = {}

    if (!entity.vX && !entity.vY) {
      return update
    }

    if (entity.vX) {
      entity.pX += entity.vX * 5 // * dt
    }
    if (entity.vY) {
      entity.pY += entity.vY * 5 // * dt
    }

    entity.lastX = entity.x
    entity.lastY = entity.y

    entity.x = Math.floor(entity.pX / 24)
    entity.y = Math.floor(entity.pY / 24)

    if (entity.x === entity.dest.x && entity.y === entity.dest.y) {
      entity.pX = entity.dest.pX
      entity.pY = entity.dest.pY

      entity.vX = 0
      entity.vY = 0

      delete entity.dest

      update = {
        x: entity.x,
        y: entity.y,
        pX: entity.pX,
        pY: entity.pY,
        vX: 0,
        vY: 0
      }

      this.activeEntities.delete(entity.id)
    } else if (entity.x === entity.dest.x) {
      entity.pX = entity.dest.pX
      entity.vX = 0
    } else if (entity.y === entity.dest.y) {
      entity.pY = entity.dest.pY
      entity.vY = 0
    }

    if (entity.sprite) {
      entity.sprite.position.x = entity.pX
      entity.sprite.position.y = entity.pY
    }

    return update
  }

  calculateMoveVector(origin, target) {
    const dX = target.pX - origin.pX
    const dY = target.pY - origin.pY

    const magnitude = Math.sqrt(dX * dX + dY * dY)

    const vX = dX / magnitude
    const vY = dY / magnitude

    return {
      vX,
      vY
    }
  }

  move(entity, target) {
    const { vX, vY } = this.calculateMoveVector(entity, target)

    entity.vX = vX

    entity.vY = vY

    entity.dest = target

    return { vX, vY, dest: target }
  }

  shoot(source, { origin, target, cid }) {
    const bolt = {
      type: "bolt",
      cid,
      x: source.x,
      y: source.y,
      sid: source.id,
      origin,
      target
    }

    this.addEntity(bolt)
  }

  gain(stat, target, { amount }) {
    const maxStat = `max${stat}`
    stat = stat.toLowerCase()
    target[stat] += amount //verify valid amt

    if (target[stat] > target[maxStat]) {
      target[stat] = target[maxStat]
    }
  }

  applyAction(updates, action) {
    let entity = this.entities[action.id]

    switch (action.type) {
      case ENTITY_ACTIONS.MOVE:
        updates[entity.id] = {
          id: entity.id,
          ...(updates[entity.id] || {}),
          ...this.move(entity, action.payload)
        }
        this.activeEntities.add(entity.id)
        return updates
      case ENTITY_ACTIONS.SHOOT:
        updates[entity.id] = {
          id: entity.id,
          ...(updates[entity.id] || {}),
          ...this.shoot(entity, action.payload)
        }
        return updates
      // Need to use item id in action.payload to use up that item in player inventory
      case ENTITY_ACTIONS.GAIN_HEALTH:
        this.gain("Health", entity, action.payload)
        break
      case ENTITY_ACTIONS.GAIN_MANA:
        this.gain("Mana", entity, action.payload)
        break
      case ENTITY_ACTIONS.REMOVE:
        updates[entity.id] = {
          id: entity.id,
          ...(updates[entity.id] || {}),
          deleted: true
        }
        return updates
      case ENTITY_ACTIONS.ADD:
        entity = this.addEntity(action.payload)

        updates[entity.id] = {
          id: entity.id,
          ...entity
        }
        return updates
      default:
        return updates
    }
  }

  updateEntity(updates, id) {
    const entity = this.entities[id]

    const update = {
      id,
      ...this.updatePosition(entity),
      ...this.checkCollision(entity),
      ...this.checkDuration(entity)
    }

    if (Object.keys(update).length > 1) {
      updates[id] = {
        ...(updates[id] || {}),
        ...update
      }

      if (update.collision) {
        const collisionEntity = this.entities[update.collision]
        if (entity.type === Types.PLAYER) {
          if (ITEM_TYPES.includes(collisionEntity.type)) {
            const { sprite, ...item } = collisionEntity

            const openSlot = getFirstBagSlot(entity.bags)

            if (openSlot) {
              updates[id] = {
                ...(updates[id] || {}),
                bags: Object.assign([], entity.bags, {
                  [openSlot.bagSlot]: {
                    ...entity.bags[openSlot.bagSlot],
                    [openSlot.slot]: item
                  }
                })
              }

              entity.bags[openSlot.bagSlot][openSlot.slot] = collisionEntity

              this.removeEntity(collisionEntity.id)
            }
          } else {
            if (entity.lastX && entity.lastY) {
              delete entity.dest
              entity.vX = 0
              entity.vY = 0
              entity.x = entity.lastX
              entity.y = entity.lastY
              entity.pX = entity.x * 24 + 12
              entity.pY = entity.y * 24 + 12
              entity.sprite.position.x = entity.pX
              entity.sprite.position.y = entity.pY
            }
          }
        }
      }

      if (update.deleted || update.health <= 0) {
        this.removeEntity(id)
      }
    }

    return updates
  }

  update() {
    this.currentTime = new Date().getTime()

    let updates = this.actions.reduce(this.applyAction, {})

    updates = Array.from(this.activeEntities).reduce(this.updateEntity, updates)

    this.actions = []

    return Object.values(updates)
  }
}
