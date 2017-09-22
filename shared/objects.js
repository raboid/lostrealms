import Types from './types';
import { ENTITY_ACTIONS } from './actions';

export const SWORDS = {
  'Wooden Sword': {
    name: 'Wooden Sword',
    type: Types.SWORD,
    src: 'sword-wooden.png',
  },
}

export const SHIELDS = {
  'Wooden Shield': {
    name: 'Wooden Shield',
    type: Types.SHIELD,
    src: 'shield-wooden.png',
  },
}

export const CAPES = {
  'Guild Cape': {
    name: 'Guild Cape',
    type: Types.CAPE,
    src: 'cape-guild.png'
  }
}

export const HELMETS = {
  'Wooden Helmet': {
    name: 'Wooden Helmet',
    type: Types.HELMET,
    src: 'helmet-wooden.png'
  }
}

export const BREASTPLATES = {
  'Wooden Breastplate': {
    name: 'Wooden Breastplate',
    type: Types.BREASTPLATE,
    src: 'breastplate-wooden.png',
  },
}

export const BELTS = {
  'Wooden Belt': {
    name: 'Wooden Belt',
    type: Types.BELT,
    src: 'belt-wooden.png',
  },
}

export const GREAVES = {
  'Wooden Greaves': {
    name: 'Wooden Greaves',
    type: Types.GREAVES,
    src: 'greaves-wooden.png',
  },
}

export const BOOTS = {
  'Wooden Boots': {
    name: 'Wooden Boots',
    type: Types.BOOTS,
    src: 'boots-wooden.png',
  },
}

export const GLOVES = {
  'Wooden Gloves': {
    name: 'Wooden Gloves',
    type: Types.GLOVES,
    src: 'gloves-wooden.png',
  },
}

export const RINGS = {
  'Silver Ring': {
    name: 'Silver Ring',
    type: Types.RING,
    src: 'item-ring-1.png',//'ring-silver.png'
  },
  'Gold Ring': {
    name: 'Gold Ring',
    type: Types.RING,
    src: 'item-ring-2.png'
  }
}

export const NECKLACES = {
  'Silver Necklace': {
    name: 'Silver Necklace',
    type: Types.NECKLACE,
    src: 'necklace-silver.png'
  }
}

export const BAGS = {
  'Plain Bag': {
    name: 'Plain Bag',
    type: Types.BAG,
    width: 3,
    height: 3,
  }
}

export const POTIONS = {
  'Small Health Potion': {
    name: 'Small Health Potion',
    type: Types.POTION,
    src: 'item-potion-red-s.png',//'potion-health-small.png'
    use: { type: ENTITY_ACTIONS.GAIN_HEALTH, payload: { amount: 10 } },
    stack: 1
  }, 
  'Small Mana Potion': {
    name: 'Small Mana Potion',
    type: Types.POTION,
    src: 'item-potion-blue-s.png',
    use: { type: ENTITY_ACTIONS.GAIN_MANA, payload: { amount: 10  } },
    stack: 1
  }
}

export const KEYS = {
  'Realm Key': {
    name: 'Realm Key',
    type: Types.KEY,
    src: 'key-realm.png',
    use: { type: ENTITY_ACTIONS.USE_KEY, payload: 'Realm Key' }
  }
}


export default {
  ...SWORDS,
  ...SHIELDS,

  ...HELMETS,
  ...BREASTPLATES,
  ...BELTS,
  ...GREAVES,
  ...BOOTS,
  ...CAPES,

  ...RINGS,
  ...NECKLACES,

  ...BAGS,

  ...POTIONS,
  ...KEYS,
}