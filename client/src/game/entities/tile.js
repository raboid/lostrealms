import SharedGround from "shared/entities/ground"

export default function Ground(entity) {
  const sprite = new PIXI.Sprite(
    PIXI.loader.resources["sheet"].textures[
      `tile-grass-${entity.frame || 1}.png`
    ]
  )

  //entity = SharedGround(entity)

  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.5

  sprite.position.x = entity.x * 24 + 12
  sprite.position.y = entity.y * 24 + 12

  sprite.layer = "ground"

  return {
    ...entity,

    sprite
  }
}
