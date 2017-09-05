const speed = 10

const duration = 2000

const knockback = 5

const width = 24
const height = 24

const halfWidth = width / 2
const halfHeight = height / 2

export default function Bolt({ origin, target, x, y, cid }) {
  const dX = target.x - origin.x
  const dY = target.y - origin.y

  const magnitude = Math.sqrt(dX * dX + dY * dY)

  const vX = dX / magnitude * speed
  const vY = dY / magnitude * speed

  const startTime = new Date().getTime()

  const expiration = startTime + duration

  const centerX = x + halfWidth

  const centerY = y + halfHeight

  x = centerX + vX * 4

  y = centerY + vY * 4

  return {
    type: "bolt",

    collidable: true,

    cid,

    expiration,

    speed,

    knockback,

    width,

    height,

    halfWidth,

    halfHeight,

    centerX,

    centerY,

    x,

    y,

    vX,

    vY
  }
}
