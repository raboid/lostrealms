export const decode = message =>
  JSON.parse(message, (key, value) => {
    return value
  })

export const encode = action =>
  JSON.stringify(action, (key, value) => {
    if (value === undefined) {
      return null
    }
    if (key === "sprite") {
      return undefined
    }
    return value
  })

export const generateId = () => {
  return Math.random()
    .toString(36)
    .slice(-12)
}

export function rand(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
