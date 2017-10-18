import EntitySystem from "shared/systems/entity"
import Types, { ITEM_TYPES } from "shared/types"

//import Tile from "../entities/Tile"
import Player from "../entities/player"
import Item from "../entities/item"

const createClientEntity = entity => {
  console.log("creating", entity.type)
  if (entity.type === Types.PLAYER) {
    return Player(entity)
    // } else if(entity.type === Types.TILE) {
    //   return Tile(entity)
  } else if (ITEM_TYPES.includes(entity.type)) {
    return Item(entity)
  } else {
    console.log("la")
  }
}

export default class ClientEntitySystem extends EntitySystem {
  constructor(remoteEntities, actions, renderer) {
    const entities = Object.values(
      remoteEntities
    ).reduce((ents, remoteEntity) => {
      const entity = createClientEntity(remoteEntity)

      if (entity.sprite) {
        renderer.addSprite(entity.sprite)
      }

      ents[entity.id] = entity

      return ents
    }, {})

    super(entities, actions)

    this.renderer = renderer
    this.addEntity = this.addEntity.bind(this)
    this.removeEntity = this.removeEntity.bind(this)
    this.mergeUpdates = this.mergeUpdates.bind(this)
  }

  addEntity(entity) {
    entity = createClientEntity(entity)

    if (entity.sprite) {
      this.renderer.addSprite(entity.sprite)
    }

    return super.addEntity(entity)
  }

  removeEntity(id) {
    const sprite = this.entities[id].sprite

    if (sprite) {
      this.renderer.removeSprite(sprite)
    }

    return super.removeEntity(id)
  }

  mergeUpdates(updates) {
    for (let i = 0, length = updates.length; i < length; i++) {
      const update = updates[i]

      const entity = this.entities[update.id || update.cid]

      if (entity) {
        if (update.deleted) {
          this.removeEntity(entity.id)
        } else {
          Object.keys(update).forEach(key => {
            entity[key] = update[key]
          })

          if (entity.sprite) {
            if (typeof update.pX !== "undefined") {
              entity.sprite.position.x = update.pX
            }
            if (typeof update.pY !== "undefined") {
              entity.sprite.position.y = update.pY
            }
          }
        }
      } else {
        if (!update.deleted) {
          this.addEntity(update)
        }
      }
    }
  }
}
