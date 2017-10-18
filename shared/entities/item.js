import Types from "../types"

export default function Item({ x, y, name, type, src }) {
  return {
    type,

    collidable: true,

    name,

    src,

    x,

    y
  }
}
