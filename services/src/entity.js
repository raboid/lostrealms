import Service from "./service"
import EntitySystem from "./systems/entity"
import { ENTITY_ACTIONS, addEntity } from "./shared/actions"
import { generateId, rand } from "./shared/utils"

import Types from "./shared/types"
import Objects from "./shared/objects"

class EntityService extends Service {
  constructor(config) {
    super(config)

    this.onEntitiesChannel = this.onEntitiesChannel.bind(this)
    this.onActionChannel = this.onActionChannel.bind(this)
    this.tick = this.tick.bind(this)

    this.subscribe("entities", this.onEntitiesChannel)

    this.entitySystem = new EntitySystem([], [], this.redis)

    this.entitySystem.addAction(
      addEntity({ ...Objects["Ice Sword"], x: 2, y: 2 })
    )

    // for(let x=0; x < 50; x++) {
    //   for(let n=0; n < 50; n++) {
    //     this.entitySystem.addAction(addEntity({ type: Types.GROUND, x, y: n, frame: rand(1,2) }))
    //   }
    // }

    //this.entitySystem.addAction(addEntity({ type: Types.WALL, x: 20, y: 15 }))

    setTimeout(this.tick, this.timestep)
    this.log("service started")
  }

  tick() {
    setTimeout(this.tick, this.timestep)

    const updates = this.entitySystem.update()

    if (updates.length === 0) {
      return
    }

    //this.log("updates", updates)

    const pipeline = this.redis.pipeline()

    updates.forEach(update => {
      if (update.deleted) {
        pipeline.del(`entity:${update.id}`)
      } else {
        pipeline.hmset(`entity:${update.id}`, update)
      }
      this.publishUpdate(update)
    })

    pipeline.exec()
  }

  publishUpdate(update) {
    this.log("publishing entity channel", update)
    this.publish(`entity:${update.id}`, update)
      .then(listeners => {
        if (!listeners) {
          // No one cares about these updates so unsub
          this.unsubscribe(`actions:${update.id}`)

          this.entitySystem.removeEntity(update.id)
        }
      })
      .catch(err => this.log(err))
  }

  onEntitiesChannel(entity) {
    entity = this.entitySystem.addEntity(entity)
    if (entity.type === Types.PLAYER) {
      const playerKey = `player:${entity.name}`
      this.redis
        .hmset(playerKey, entity)
        .then(() => this.publish(playerKey, entity))
    }

    this.subscribe(`actions:${entity.id}`, this.onActionChannel)
    this.publish(`entity:${entity.id}`, entity)
  }

  onActionChannel(action) {
    this.log("RECEIVED", action)
    this.entitySystem.addAction(action)
  }
}

const config = {
  redis: {
    port: 6379,
    subscriber: true
  },
  tickRate: 20,
  entityLimit: 10000,
  name: "ENTITY"
}

new EntityService(config)
