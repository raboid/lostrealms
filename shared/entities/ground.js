import Types from '../types'

const width = 24
const height = 24

const halfWidth = width / 2
const halfHeight = height / 2

export default function Ground({ id, sid, cid, x, y }) {
  return {
    type: Types.GROUND, //Types.BOLT

    id,

    sid,

    cid,

    width,

    height,

    halfWidth,

    halfHeight,

    centerX: x + halfWidth,

    centerY: y + halfHeight,

    x,

    y
  }
}
