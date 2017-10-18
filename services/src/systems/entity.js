import SharedEntitySystem from "../shared/systems/entity"
import Types, { ITEM_TYPES } from "../shared/types"

import Player from "../shared/entities/player"
import Tile from "../shared/entities/tile"
import Item from "../shared/entities/item"

export default class EntitySystem extends SharedEntitySystem {
  constructor(entities, actions, redis) {
    super(entities, actions)

    this.redis = redis
  }

  addEntity(entity) {
    if (entity.type === Types.PLAYER) {
      entity = Player(entity)
      // } else if(entity.type === Types.Tile) {
      //   entity = Tile(entity)
    } else if (ITEM_TYPES.includes(entity.type)) {
      entity = Item(entity)
    } else {
      console.log("err")
    }

    entity = super.addEntity(entity)

    this.redis
      .hmset(`entity:${entity.id}`, entity)
      .catch(err => console.log("error", err))

    return entity
  }
}
