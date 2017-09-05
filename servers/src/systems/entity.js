import SharedEntitySystem from "../shared/systems/entity"
import * as Entities from "../shared/entities"

export default class EntitySystem extends SharedEntitySystem {
  constructor(entities, actions, redis) {
    super(entities, actions)

    this.redis = redis
  }

  addEntity(entity) {
    console.log("server adding", entity, typeof entity)
    switch (entity.type) {
      case "player":
        entity = Entities.Player(entity)
        break
      case "bolt":
        entity = Entities.Bolt(entity)
        break
      default:
        return Promise.reject()
    }

    return this.redis.incr("next_entity_id").then(id => {
      entity.id = parseInt(id)

      super.addEntity(entity)

      return this.redis
        .hmset(`entity:${id}`, entity)
        .then(() => Promise.resolve(entity))
    })
  }
}
