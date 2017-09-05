import EntitySystem from "shared/systems/entity"
import { Player, Bolt } from "../entities"

const createClientEntity = entity => {
  console.log("creating", entity.type)
  switch (entity.type) {
    case "bolt":
      return Bolt(entity)
    case "player":
      return Player(entity)
    default:
      throw "errror"
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
    this.mergeEntities = this.mergeEntities.bind(this)
  }

  addEntity(entity) {
    entity = createClientEntity(entity)

    if (entity.sprite) {
      this.renderer.addSprite(entity.sprite)
    }

    return super.addEntity(entity)
  }

  removeEntity(entity) {
    if (entity.sprite) {
      this.renderer.removeSprite(entity.sprite)
    }

    return super.removeEntity(entity)
  }

  mergeEntities(otherEntities) {
    for (let i = 0, length = otherEntities.length; i < length; i++) {
      const otherEntity = otherEntities[i]

      const ourEntity = this.entities[otherEntity.id || otherEntity.cid]

      if (ourEntity) {
        if (otherEntity.deleted) {
          this.removeEntity(ourEntity)
        } else {
          Object.keys(otherEntity).forEach(updatedKey => {
            ourEntity[updatedKey] = otherEntity[updatedKey]
          })

          if (ourEntity.sprite) {
            ourEntity.sprite.position.x = ourEntity.x
            ourEntity.sprite.position.y = ourEntity.y
          }
        }
      } else {
        if (!otherEntity.deleted) {
          this.addEntity(otherEntity)
        }
      }
    }
  }
}
