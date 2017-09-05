const x = 100
const y = 100

const width = 24
const height = 24

const halfWidth = width / 2
const halfHeight = height / 2

export default function Player({ name }) {
  return {
    type: "player",

    collidable: true,

    health: 100,

    name,

    width,

    height,

    halfWidth,

    halfHeight,

    centerX: x + halfWidth,

    centerY: y + halfHeight,

    x,

    y,

    vX: 0,

    vY: 0
  }
}
