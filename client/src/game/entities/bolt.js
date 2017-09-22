import SharedBolt from "shared/entities/bolt"

export default function Bolt(entity) {
  const sprite = new PIXI.Sprite(
    PIXI.loader.resources["effects"].textures["effect-orb-blue-1.png"]
  )

  if (entity.origin && entity.target) {
    entity = SharedBolt(entity)
  }

  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.5

  sprite.position.x = entity.x
  sprite.position.y = entity.y

  entity.halfWidth = sprite.width / 2
  entity.halfHeight = sprite.height / 2

  entity.centerX = entity.x + entity.halfWidth
  entity.centerY = entity.y + entity.halfHeight

  return {
    ...entity,

    sprite
  }
}
