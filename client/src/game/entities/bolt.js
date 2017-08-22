import { generateId } from 'utils'

const speed = 10;

const duration = 10;

const knockback = 5;

export default function Bolt(entity) {
  const dX = entity.tX - entity.x;
  const dY = entity.tY - entity.y;

  const magnitude = Math.sqrt(dX * dX + dY * dY);

  const vX = dX / magnitude * speed
  const vY = dY / magnitude * speed

  const texture = PIXI.loader.resources['effects'].textures['effect-orb-blue-1.png'];

  const sprite = new PIXI.Sprite(texture);

  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;

  sprite.position.x = entity.x;
  sprite.position.y = entity.y;

  return {
    ...entity,

    cid: generateId(),

    sprite,

    knockback,

    duration,

    vX,

    vY,
  }
}
