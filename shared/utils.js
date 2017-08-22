export const decode = message => JSON.parse(message, (key, value) => isNaN(value) ? value : parseInt(value));

export const encode = action => JSON.stringify(action, (k,v) => {
  if(v === undefined) {
    return null;
  }
  if(k === 'sprite') {
    return undefined;
  }
  return v;
});