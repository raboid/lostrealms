import Types from "../types"

export default function Ground({ name, collidable, x, y, src }) {
  return {
    type: Types.GROUND,

    src,

    x,

    y
  }
}
