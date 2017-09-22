import Bolt from "../entities/bolt"
import Types from '../types'
import { ENTITY_ACTIONS } from '../actions'

const acceleration = 5

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

  getOppositeSide(side) {
    switch(side) {
      case 'top': return 'bottom'
      case 'bottom': return 'top'
      case 'left': return 'right'
      case 'right': return 'left'
    }
  }

  checkCollision(entity) {
    const collision = Object.values(this.entities).some(otherEntity => {
      if (
        otherEntity.collidable &&
        otherEntity !== entity &&
        otherEntity.id !== entity.id &&
        otherEntity.sid !== entity.id
      ) {
        const side = this.hitTestRectangle(entity, otherEntity)

        if(side) {
          entity.collision = { id: otherEntity.id || otherEntity.cid, side }

          otherEntity.collision = { id: entity.id || entity.cid, side: this.getOppositeSide(side) }

          this.updatedEntityIds.add(otherEntity.id || otherEntity.cid)

          return true
        }
      }
      return false
    })

    if(!collision) {
      delete entity.collision
    }

    return collision;
  }

  hitTestRectangle(entityA, entityB) {
    const dx = entityA.centerX - entityB.centerX
    const dy = entityA.centerY - entityB.centerY

    const width = entityA.halfWidth + entityB.halfWidth
    const height = entityA.halfHeight + entityB.halfHeight

    const overlapping = Math.abs(dx) <= width && Math.abs(dy) <= height;
    
    if(overlapping) {
      const wy = width * dy;
      const hx = height * dx;

      if (wy > hx) {
        if (wy > -hx) {
          return 'top'
        } 
        return 'right'
      } else if (wy > -hx) {
        return 'left'
      }
      return 'bottom';
    }

    return false;
  }

  updatePosition(entity) {
    //console.log('ENT SYS: updating position', entity.x, entity.y)

    entity.x += entity.vX // * dt
    entity.y += entity.vY // * dt

    entity.centerX = entity.x + entity.halfWidth
    entity.centerY = entity.y + entity.halfHeight

    if (entity.sprite) {
      entity.sprite.position.x = entity.x
      entity.sprite.position.y = entity.y
    }
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
    stat = stat.toLowerCase();
    target[stat] += amount //verify valid amt

    if(target[stat] > target[maxStat]) {
      target[stat] = target[maxStat]
    }
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
      case ENTITY_ACTIONS.GAIN_HEALTH:
        this.gain('Health', entity, action.payload)
        break
      case ENTITY_ACTIONS.GAIN_MANA:
        this.gain('Mana', entity, action.payload)
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
    let updatedPosition = false
    let collision = false

    if(entity.collision) {
      collision = this.checkCollision(entity);
    } else if(entity.vX || entity.vY) {
      this.updatePosition(entity)
      updatedPosition = true;

      collision = this.checkCollision(entity)
    }

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
      console.log('collision', updatedEntity, this.entities[updatedEntity.collision.id])
      switch (updatedEntity.type) {
        case "bolt":
          updatedEntity.deleted = true
          break
        case "player":
          const otherEntity = this.entities[updatedEntity.collision.id];
          if (otherEntity) {
            switch(otherEntity.type) {
              case 'bolt':
                updatedEntity.health -= 100
                break
              default:
                switch(updatedEntity.collision.side) {
                  case 'bottom':
                    console.log('bottom')
                    updatedEntity.vY = -5
                    this.updatePosition(updatedEntity)
                    updatedEntity.vY = 0
                    break;
                  case 'top':
                    console.log('top')
                    updatedEntity.vY = 5
                    this.updatePosition(updatedEntity)
                    updatedEntity.vY = 0
                    break;
                  case 'left':
                    console.log('left')
                    updatedEntity.vX = 5
                    this.updatePosition(updatedEntity)
                    updatedEntity.vX = 0
                    break
                  case 'right':
                    console.log('right')
                    console.log('left')
                    updatedEntity.vX = -5
                    this.updatePosition(updatedEntity)
                    updatedEntity.vX = 0
                    break
                }
                break
            }
          }
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
