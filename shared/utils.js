export const decode = message =>
  JSON.parse(message, (key, value) => {
    const intValue = parseInt(value)
    return isNaN(intValue) ? value : intValue
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
  return Math.random().toString(36).slice(-12)
}
