export function saveRecord(key, payload) {
  const record = { payload, timestamp: new Date().getTime() };
  localStorage.setItem(key, JSON.stringify(record));
}

export function getRecord(key, cacheTime=0) {
  const data = localStorage.getItem(key);
  if(!data) { return null; }
  const record = JSON.parse(data);
  if(cacheTime && (record.timestamp + cacheTime < new Date().getTime())) {
    return null;
  }
  return record.payload;
}

export const generateId = () => {
  return Math.random().toString(36).slice(-12);
};

export const entityHasComponents = (entity, components) => {
  for(let i=0; i < components.length; i++) {
    if(!entity.hasOwnProperty(components[i])) { return false; }
  }
  return true;
};

export function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}