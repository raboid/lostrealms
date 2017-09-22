import SharedEntitySystem from "../shared/systems/entity"
import Bolt from '../shared/entities/bolt';
import Player from '../shared/entities/player';
import Ground from '../shared/entities/ground';
import Wall from '../shared/entities/wall'

export default class EntitySystem extends SharedEntitySystem {
  constructor(entities, actions, redis) {
    super(entities, actions)

    this.redis = redis
  }

  addEntity(entity) {
    console.log("server adding", entity, typeof entity)
    switch (entity.type) {
      case "player":
        entity = Player(entity)
        break
      case "bolt":
        entity = Bolt(entity)
        break
      case "ground":
        entity = Ground(entity)
        break
      case "wall":
        entity = Wall(entity)
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
        .catch((err) => console.log('error', err))
    })
  }
}
