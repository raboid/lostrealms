import { rand }  from 'utils';

const TYPES = {
  TILES: {
    DOOR: {
      onClick: function() {}
    },
    GROUND: [
			"darkbrown",
			"gray",
			"lightbrown",
		],
    WALL: [
      "brown",
      "gray",
      "teal",
    ]
  },
  ENEMIES: {
    demon: [
      "blue",
      "red",
      "green"
    ],
    troll: [
      "brown",
      "green",
      "red",
      "white"
    ],
    bat: [
      "red",
      "black"
    ],
    golem: [
      "black",
      "brown",
      "gray",
      "tan",
      "white"
    ]
  },
  ITEMS: {
    ball: [
      "blue",
      "green",
      "purple",
      "red",
      "yellow",
    ],
    book: [
      "black",
      "green",
      "new",
      "old",
      "pink",
    ],
    coin: [
      "blue-s",
      "blue-l",
      "green-s",
      "green-l",
      "purple-s",
      "purple-l",
      "red-s",
      "red-l",
    ],
    gem: [
      "blue",
      "green",
      "red",
      "yellow",
    ],
    heart: [
      "cracked",
      "empty",
      "full",
      "half",
    ],
    key: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
    ],
    potion: [
      "blue-s",
      "blue-m",
      "blue-l",
      "green-s",
      "green-m",
      "green-l",
      "purple-s",
      "purple-m",
      "purple-l",
      "red-s",
      "red-m",
      "red-l",
      "white-s",
      "white-m",
      "white-l",
      "yellow-s",
      "yellow-m",
      "yellow-l",
    ],
    ring: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ],
    shroom: [
      "blue",
      "red",
    ],
    stone: [
      "blue",
      "gold",
      "gray",
      "green",
      "purple",
      "red",
      "white",
    ]
  }
};

export default TYPES;


export function getGroundTheme() {
  return TYPES.TILES.GROUND[rand(0, TYPES.TILES.GROUND.length - 1)];
}

export function getWallTheme() {
  return TYPES.TILES.WALL[rand(0, TYPES.TILES.WALL.length - 1)];
}

export function getItemTheme(type) {
  return TYPES.ITEMS[type][rand(0, TYPES.ITEMS[type].length - 1)];
}

export function getCreatureType() {
  return Object.keys(TYPES.ENEMIES)[rand(0, Object.keys(TYPES.ENEMIES).length -1)];
}

export function getCreatureColor(type) {
  return TYPES.ENEMIES[type][rand(0, TYPES.ENEMIES[type].length -1)];
}
