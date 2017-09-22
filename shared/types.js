export const ENTITY_TYPES = [
  'PLAYER',
  'BOLT',
  'GROUND',
  'WALL',
]

export const EQUIPMENT_TYPES = [
  'SWORD',
  'SHIELD',
  'HELMET',
  'BREASTPLATE',
  'BELT',
  'GREAVES',
  'BOOTS',
  'GLOVES',
  'CAPE',
  'RING',
  'NECKLACE',
];

export const ITEM_TYPES = [
  ...EQUIPMENT_TYPES,

  'BAG',
  'POTION',
  'KEY',
]

export default {
  ...ENTITY_TYPES.reduce((obj, type) => ({ ...obj, [type]: type }), {}),
  ...ITEM_TYPES.reduce((obj, type) => ({ ...obj, [type]: type }), {})
}