import Types from "./types"
import { ENTITY_ACTIONS } from "./actions"

export const SWORDS = {
  "Wood Sword": {
    name: "Wood Sword",
    type: Types.SWORD,
    src: "item-sword-wood.png"
  },

  "Magma Sword": {
    name: "Magma Sword",
    type: Types.SWORD,
    src: "item-sword-magma.png"
  },

  "Ice Sword": {
    name: "Ice Sword",
    type: Types.SWORD,
    src: "item-sword-ice.png"
  }
}

export const SHIELDS = {
  "Wood Shield": {
    name: "Wood Shield",
    type: Types.SHIELD,
    src: "item-shield-wood.png"
  },

  "Copper Shield": {
    name: "Copper Shield",
    type: Types.SHIELD,
    src: "item-shield-copper.png"
  },
  "Iron Shield": {
    name: "Iron Shield",
    type: Types.SHIELD,
    src: "item-shield-iron.png"
  },
  "Lead Shield": {
    name: "Lead Shield",
    type: Types.SHIELD,
    src: "item-shield-lead.png"
  },

  "Silver Shield": {
    name: "Silver Shield",
    type: Types.SHIELD,
    src: "item-shield-silver.png"
  },
  "Gold Shield": {
    name: "Gold Shield",
    type: Types.SHIELD,
    src: "item-shield-gold.png"
  },

  "Magma Shield": {
    name: "Magma Shield",
    type: Types.SHIELD,
    src: "item-shield-magma.png"
  },

  "Ice Shield": {
    name: "Ice Shield",
    type: Types.SHIELD,
    src: "item-shield-ice.png"
  }
}

export const HELMETS = {
  "Wood Helmet": {
    name: "Wood Helmet",
    type: Types.HELMET,
    src: "item-helmet-wood.png"
  },
  "Magma Helmet": {
    name: "Magma Helmet",
    type: Types.HELMET,
    src: "item-helmet-magma.png"
  }
}

export const BREASTPLATES = {
  "Wood Breastplate": {
    name: "Wood Breastplate",
    type: Types.BREASTPLATE,
    src: "item-breastplate-wood.png",
    def: 5
  },

  "Magma Breastplate": {
    name: "Magma Breastplate",
    type: Types.BREASTPLATE,
    src: "item-breastplate-magma.png",
    def: 240
  }
}

export const GREAVES = {
  "Wood Greaves": {
    name: "Wood Greaves",
    type: Types.GREAVES,
    src: "greaves-wood.png",
    def: 4
  },
  "Magma Greaves": {
    name: "Magma Greaves",
    type: Types.GREAVES,
    src: "item-greaves-magma.png",
    def: 230
  }
}

// export const CAPES = {
//   'Guild Cape': {
//     name: 'Guild Cape',
//     type: Types.CAPE,
//     src: 'cape-guild.png'
//   }
// }

// export const BELTS = {
//   'Wood Belt': {
//     name: 'Wood Belt',
//     type: Types.BELT,
//     src: 'item-belt-wood.png',
//   },
//   'Magma Belt': {
//     name: 'Magma Belt',
//     type: Types.BELT,
//     src: 'item-belt-magma.png'
//   }
// }

// export const BOOTS = {
//   'Wood Boots': {
//     name: 'Wood Boots',
//     type: Types.BOOTS,
//     src: 'item-boots-wood.png',
//   },
//   'Magma Boots': {
//     name: 'Magma Boots',
//     type: Types.BOOTS,
//     src: 'item-boots-magma.png'
//   }
// }

// export const GLOVES = {
//   'Wood Gloves': {
//     name: 'Wood Gloves',
//     type: Types.GLOVES,
//     src: 'item-gloves-wood.png',
//   },
//   'Magma Gloves': {
//     name: 'Magma Gloves',
//     type: Types.GLOVES,
//     src: 'item-gloves-magma.png'
//   }
// }

// export const RINGS = {
//   'Silver Ring': {
//     name: 'Silver Ring',
//     type: Types.RING,
//     src: 'item-ring-silver.png',
//   },
//   'Gold Ring': {
//     name: 'Gold Ring',
//     type: Types.RING,
//     src: 'item-ring-gold.png'
//   }
// }

// export const NECKLACES = {
//   'Silver Necklace': {
//     name: 'Silver Necklace',
//     type: Types.NECKLACE,
//     src: 'item-necklace-silver.png'
//   }
// }

export const BAGS = {
  Rucksack: {
    name: "Rucksack",
    src: "item-bag-rucksack.png",
    type: Types.BAG,
    width: 7,
    height: 4
  }
}

export const POTIONS = {
  "Small Health Potion": {
    name: "Small Health Potion",
    type: Types.POTION,
    src: "item-potion-health-1.png", //'potion-health-small.png'
    use: { type: ENTITY_ACTIONS.GAIN_HEALTH, payload: { amount: 10 } },
    stack: 1
  },
  "Small Mana Potion": {
    name: "Small Mana Potion",
    type: Types.POTION,
    src: "item-potion-mana-1.png",
    use: { type: ENTITY_ACTIONS.GAIN_MANA, payload: { amount: 10 } },
    stack: 1
  }
}

export const KEYS = {
  "Realm Key": {
    name: "Realm Key",
    type: Types.KEY,
    src: "key-realm.png",
    use: { type: ENTITY_ACTIONS.USE_KEY, payload: "Realm Key" }
  }
}

export const WOOD = {
  Log: {
    name: "Log",
    type: Types.WOOD,
    src: ".png"
  }
}

export const STONE = {
  Rock: {
    name: "Rock",
    type: Types.ROCK,
    src: ".png"
  }
}

export const ORE = {
  Copper: {
    name: "Rock",
    type: Types.ORE,
    src: ".png"
  },
  Iron: {
    name: "Iron",
    type: Types.ORE,
    src: ".png"
  },
  Lead: {
    name: "Lead",
    type: Types.ORE,
    src: ".png"
  },
  Silver: {
    name: "Silver",
    type: Types.ORE,
    src: ".png"
  },
  Gold: {
    name: "Gold",
    type: Types.ORE,
    src: ".png"
  }
}

export const GEMS = {
  Diamond: {},
  Sapphire: {},
  Topaz: {},
  Ruby: {},
  Obsidian: {}
}

export default {
  ...SWORDS,
  ...SHIELDS,

  ...HELMETS,
  ...BREASTPLATES,
  ...BELTS,
  ...GREAVES,
  ...BOOTS,
  ...GLOVES,
  ...CAPES,

  ...RINGS,
  ...NECKLACES,

  ...BAGS,

  ...POTIONS,
  ...KEYS
}
