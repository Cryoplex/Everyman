//Changelog
var changelog = [
'a','a','a','a',
'ax Spawn locaion is now random.',
'af Added tile destruction, press M to mine and J to dig.',
'ax Tiles now drop items upon being destroyed.',
'ax Tiles change in color at dawn, dusk, night',
'af Added a bunch of stuff I don\'t want to write here. Food is edible, tiles are placeable and grass spreads',
'ab bluh bluh bluh',
'af Added meteorological events and such.', 'ax hello',
'af Added crafting and stuff',
];

//Variable declarations
var everyworld, player, currentMenu, sprites, icons, layers, mapw, maph, weatherOverride;

var asciimode = false;
var bigmenu = false;

var lastlog = [];
var tickList = [];
var zonelist = [];
var nearEntities = [];

var camera = {'x': 0, 'y': 0};
var pointer = {'x': 0, 'y': 0};
var range = {'x': 26, 'y': 18};

var twidth = 24;
var theight = 24;
var canvaswidth = 624;
var canvasheight = 432;
var entityMapUpdate = 250;
var weatherUpdate = 100;
var ticker = 0;
var loadrange = 0;

var ticker = 0;

var clouds = {
	'noise': new SimplexNoise(),
	'position': {'x': 0, 'y': 0},
	'getCloud': function(x, y, mul) {
		var v = this.noise.noise((x+this.position.x)/mul, (y+this.position.y)/mul);
		v = (v + 1) / 2;
		return v;
	},
	'moveClouds': function(speed) {
		this.position.x += (0.05*speed);
		this.position.y += (0.01*speed)
	}
}

//Config
var directions = [
	{'x': 0, 'y': -1}, //Top
	{'x': 1, 'y': 0}, //Right
	{'x': 0, 'y': 1}, //Bottom
	{'x': -1, 'y': 0}, //Left

	{'x': 1, 'y': -1}, //Topright
	{'x': 1, 'y': 1}, //Bottomright
	{'x': -1, 'y': 1}, //Bottomleft
	{'x': -1, 'y': -1}, //Topleft
];
var terrainGenerator = {
	'noise': 0.03,

	'biomes': [
		{'name': 'ocean',
		'tiles': [8,1,0,7,7,7,7,7,7,7],
		'walls': [,,,,,,,,,],
		'weather': [0,1,2,6], //Sunny, Cloudy, Rainy, Intense Sun
		},
		{'name': 'desert',
		'tiles': [0,0,0,13,66,66,66,66,66,66],
		'walls': [,,,,,,,,5,6],
		'weather': [0,0,6,7], //Sunny (50%), Intense Sun, Sandstorm
		},
		{'name': 'plains',
		'tiles': [0,0,0,77,77,77,77,77,3,4],
		'walls': [,,,,,,,,5,6],
		'weather': [0,1,2,3], //Sunny, Cloudy, Rainy, Thunderstorm
		},
		{'name': 'forest',
		'tiles': [1,1,0,2,2,2,2,2,2,2],
		'walls': [,,,,,,,,11,6],
		'weather': [0,1,2,3], //Sunny, Cloudy, Rainy, Thunderstorm
		},
		{'name': 'jungle',
		'tiles': [1,1,0,69,69,69,69,69,69,69],
		'walls': [,,,,,,,,63,6],
		'weather': [1,2,2,3], //Cloudy, Rainy (50%), Thunderstorm
		},
		{'name': 'volcano',
		'tiles': [1,1,0,3,3,3,3,3,4,14],
		'walls': [,,,,,,,,6,],
		'weather': [9,9,9,9], //Ash (100%)
		},
		{'name': 'swamp',
		'tiles': [73,73,73,72,72,72,72,72,72,72],
		'walls': [,,,,,,,,64,6],
		'weather': [8,8,8,8], //Fog (100%)
		},
		{'name': 'taiga',
		'tiles': [9,9,9,10,10,10,10,10,10,10],
		'walls': [,,,,,,,,12,6],
		'weather': [0,1,4,5], //Sunny, Cloudy, Snow, Blizzard
		},
		{'name': 'tundra',
		'tiles': [9,9,9,10,10,10,10,10,10,10],
		'walls': [,,,,,,,,5,6],
		'weather': [1,4,5,5], //Cloudy, Snow, Blizzard (50%)
		}
	]
};
var fixstats = ['endurance', 'strength', 'dexterity', 'agility', 'intelligence', 'wisdom', 'luck', 'charisma'];
var dynstats = ['hp', 'mp', 'energy', 'hunger', 'battery'];
var tiles = {
	"floors":[],
	"walls":[],
	"0":{"sprite":"tile_sea",'floor':'true',"block":false, 'set': 'water',
	'tpos': [10,0], 'color': '#4EABD2', 'ascii': '~', 'status': 7, 'fills': true},
	"1":{"sprite":"tile_deepsea",'floor':'true',"block":true, 'set': 'water', 'tpos': [24,0], 'color': '#3F8CAA', 'ascii': '~'},
	"2":{"sprite":"tile_grass",'floor':'true', 'breedflowers': true,
	"features":[19,20,21,22,23,24,25,59,61], 'tpos': [21,0], 'color': '#88CC00',
	'ascii': '_', 'resistance': 10, 'mine': [[0,1], [16,10]], 'hole': 78,
	'spreads': [3]},

	"3":{"sprite":"tile_dirt",'floor':'true', 'breedflowers': true, "features":[19,21,25,26,27], 'tpos': [22,0], 'color': '#C89122', 'ascii': '_', 'resistance': 10, 'mine': [[0,1]], 'hole': 79},
	"4":{"sprite":"tile_stonew",'floor':'true', 'tpos': [23,0], 'color': '#DCCEB2', 'ascii': '_', 'resistance': 100, 'mine': [[2,1]], 'hole': 80},
	"5":{"sprite":"tile_grasspillar","block":true, 'set': 'dirt', 'tpos': [25,0], 'color': '#A0741C', 'ascii': '#', 'resistance': 10, 'mine': [[0,1]]},
	"6":{"sprite":"tile_stonepillar","block":true, 'set': 'stone', 'tpos': [26,0], 'color': '#EDF3F6', 'ascii': '#', 'resistance': 100, 'mine': [[2,1], [2,3], [20,3]]},
	"7":{"sprite":"tile_sand",'floor':'true',"features":[0,0,16,17,18,65], 'tpos': [27,0], 'color': '#E6D684', 'ascii': '_', 'resistance': 5, 'mine': [[1,1], [17,10], [18,10]], 'hole': 81},
	"8":{"sprite":"tile_abyss",'floor':'true',"block":true,"features":[0,0,15], 'set': 'water', 'tpos': [28,0], 'color': '#29586E', 'ascii': '~'},
	"9":{"sprite":"tile_ice",'floor':'true', 'tpos': [29,0], 'color': '#7FD7FF',
	'ascii': '_', 'status': 8, 'resistance': -50, 'mine': [[]], 'hole': 0, 'spreads': [0]},
	"10":{"sprite":"tile_snow",'floor':'true',"features":[0,0,0,0,0,0,0,0,28],
	'tpos': [30,0], 'color': '#F7FDFF', 'ascii': '_', 'resistance': 10,
	'mine': [[0,1]], 'hole': 79, 'spreads': [3]},

	"11":{"sprite":"tile_pine","block":true, 'set': 'tree', 'tpos': [31,0], 'color': '#188C18', 'ascii': 'A', 'resistance': 30, 'mine': [[3,1], [3,3], [23,3]]},
	"12":{"sprite":"tile_pines","block":true, 'set': 'tree', 'tpos': [32,0], 'color': '#C0D7E0', 'ascii': 'A', 'resistance': 30, 'mine': [[3,1], [3,3], [23,3]]},
	"13":{"sprite":"tile_drygrass",'floor':'true','breedflowers': true,"features":[20,26,65],
	'tpos': [33,0], 'color': '#CCAA00', 'ascii': '_', 'resistance': 10,
	'mine': [[0,1], [16,20]], 'hole': 82, 'spreads': [3]},

	"14":{"sprite":"tile_lava",'floor':'true', 'tpos': [34,0], 'features': [75,74],
	'fchance': 1, 'color': '#FF6C23', 'ascii': '~', 'status': 10, 'fills': true},

	"15":{"sprite":"tile_whirl","block":true, 'tpos': [35,0], 'color': '#D7F3FF', 'ascii': '@'},
	"16":{"sprite":"tile_shell_1", 'tpos': [36,0], 'color': '#FFD57F', 'ascii': 'c', 'resistance': -50, 'mine': [[18,1]]},
	"17":{"sprite":"tile_shell_2", 'tpos': [37,0], 'color': '#BFD5FF', 'ascii': 'c', 'resistance': -50, 'mine': [[17,1]]},
	"18":{"sprite":"tile_shell_3", 'tpos': [38,0], 'color': '#3A783A', 'ascii': 'y', 'resistance': -50, 'mine': [[19,1]]},
	"19":{"sprite":"tile_weed", 'tpos': [42,0], 'spreads': [2,13,3,69,72,77], 'color': '#66AA00', 'ascii': ',', 'resistance': -25},
	"20":{"sprite":"tile_bush","block":true, 'tpos': [43,0], 'color': '#66AA00', 'ascii': 'o', 'resistance': 1, 'mine': [[11,2], [11,4], [16,1], [16,4]]},
	"21":{"sprite":"tile_pebbles", 'tpos': [44,0], 'color': '#658C8C', 'ascii': '.', 'resistance': -50, 'mine': [[20,1]]},
	"22":{"sprite":"tile_f_bluflower", 'tpos': [39,0], 'flower': true, 'breeds': [22, 89], 'color': '#1D1DDC', 'ascii': '+', 'resistance': -25},
	"23":{"sprite":"tile_f_cottonflower", 'tpos': [40,0], 'flower': true, 'breeds': [23, 90], 'color': '#FFFFFF', 'ascii': '+', 'resistance': -25, 'mine': [[24,1],[24,2]]},
	"24":{"sprite":"tile_f_fireflower", 'tpos': [41,0], 'flower': true, 'breeds': [24, 91], 'color': '#DC1B1B', 'ascii': '+', 'resistance': -25},
	"25":{"sprite":"tile_dryleaves", 'tpos': [45,0], 'color': '#C8792A', 'ascii': '=', 'resistance': -100},
	"26":{"sprite":"tile_deadbush","block":true, 'tpos': [46,0], 'color': '#E68B2F', 'ascii': 'o', 'resistance': -25, 'mine': [[16,4]]},
	"27":{"sprite":"tile_fossil", 'tpos': [47,0], 'color': '#A1A1A1', 'ascii': '%', 'resistance': 1, 'mine': [[21,1], [22,5], [22,5], [22,5], [22,5]]},
	"28":{"sprite":"tile_snowman","block":true, 'tpos': [48,0], 'color': '#EFFBFF', 'ascii': '8', 'resistance': 1, 'mine': [[12,1]]},
	"29":{"sprite":"tile_ore_Cd","block":true, 'set': 'stone', 'tpos': [52,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"30":{"sprite":"tile_ore_Hg","block":true, 'set': 'stone', 'tpos': [53,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"31":{"sprite":"tile_ore_Pb","block":true, 'set': 'stone', 'tpos': [54,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"32":{"sprite":"tile_ore_As","block":true, 'set': 'stone', 'tpos': [55,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"33":{"sprite":"tile_ore_Mn","block":true, 'set': 'stone', 'tpos': [56,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"34":{"sprite":"tile_ore_Cr","block":true, 'set': 'stone', 'tpos': [57,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"35":{"sprite":"tile_ore_Co","block":true, 'set': 'stone', 'tpos': [58,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"36":{"sprite":"tile_ore_Ni","block":true, 'set': 'stone', 'tpos': [59,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"37":{"sprite":"tile_ore_Cu","block":true, 'set': 'stone', 'tpos': [60,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[4,1], [2,4], [2,4], [20,4]]},
	"38":{"sprite":"tile_ore_Zn","block":true, 'set': 'stone', 'tpos': [61,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"39":{"sprite":"tile_ore_Se","block":true, 'set': 'stone', 'tpos': [62,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"40":{"sprite":"tile_ore_Ag","block":true, 'set': 'stone', 'tpos': [63,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"41":{"sprite":"tile_ore_Sb","block":true, 'set': 'stone', 'tpos': [64,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"42":{"sprite":"tile_ore_Tl","block":true, 'set': 'stone', 'tpos': [65,0], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,4], [2,4], [20,4]]},
	"43":{"sprite":"tile_oref_Cd",'floor':'true', 'tpos': [52,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"44":{"sprite":"tile_oref_Hg",'floor':'true', 'tpos': [53,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"45":{"sprite":"tile_oref_Pb",'floor':'true', 'tpos': [54,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"46":{"sprite":"tile_oref_As",'floor':'true', 'tpos': [55,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"47":{"sprite":"tile_oref_Mn",'floor':'true', 'tpos': [56,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"48":{"sprite":"tile_oref_Cr",'floor':'true', 'tpos': [57,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"49":{"sprite":"tile_oref_Co",'floor':'true', 'tpos': [58,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"50":{"sprite":"tile_oref_Ni",'floor':'true', 'tpos': [59,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"51":{"sprite":"tile_oref_Cu",'floor':'true', 'tpos': [60,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[4,1], [2,2], [20,3]], 'hole': 80},
	"52":{"sprite":"tile_oref_Zn",'floor':'true', 'tpos': [61,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"53":{"sprite":"tile_oref_Se",'floor':'true', 'tpos': [62,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"54":{"sprite":"tile_oref_Ag",'floor':'true', 'tpos': [63,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"55":{"sprite":"tile_oref_Sb",'floor':'true', 'tpos': [64,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"56":{"sprite":"tile_oref_Tl",'floor':'true', 'tpos': [65,2], 'color': '#DCCEB2', 'ascii': '&', 'resistance': 120, 'mine': [[5,1], [2,2], [20,3]], 'hole': 80},
	"57":{"sprite":"item_matter", 'tpos': [0,0], 'color': '#ffffff', 'ascii': ''},
	"58":{"sprite":"cursor","block":false, 'tpos': [11,0], 'color': '#000000', 'ascii': 'O'},
	"59":{"sprite":"shroom","block":false, 'tpos': [66,0], 'spreads': [2,69,72,77], 'color': '#F05656', 'ascii': 't', 'resistance': -50, 'mine': [[13,1]]},
	"60":{"sprite":"fern","block":false, 'tpos': [67,0], 'spreads': [2,69,72,77], 'color': '#4FA04F', 'ascii': 'A', 'resistance': -25, 'mine': [[14,1]]},
	"61":{"sprite":"log","block":true, 'tpos': [68,0], 'color': '#8C6516', 'ascii': '-', 'resistance': -10, 'mine': [[3,1]]},
	"62":{"sprite":"oak","block":true, 'tpos': [69,0], 'color': '#2FC82F', 'ascii': 'T', 'resistance': 30, 'mine': [[3,1], [3,3], [23,3]]},
	"63":{"sprite":"jungletree","block":true, 'tpos': [70,0], 'color': '#639623', 'ascii': 'T', 'resistance': 30, 'mine': [[3,1], [3,3], [23,3]]},
	"64":{"sprite":"deadtree","block":true, 'tpos': [71,0], 'color': '#8C6516', 'ascii': 'Y', 'resistance': 20, 'mine': [[23,1], [3,3], [23,3]]},
	"65":{"sprite":"palm","block":true, 'tpos': [72,0], 'color': '#B8DC00', 'ascii': '7', 'resistance': 30, 'mine': [[3,1], [3,3], [23,3]]},
	"66":{"sprite":"tile_sand",'floor':'true',"features":[0,0,0,0,27,26,67,68], 'tpos': [27,0], 'color': '#E6D684', 'ascii': '_', 'resistance': 5, 'mine': [[1,1]], 'hole': 81},
	"67":{"sprite":"cactus","block":true, 'tpos': [73,0], 'spreads': [7, 66], 'color': '#97C82C', 'ascii': 'µ', 'resistance': 5, 'mine': [[7,1]]},
	"68":{"sprite":"saffron", 'tpos': [74,0], 'color': '#AA80E5', 'ascii': 'w', 'resistance': -25, 'mine': [[15,1]]},
	"69":{"sprite":"jungle_grass",'breedflowers': true,'floor':'true',
	'features':[11,19,20,22,23,24,60,61,62,63,70,71], 'fchance': 2, 'tpos': [75,0],
	'color': '#5A781A', 'ascii': '_', 'resistance': 10, 'mine': [[0,1], [16,3]],
	'hole': 83, 'spreads': [3]},

	"70":{"sprite":"jungle_plant","block":true, 'tpos': [76,0], 'spreads': [69], 'color': '#34DC34', 'ascii': 'x', 'resistance': 5},
	"71":{"sprite":"rafflesia","block":true, 'tpos': [77,0], 'color': '#DC0000', 'ascii': 'X', 'resistance': 10},
	"72":{"sprite":"swamp_grass",'breedflowers': true,'floor':'true', 'tpos': [78,0],
	'features': [64,60,59,27], 'color': '#6B6578', 'ascii': '_', 'resistance': 10,
	'mine': [[0,1], [16,10]], 'hole': 84, 'spreads': [3]},
	"73":{"sprite":"swamp_water",'floor':'true', 'tpos': [79,0], 'features': [64], 'color': '#50388C', 'ascii': '~', 'status': 12},
	"74":{"sprite":"crater", 'block': true, 'tpos': [80,0], 'color': '#121314', 'ascii': '#'},
	"75":{"sprite":"lavapillar", 'tpos': [81,0], 'color': '#FF2323', 'ascii': '#'},
	"76":{"sprite":"UNUSED",'tpos': [0,0], 'color': '#faf', 'ascii': ''},
	"77":{"sprite":"turf",'floor':'true','breedflowers': true, 'tpos': [82,0], 'features': [0, 62, 22, 23, 24],
	'color': '#AEFF00', 'ascii': '_', 'resistance': 10, 'mine': [[0,1], [16,10]],
	'hole': 78, 'spreads': [3]},

	"78":{"sprite":"hole_grass",'floor':'true', 'isHole': true, 'tpos': [21,2],
	'color': '#140D02', 'ascii': 'O'},
	"79":{"sprite":"hole_dirt",'floor':'true', 'isHole': true, 'tpos': [22,2],
	'color': '#140D02', 'ascii': 'O'},
	"80":{"sprite":"hole_stone",'floor':'true', 'isHole': true, 'tpos': [23,2],
	'color': '#1E1B18', 'ascii': 'O'},
	"81":{"sprite":"hole_sand",'floor':'true', 'isHole': true, 'tpos': [27,2],
	'color': '#282310', 'ascii': 'O'},
	"82":{"sprite":"hole_drygrass",'floor':'true', 'isHole': true, 'tpos': [33,2],
	'color': '#140D02', 'ascii': 'O'},
	"83":{"sprite":"hole_jungle",'floor':'true', 'isHole': true, 'tpos': [75,2],
	'color': '#140D02', 'ascii': 'O'},
	"84":{"sprite":"hole_swamp",'floor':'true', 'isHole': true, 'tpos': [78,2],
	'color': '#140D02', 'ascii': 'O'},

	"85":{"sprite":"stone_wall","block":true, 'set': 'stone', 'tpos': [17,2],
	'color': '#ADB2B4', 'ascii': '#', 'resistance': 80, 'mine': [[2,1]]},
	"86":{"sprite":"stone_floor","block":false, 'floor': true, 'set': 'stone', 'tpos': [17,0],
	'color': '#D9DFE2', 'ascii': 'x', 'resistance': 80, 'mine': [[2,1]]},

	"87":{"sprite":"wood_wall","block":true, 'set': 'wood', 'tpos': [18,2],
	'color': '#64480F', 'ascii': '#', 'resistance': 15, 'mine': [[3,1]]},
	"88":{"sprite":"wood_floor","block":false, 'floor': true, 'set': 'wood', 'tpos': [18,0],
	'color': '#B4811C', 'ascii': '=', 'resistance': 15, 'mine': [[3,1]]},

	"89":{"sprite":"tile_f_cyanflower", 'tpos': [39,2], 'flower': true, 'breeds': [22, 89], 'color': '#22FFFF', 'ascii': '+', 'resistance': -25},
	"90":{"sprite":"tile_f_dandelion", 'tpos': [40,2], 'flower': true, 'breeds': [23, 90], 'color': '#DCDC1A', 'ascii': '+', 'resistance': -25},
	"91":{"sprite":"tile_f_hinaflower", 'tpos': [41,2], 'flower': true, 'breeds': [24, 91], 'color': '#DC1BDC', 'ascii': '+', 'resistance': -25},
};
var weatherTypes = {
	/*
	name - Self explanatory
	status - Status that is inflicted when an unit uses a turn while this meteorological event is active
	cloudMul - higher value makes clouds more dense and smooth, lower values makes more random clouds
	cloudChance - 0 is no clouds, 0.5 is half clouds, 1 is full clouds
	cloudAdd - Value that is added to make darker clouds
	rain - Enables rain with some parameters
	    frames - the transition between particles, if set below 1 adds more particles
	    xmod - what distance does the line move from the starting point
	    ymod - distance that the line moves vertically down the starting point
	thunder - Enables thunders randomly
	*/
	'0': {'name': 'Sunny', 'status': 16, 'cloudSpeed': 1, 'cloudMul': 10, 'cloudAdd': 0,  'cloudChance': 0, 'cloudColor': [0,0,0]},
	'1': {'name': 'Cloudy', 'status': 17, 'cloudSpeed': 1, 'cloudMul': 10, 'cloudAdd': 0, 'cloudChance': 0.5, 'cloudColor': [0,0,0]},
	'2': {'name': 'Rain', 'status': 18, 'cloudSpeed': 1, 'cloudMul': 30, 'cloudAdd': 0.5, 'rain': {'frames': 1.5, 'xmod': 0.2, 'ymod': 0.8}, 'cloudChance': 0.5, 'cloudColor': [0,0,0]},
	'3': {'name': 'Thunderstorm', 'status': 19, 'cloudSpeed': 1, 'cloudMul': 50, 'cloudAdd': 0.75, 'thunder': 100, 'rain': {'frames': 0.5, 'xmod': 0.5, 'ymod': 0.8}, 'cloudChance': 0.5, 'cloudColor': [0,0,0]},
	'4': {'name': 'Snow', 'status': 20, 'cloudSpeed': 1, 'cloudMul': 10, 'cloudAdd': 0, 'rain': {'snow': true, 'frames': 5, 'xmod': 1, 'ymod': 2, 'color': [200,255,255]}, 'cloudChance': 0, 'cloudColor': [0,0,0]},
	'5': {'name': 'Blizzard', 'status': 21, 'cloudSpeed': 10, 'cloudMul': 10, 'cloudAdd': 0.25, 'rain': {'snow': true, 'frames': 10, 'xmod': 30, 'ymod': 10, 'color': [200,255,255]}, 'cloudChance': 0.5, 'cloudColor': [128,255,255]},
	'6': {'name': 'Intense Sun', 'status': 22, 'cloudSpeed': 10, 'cloudMul': 10, 'cloudAdd': 1, 'cloudChance': 0.2, 'cloudColor': [255,0,0]},
	'7': {'name': 'Sandstorm', 'status': 23, 'cloudSpeed': 50, 'cloudMul': 20, 'cloudAdd': 0.5, 'cloudChance': 0.5, 'cloudColor': [128,64,0]},
	'8': {'name': 'Fog', 'status': 24, 'cloudSpeed': 15, 'cloudMul': 50, 'cloudAdd': 0.25, 'cloudChance': 0.5, 'cloudColor': [255,200,255]},
	'9': {'name': 'Ash', 'status': 25, 'cloudSpeed': 15, 'cloudMul': 50, 'cloudAdd': 0.8, 'cloudChance': 0.5, 'cloudColor': [64,64,64]},
	'10': {'name': 'Volcanic Eruption', 'status': 26, 'cloudSpeed': 15, 'cloudMul': 50, 'cloudAdd': 0.5, 'cloudChance': 0.5, 'rain': {'frames': 0.2, 'xmod': 0.1, 'ymod': 0.2, 'color': [255, 128, 0]}, 'cloudColor': [255,0,0]},
}
var items = {
	'0': {'name': 'Dirt', 'desc': 'Found anywhere, used to fill holes.', 'price': 0, 'stack': true, 'tpos': [0,0], 'place': {'floor': 3}},
	'1': {'name': 'Sand', 'desc': 'Found in deserts and beaches, used to fill holes.', 'price': 0, 'stack': true, 'tpos': [1,0], 'place': {'floor': 66}},
	'2': {'name': 'Rocks', 'desc': 'Obtained when mining stone.', 'price': 0, 'stack': true, 'tpos': [2,0], 'place': {'floor': 86, 'wall': 85}},
	'3': {'name': 'Wood', 'desc': 'A common renewable resource.', 'price': 2, 'stack': true, 'tpos': [3,0], 'place': {'floor': 88, 'wall': 87}},

	//Unimplemented / Useless
	'4': {'name': 'Copper', 'desc': 'Common metal found sometimes inside stone.', 'price': 3, 'stack': false, 'tpos': [4,0]},
	'5': {'name': 'Metal', 'desc': 'Found sometimes inside stone.', 'price': 5, 'stack': false, 'tpos': [5,0]},
	'6': {'name': 'Gold', 'desc': 'Rare metal found sometimes inside stone.', 'price': 7, 'stack': false, 'tpos': [6,0]},
	'7': {'name': 'Cactus', 'desc': 'Spiky and pricky and itchy and stuff. Be careful touching this.', 'price': 1, 'hunger': 6, 'hp': -1, 'stack': false, 'tpos': [7,0]},
	'8': {'name': 'Tomato', 'desc': 'Edible fruit. Yes, fruit.', 'food': true, 'consumable': true, 'hunger': 15, 'price': 1, 'stack': false, 'tpos': [0,1]},
	'9': {'name': 'Fish', 'desc': 'Obtained from fishing in water.', 'food': true, 'consumable': true, 'hunger': 30, 'status': [[15, 1]], 'price': 8, 'stack': false, 'tpos': [1,1]},
	'10': {'name': 'Shrimp', 'desc': 'Obtained from fishing in deep water.', 'food': true, 'consumable': true, 'hunger': 24, 'status': [[15, 1]], 'price': 16, 'stack': false, 'tpos': [2,1]},
	
	'11': {'name': 'Berries', 'desc': 'Edible fruit that grows in bushes.', 'food': true, 'consumable': true, 'hunger': 6, 'price': 2, 'stack': false, 'tpos': [3,1]},
	'12': {'name': 'Carrot','desc': 'How dare you dismantling a helpless snowman to strip him of its carrot?!','food': true, 'consumable': true, 'hunger': 6, 'price': 3, 'stack': false, 'tpos': [4,1]},
	'13': {'name': 'Mushroom','desc': 'I\'m pretty sure this one is poisonous.','food': true, 'consumable': true, 'hunger': 6, 'price': 2, 'stack': false, 'tpos': [5,1], 'status': [[12, 1]]},
	'14': {'name': 'Fern','desc': 'You can eat this if you have nothing more to eat.','food': true, 'consumable': true, 'hunger': 3, 'price': 0, 'stack': false, 'tpos': [6,1]},
	'15': {'name': 'Saffron','desc': 'A spicy spice found in deserts. Makes food spicy with spicy spiciness.','food': true, 'condiment': true, 'hunger': 1, 'price': 8, 'stack': false, 'tpos': [7,1]},
	
	//Unimplemented/ Useless
	'16': {'name': 'Seeds','desc': 'Woah! Seeds! Guess what kind of plant are them.', 'price': 0, 'stack': true, 'tpos': [0,2]},
	'17': {'name': 'Conch','desc': 'You can hear the sea if you place this in your ear.','price': 3, 'stack': true, 'tpos': [1,2]},
	'18': {'name': 'Seashell','desc': 'Not bourne again shell.','price': 3, 'stack': true, 'tpos': [2,2]},
	'19': {'name': 'Seaweed','desc': 'Never ever smoke this, are you crazy?','price': 0, 'stack': true, 'tpos': [3,2]},
	'20': {'name': 'Stone','desc': 'Useful for primitive tools, or as a throwing weapon maybe.','price': 0, 'stack': true, 'tpos': [4,2]},
	'21': {'name': 'Skull','desc': 'Creepy.','price': 0, 'stack': true, 'tpos': [5,2]},
	'22': {'name': 'Bone','desc': 'Handle for primitive tools and a weapon too.','price': 0, 'stack': true, 'tpos': [6,2]},
	'23': {'name': 'Twig','desc': 'Wave this to feel like a magician. Nothing will happen tho.','price': 0, 'stack': true, 'tpos': [7,2]},

	'24': {'name': 'Cotton','desc': 'No racist jokes this time. I promise.','price': 5, 'tpos': [8,2]},

	'25': {'name': 'String','desc': 'You can do everystring with it!','price': 6, 'tpos': [0,3]},
	'26': {'name': 'Stick','desc': 'So basically you just removed a leaf from a twig.','price': 0, 'tpos': [1,3]},
	'27': {'name': 'Fishing Rod','desc': 'You will fish so many fishes that it will become annoying!','price': 15, 'tpos': [0,4]},
	'28': {'name': 'Seashell Necklace','desc': '','price': 9, 'tpos': [1,4]},

	'29': {'name': 'Wood Plate','desc': '','price': 1, 'tpos': [2,3]},
	'30': {'name': 'Stone Axe','desc': '','price': 10, 'tpos': [2,4]},
	'31': {'name': 'Stone Pickaxe','desc': '','price': 10, 'tpos': [3,4]},
	'32': {'name': 'Wood Sword','desc': '','price': 4, 'tpos': [4,4]},
	'33': {'name': 'Wood Shield','desc': '','price': 5, 'tpos': [5,4]},
	'34': {'name': 'Wire Mesh','desc': '','price': 20, 'tpos': [6,4]},
	'35': {'name': 'Cotton Shirt','desc': '','price': 50, 'tpos': [0,5]},
}
var crafting = {
	'0': {'inputFilter': {}, 'input': [17, 18, 25], 'output': [28], 'outputModifiers': {}},
	'1': {'inputFilter': {'food': true}, 'input': [15, 'f'], 'output': ['f'], 'outputModifiers': {'hunger': 5}},
	'2': {'inputFilter': {}, 'input': [23], 'output': [26], 'outputModifiers': {}},
	'3': {'inputFilter': {}, 'input': [26, 25], 'output': [27], 'outputModifiers': {}},
	'4': {'inputFilter': {}, 'input': [24], 'output': [25], 'outputModifiers': {}},
	'5': {'inputFilter': {}, 'input': [3], 'output': [29], 'outputModifiers': {}},
	'6': {'inputFilter': {}, 'input': [26, 25, 20], 'output': [30], 'outputModifiers': {}},
	'7': {'inputFilter': {}, 'input': [26, 25, 20], 'output': [31], 'outputModifiers': {}},
	'8': {'inputFilter': {}, 'input': [26, 29], 'output': [32], 'outputModifiers': {}},
	'9': {'inputFilter': {}, 'input': [29], 'output': [33], 'outputModifiers': {}},
	'10': {'inputFilter': {}, 'input': [25,25,25], 'output': [34], 'outputModifiers': {}},
	'11': {'inputFilter': {}, 'input': [34,34], 'output': [35], 'outputModifiers': {}},
}
var roles = [
	{'name': 'Warrior', 'set': 'Physical', 'branch': 'Melee', 'primary': 'strength', 'secondary': 'endurance', 'average': ['dexterity', 'agility']},
	{'name': 'Knight', 'set': 'Physical', 'branch': 'Protection', 'primary': 'endurance', 'secondary': 'strength', 'average': ['dexterity', 'agility']},

	{'name': 'Shooter', 'set': 'Physical', 'branch': 'Ranged', 'primary': 'dexterity', 'secondary': 'agility', 'average': ['strength', 'endurance']},
	{'name': 'Thief', 'set': 'Physical', 'branch': 'Stealth', 'primary': 'agility', 'secondary': 'dexterity', 'average': ['strength', 'endurance']},

	{'name': 'Wizard', 'set': 'Mental', 'branch': 'Damage', 'primary': 'intelligence', 'secondary': 'wisdom', 'average': ['charisma', 'luck']},
	{'name': 'Sorcerer', 'set': 'Mental', 'branch': 'Status', 'primary': 'wisdom', 'secondary': 'intelligence', 'average': ['charisma', 'luck']},

	{'name': 'Trainer', 'set': 'Mental', 'branch': 'Familiar', 'primary': 'charisma', 'secondary': 'luck', 'average': ['intelligence', 'wisdom']},
	{'name': 'Gambler', 'set': 'Mental', 'branch': 'Randomness', 'primary': 'luck', 'secondary': 'charisma', 'average': ['intelligence', 'wisdom']},

	{'name': 'Random', 'primary': 'random'},
	{'name': 'Manual', 'primary': 'manual'},
];
var statuses = {
	'0':
	{'name': 'Comatose', 'desc': 'HP reached zero and this unit is forced to sleep.',
	'type': 'physical', 'value': -1, 'duration': 1440, 'sleep': true,
	'effect': {'set': '', 'target': '', 'strength': 1}
	},
	'1':
	{'name': 'Full', 'desc': 'HP regeneration increased.',
	'type': 'physical', 'value': 1, 'duration': 5,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'2':
	{'name': 'Sad', 'desc': 'Stat regeneration halved.',
	'type': 'mental', 'value': -1, 'duration': 10,
	'effect': {'set': 'none', 'target': 'none', 'strength': 0}
	},
	'3':
	{'name': 'Happy', 'desc': 'Stat regeneration increased.',
	'type': 'mental', 'value': 1, 'duration': 5,
	'effect': {'set': 'none', 'target': 'none', 'strength': 0}
	},
	'4':
	{'name': 'Hungry', 'desc': 'Natural HP recovery disabled.',
	'type': 'physical', 'value': -1, 'duration': 10,
	'effect': {'set': 'none', 'target': 'none', 'strength': 0}
	},
	'5':
	{'name': 'Tired', 'desc': 'All stats halved.',
	'type': 'physical', 'value': -1, 'duration': 10,
	'effect': {'set': 'none', 'target': 'none', 'strength': 0}
	},
	'6':
	{'name': 'Starving', 'desc': 'HP regeneration disabled.',
	'type': 'physical', 'value': -1, 'duration': 10,
	'effect': {'set': 'none', 'target': 'none', 'strength': 0}
	},
	'7':
	{'name': 'Wet', 'desc': 'Reduces endurance, watch out for colds.',
	'type': 'physical', 'value': -1, 'duration': 15, 'negates': 10,
	'effect': {'set': 'none', 'target': 'none', 'strength': 0}
	},
	'8':
	{'name': 'Chill', 'desc': 'Reduces dexterity and agility.',
	'type': 'physical', 'value': -1, 'duration': 15, 'negates': 11,
	'effect': {'set': 'none', 'target': 'none', 'strength': 0}
	},
	'9':
	{'name': 'Cold', 'desc': 'Common virus. Reduces strength and agility and makes the user tired.',
	'type': 'physical', 'value': -1, 'duration': 15,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'10':
	{'name': 'On Fire', 'desc': 'Flames engulf this unit, cured by stepping onto water or over time.',
	'type': 'physical', 'value': -1, 'duration': 15,
	'effect': {'set': 'decrease', 'target': 'hp', 'strength': 5}
	},
	'11':
	{'name': 'Hot', 'desc': 'This unit sweats constantly, increasing hunger.',
	'type': 'physical', 'value': -1, 'duration': 15, 'negates': 8,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'12':
	{'name': 'Poison', 'desc': 'This unit is poisoned, causing damage over time.',
	'type': 'physical', 'value': -1, 'duration': 15,
	'effect': {'set': 'decrease', 'target': 'hp', 'strength': 4}
	},
	'13':
	{'name': 'Rested', 'desc': 'All stats x1.5',
	'type': 'physical', 'value': 1, 'duration': 5,
	'effect': {'set': 'none', 'target': 'none', 'strength': 1}
	},
	'14':
	{'name': 'Sleeping', 'desc': 'Energy regenerates over time.',
	'type': 'mental', 'value': 0, 'duration': 360, 'stop': 'energy', 'sleep': true,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'15':
	{'name': 'Raw Food', 'desc': 'Just ate raw food, that is not good.',
	'type': 'physical', 'value': -1, 'duration': 15,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},

	'16':
	{'name': 'Weather: Sunny', 'desc': 'Today is Sunny! Feels good man.',
	'type': 'mental', 'value': 1, 'duration': 3,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'17':
	{'name': 'Weather: Cloudy', 'desc': 'Natural light is partially dim due to clouds.',
	'type': 'mental', 'value': 0, 'duration': 3,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'18':
	{'name': 'Weather: Rain', 'desc': 'Increases plant growth rate and soaks you.',
	'type': 'mental', 'value': 0, 'duration': 3, 'secondary': 7,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'19':
	{'name': 'Weather: Thunderstorm', 'desc': 'Lightning bolts strike places at random intervals.',
	'type': 'mental', 'value': 0, 'duration': 3, 'secondary': 7,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'20':
	{'name': 'Weather: Snow', 'desc': 'Freezes water and covers grass in snow. Makes everything colder.',
	'type': 'mental', 'value': 0, 'duration': 3, 'secondary': 9,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'21':
	{'name': 'Weather: Blizzard', 'desc': 'A more violent version of snow, makes everything even colder.',
	'type': 'mental', 'value': 0, 'duration': 3, 'secondary': 9,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'22':
	{'name': 'Weather: Intense Sun', 'desc': 'So hot. Increases hunger.',
	'type': 'mental', 'value': 0, 'duration': 3, 'secondary': 11,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'23':
	{'name': 'Weather: Sandstorm', 'desc': '0.5x Agility.',
	'type': 'mental', 'value': 0, 'duration': 3,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'24':
	{'name': 'Weather: Fog', 'desc': '0.5x Dexterity.',
	'type': 'mental', 'value': 0, 'duration': 3,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'25':
	{'name': 'Weather: Ash', 'desc': '0.5x Dexterity.',
	'type': 'mental', 'value': 0, 'duration': 3,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
	'26':
	{'name': 'Weather: Volcanic Eruption', 'desc': 'High chances of becoming On Fire. Stay near water.',
	'type': 'mental', 'value': 0, 'duration': 3, 'secondary': 10,
	'effect': {'set': '', 'target': '', 'strength': 0}
	},
};
function toLog(text) {
	var d = new Date();
	debug_interns.innerHTML += '<span style="font-size: 8px; opacity: 0.5">'+pad(d.getSeconds(),2)+'.'+pad(d.getMilliseconds(),3)+'</span> '+text+'<br>';

	debug_interns.scrollTop = debug_interns.scrollHeight;
}
function init() {
	var ver = changes().latestVersion;
	document.title = 'Everyworld '+ver;
	toLog('Changing title to '+document.title);

	toLog('Generating spritesheet');
	sprites = new Spritesheet('tiles', []);
	for (var t in tiles) {
		var x = 0, y = 0;
		var tile = tiles[t];
		var x = (tile.tpos && tile.tpos[0]) ? tile.tpos[0] : 0;
		var y = (tile.tpos && tile.tpos[1]) ? tile.tpos[1] : 0;

		sprites.positions[t] = [x, y];
	}
	toLog('Generating iconsheet');
	icons = new Spritesheet('icons', []);


	toLog('Getting context of layers');
	layers = {
		'bottom': getc('layer_bottom'),
		'wall': getc('layer_wall'),
		'shadow': getc('layer_shadow'),
		'overlay': getc('layer_overlay'),
		'items': getc('layer_items'),
		'entities': getc('layer_entities'),
		'weather': getc('layer_weather'),
	}

	toLog('Making floors/walls dictionary');
	for (var t in tiles) {
		if (-t == NaN) continue;
		var tile = tiles[t];
		if (tile.floor) tiles.floors.push(t);
		if (!tile.floor) tiles.walls.push(t);
	}
	toLog('Found '+tiles.floors.length+' floors and '+tiles.walls.length+' walls.');

	contbutton.style.opacity = (everyworld) ? 1 : 0.5;
	toLog('everyworld is '+typeof everyworld);
}
function getc(id) {
	return doc(id).getContext('2d');
}
function closer(arr, value) {
	arr.sort(function(a, b) {
		return a-value;
	});
	return arr;
}
function Spritesheet(type, positions){
	var img = new Image();
	img.src = 'img/tiles.png';
	if (type == 'icons') img.src = 'img/icons.png';

	this.img = img;
	this.width = twidth
	this.height = theight * 2;
	if (type == 'icons') this.height = twidth;
	this.positions = positions;
}
Spritesheet.prototype = {
	draw: function(wherecontext, id, x, y, posmode){
		if (!posmode) var pos = this.positions[id];
		if (posmode) var pos = id;
		wherecontext.drawImage(
			this.img,
			(pos[0] * twidth),
			(pos[1] * twidth),
			this.width,
			this.height,
			(x*twidth), (y*twidth),
			this.width,
			this.height
			);
	}
};
function pad(string, size=1) {
	string = string.toString();
	while (string.length < size) string = '0'+string;
	return string;
}
function randomID() {
	var d = b62e(Date.now()) + pad(b62e(rand(0,Math.pow(62,3))),3);
	return d;
}
function drawSprite(layer, spriteID, x, y) {
	sprites.draw(layers[layer], spriteID, x, y);
}
function drawIcon(layer, iconPos, x, y) {
	icons.draw(layers[layer], iconPos, x, y, true);
}
function changeMinimapZoom() {
	everyworld.config.minimapSize--;
	if (!everyworld.config.minimapSize) everyworld.config.minimapSize = 4;
	drawMinimap();
}
function displayStatus(close) {
	lb_status.style.display = (close) ? 'none' : 'inline-block';
	lb_status.innerHTML = drawStatus();
}
function drawStatus() {
	var l = '<table class="statTable" style="width: 100%">';
	l += '<tr><th>Name</th><th colspan="5">Description</th><th>Turns</th></tr>';
	for (var s in player.status) {
		var dur = player.status[s];
		if (dur > 0) {
			var value = statuses[s].value;
			var cl = (value < 0) ? 'danger2' : '';
			if (value > 0) cl = 'safe';
			l += '<tr><td class="'+cl+'">'+statuses[s].name+'</td><td colspan="5">'+statuses[s].desc+'</td><td>'+dur+'</td></tr>';
		}
	}
	l += '</table>';
	return l;
}
function increaseStat(stat) {
	if (player.statPoints) {
		var oldhp = getMaxStat(player, 'hp');
		var oldmp = getMaxStat(player, 'mp');
		player.statPoints--;
		player[stat]++;
		var diffhp = getMaxStat(player, 'hp') - oldhp;
		var diffmp = getMaxStat(player, 'mp') - oldmp;
		if (diffhp) heal(player, 'hp', diffhp);
		if (diffmp) heal(player, 'mp', diffmp);
		updateStat(stat);
	}
}
function updateStat(what) {
	var wheres = {
		'strength': 'stat_str', 'endurance': 'stat_end', 'dexterity': 'stat_dex', 'agility': 'stat_agi',
		'charisma': 'stat_cha', 'luck': 'stat_luc', 'intelligence': 'stat_int', 'wisdom': 'stat_wis',
	}
	var whered = {
		'hp': ['stat_hp', [0, 120]],
		'mp': ['stat_mp', [200, 200]],
		'hunger': ['stat_hun', [0, 0]],
		'energy': ['stat_ene', [180, 180]],
		'battery': ['stat_bat', [60, 60]],
	}
	if (wheres[what]) {
		doc(wheres[what]).innerHTML = getMaxStat(player, what);
		var sp = player.statPoints;
		doc('inc_'+wheres[what]).className = (sp) ? 'upgradeable noselect' : 'non_upgradeable noselect';
	}
	if (whered[what]) {
		var ww = whered[what];
		doc(ww[0]).innerHTML = bar(player[what], getMaxStat(player, what), ww[1][0], ww[1][1]);
	}
}
function drawStats() {
	if (statable.style.opacity != 1) statable.style.opacity = 1;
	lb_stats.style.backgroundColor = (player.gender == 0) ? 'hsl(180,50%,50%)' : 'hsl(300,50%,50%)';
	stat_name.innerHTML = player.name+' '+player.family;

	stat_money.innerHTML = shortNum(player.money)+' $';

	stat_level.innerHTML = player.level;

	stat_stp.innerHTML = player.statPoints;

	for (var s in fixstats) updateStat(fixstats[s]);
	for (var d in dynstats) updateStat(dynstats[d]);

	stat_exp.innerHTML = bar(player.xp, expForNextLevel(player.level), 30);

	lb_status.innerHTML = drawStatus();
}
function drawMinimap() {
	var ctx = getc('minimap');

	var tsize = everyworld.config.minimapSize || 4;
	var range = Math.floor(144/tsize/2);

	var minx = pointer.x - range;
	var maxx = pointer.x + range;
	var miny = pointer.y - range;
	var maxy = pointer.y + range;

	for (var x = minx; x < maxx; x++) {
		for (var y = miny; y < maxy; y++) {
			var relx = x - pointer.x + range;
			var rely = y - pointer.y + range;

			var t = whatsHere(everyworld.walls, x, y) || whatsHere(everyworld.map, x, y);

			var color = (tiles[t]) ? tiles[t].color : '#000';
			ctx.fillStyle = color;
			if (pointer.x == x && pointer.y == y) ctx.fillStyle = '#000';
			ctx.fillRect(relx*tsize, rely*tsize, tsize, tsize);
		}
	}
}
function drawASCIITile(layer, id, x, y) {
	var isBottom = (layer == 'bottom');
	layer = layers[layer];
	var asc = tiles[id].ascii;
	var color = tiles[id].color;

	var ax = (x * twidth);
	var ay = (y * twidth);

	var dx = ax + 6;
	var dy = ay + 18;

	layer.font = '24px monospace';
	if (isBottom) {
		layer.fillStyle = color;
		layer.fillRect(ax, ay, twidth, twidth);
		layer.fillStyle = '#fff';
		layer.fillText(asc, dx, dy);
	}
	if (!isBottom) {
		layer.fillStyle = color;
		layer.fillText(asc, dx, dy);
	}
}
function isCharaAuto(chara) {
	if (chara.status[0]) return 'sleep'; //Character is comatose. Unable to move.
	if (chara.status[14]) return 'sleep'; //Character is sleeping.
}
function drawEntityMap() {
	var lay = layers.entities;
	lay.clearRect(0,0,canvaswidth,canvasheight);
	for (var ne in nearEntities) {
		var chara = nearEntities[ne];
		drawCharacter(lay, chara);
	}
	drawCharacter(lay, player);
	if (player.action) drawCharacter(lay, {'x': player.action.x, 'y': player.action.y, 'type': 'cursor'});
}
function blink(three) {
	var bl = (three) ? 3 : 2;
	return Math.floor(Date.now() / entityMapUpdate) % bl;
}
function drawCharacter(layer, chara) {
	var colors = {
		'player': '#00f',
		'monster': '#f00',
		'animal': '#0f0',
		'cursor': 'rgba(0,0,0,0.8)'
	}
	var blinkcolors = {
		'player': 'rgba(0,0,255,0.5)',
		'monster': 'rgba(255,0,0,0.5)',
		'animal': 'rgba(0,255,0,0.5)',
		'cursor': 'rgba(0,0,0,0.2)',
	}
	var ascii = {
		'player': 'P',
		'monster': 'm',
		'animal': 'a',
		'cursor': '*'
	}
	var ax = (chara.x - camera.x) * twidth;
	var ay = (chara.y - camera.y) * twidth;

	if (asciimode || !asciimode) { //TODO placeholder for non-ascii mode character rendering
		layer.font = '24px monospace';
		layer.fillStyle = colors[chara.type];
		if (blink()) layer.fillStyle = blinkcolors[chara.type];
		layer.fillText(ascii[chara.type], ax+(twidth/3), ay+(twidth*1));
	}

	tilebar(layer, ax, ay, chara.hp, getMaxStat(chara, 'hp'));
}
function drawSpriteMap(redraw, ascii) {
	ascii = asciimode;
	var map = everyworld.map;
	var walls = everyworld.walls;

	//if (redraw) for (var l in layers) {
		//layers[l].clearRect(0, 0, 624, 432);
	//}
	//layers.overlay.clearRect(0,0,624,432)
	if (redraw) layers.wall.clearRect(0, 0, canvaswidth, canvasheight);
	for (var y = camera.y; y < camera.y+range.y; y++) {
		for (var x = camera.x; x < camera.x+range.x; x++) {

			var absx = x - camera.x;
			var absy = y - camera.y;

			if (redraw) {
				var id = (map[y] && map[y][x] != undefined) ? map[y][x] : 57;
				if (!ascii) drawSprite('bottom', id, absx, absy);
				if (ascii) drawASCIITile('bottom', id, absx, absy);

				var id = (walls[y] && walls[y][x]) ? walls[y][x] : 57;
				if (!ascii) drawSprite('wall', id, absx, (absy-1));
				if (ascii) drawASCIITile('wall', id, absx, absy);
			}
		}
	}
	drawLightning();
	drawMinimap();
	if (redraw) timeTintCanvas();
}
function getOre(type) {
	var ores = [
	'stone', 'cadmium', 'mercury', 'lead', 'arsenic', 'manganese', 'chromium', 'cobalt', 'nickel', 'copper', 'zinc', 'selenium', 'silver', 'antimony', 'thallium'
	];
	var wallores = [
	6, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42
	];
	var floorores = [
	4, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56
	];
	var weight = [1, 0.0156, 0.0151, 0.02702, 0.0181, 0.0833, 0.0454, 0.03125, 0.0416, 0.0384, 0.04, 0.0149, 0.0153, 0.0161, 0.016];
	var total = 0;
	for (var w in weight) total += weight[w];
	var r = Math.random()*total;
	var sum = 0;
	var arr = (type == 'floor') ? floorores : wallores;
	for (var o in ores) {
		sum += weight[o];
		if (r <= sum) return arr[o];
	}
}
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
function getMapChunk(x, y) {
	var sw = Math.floor(x/Math.floor(mapw/3));
	var sh = Math.floor(y/Math.floor(maph/3));
	return {'x': sw, 'y': sh};
}
function getMapSector(x, y) {
	var sw = Math.floor(x/range.x);
	var sh = Math.floor(y/range.y);
	return {'x': sw, 'y': sh};
}
function getWeatherIn(x, y) {

}
function getCurrentWeather() {
	if (weatherOverride != undefined) return weatherTypes[weatherOverride];
	var s = getCurrentSector();
	var biome = terrainGenerator.biomes[s.biome];
	var weather = s.weather;
	var weatherID = biome.weather || [0,1,2,3];
	var weatherValue = (weather.enabled * 2) + weather.alternate;
	weatherID = weatherID[weatherValue];
	return weatherTypes[weatherID];
}
function getCurrentSector() {
	var s = getMapSector(player.x, player.y);
	return everyworld.sectors[s.y][s.x];
}
function newMap(width, height) {
	var noise = new SimplexNoise();
	var noise2 = new SimplexNoise();
	var map = [];
	var walls = [];
	var heightMap = [];
	var temperatureMap = shuffle([0,1,2]);
	var humidityMap = shuffle([0,1,2]);

	biomeMap = [];
	for (var y in temperatureMap) {
		biomeMap[y] = [];
		for (var x in humidityMap) {
			biomeMap[y][x] = getBiome(temperatureMap[y], humidityMap[x]).temperature;
		}
	}

	for (var h = 0; h < height; h++) {
		var li = [];

		var mp = [];
		var wp = [];
		for (var w = 0; w < width; w++) {
			var rw = parseInt(w) * (terrainGenerator.noise);
			var rh = parseInt(h) * (terrainGenerator.noise);

			var mul = 0.01;

			var nt = noise.noise(parseInt(w) * mul, parseInt(h) * mul);

			var n1 = noise.noise(rw, rh);
			var n2 = noise.noise(rw * 2, rh * 2) / 2;
			var n3 = noise.noise(rw * 3, rh * 3) / 3;
			var n4 = noise.noise(rw * 4, rh * 4) / 4;

			var n = n1 + n2 + n3 + n4;
			if (n < -1) n = -1;
			if (n > 0.99) n = 0.99;
			li.push(n);

			var biom = biomeHere(w, h, 1);

			/*
			var max = terrainGenerator.biomes.length - 1;
			var temp = Math.floor((nt + 1) * max);
			if (temp > max) temp = max;
			if (temp < 0) temp = 0;
			var biomid = temp;
			biom = terrainGenerator.biomes[biomid];
			*/

			mp.push(tileByHeight(biom, n));
			wp.push(tileByHeight(biom, n, 'wall'));
		}
		map.push(mp);
		walls.push(wp);


		heightMap.push(li);
	}

	return {'height': heightMap, 'map': map, 'walls': walls, 'biomeMap': biomeMap}
}
function tileByHeight(biom, height, wallmode) {
	height++;
	var max = 2 / biom.tiles.length;
	var v = Math.floor(height / max);
	var tile = biom.tiles[v];
	if (tile == 4) tile = getOre('floor');
	var ftile = tile;
	if (wallmode) {
		tile = biom.walls[v];
		if (tile == 6) tile = getOre('wall');
		if (!tile) {
			var feat = tiles[ftile].features;
			if (feat) feat = read(feat);
			var fchance = tiles[ftile].fchance || 10;
			if (feat && rand(1,fchance) == 1) tile = feat;
		}
	}
	return tile;
}
function Task(what, where, input, output) {

}
function snap(num, max) {
	return Math.floor(num / max) * max;
}
function newWorld() {
	var ww = mapw;
	var hh = maph;
	toLog('Generating map...');
	var map = newMap(ww, hh);
	if (!everyworld) everyworld = {};
	everyworld.config = {};
	everyworld.height = map.height;
	everyworld.map = map.map;
	everyworld.walls = map.walls;
	everyworld.biomeMap = map.biomeMap;
	everyworld.tech = [true];
	everyworld.meta = [];
	toLog('Creating placeholder player...');
	everyworld.characters = [new Character('player')];
	player = everyworld.characters[0];

	toLog('Generating sector and biome map...');
	var msx = (ww/range.x);
	var msy = (hh/range.y);
	everyworld.sectors = [];
	for (var sy = 0; sy < msy; sy++) {
		everyworld.sectors[sy] = [];
		for (var sx = 0; sx < msx; sx++) {
			var opos = {'x': sx*range.x, 'y': sy*range.y};
			everyworld.sectors[sy][sx] = {
				'biome': biomeHere(opos.x, opos.y),
				'weather': new Weather(),
				'lastSpawn': 0,
			}
		}
	}

	ci_name.value = player.name;
	ci_family.value = player.family;

	everyworld.minute = 59;
	everyworld.hour = parseInt(wi_hour.value) - 1;
	toLog('Time set to '+everyworld.hour+' hours '+everyworld.minute+' minutes.');
	timePass();

}
function itemInfo(id) {
	var ii = '';
	if (id == undefined) {
		lb_info.style.display = 'none';
		return;
	}
	lb_info.style.display = 'inline-block';

	var item = items[id];
	ii += '<b style="font-size: 13px" class="boldy">'+item.name+'</b><br>';
	ii += item.desc;

	lb_info.innerHTML = ii;
}
function drawItem(id, item) {
	var it = items[id];
	var bpos = (-(it.tpos[0]*twidth))+'px '+(-(it.tpos[1]*twidth))+'px';
	var img = '<div class="icon" onclick="useItem('+id+')" onmouseover="itemInfo('+id+')" onmouseleave="itemInfo()" style="padding: 8px; background-position: '+bpos+'; position: relative"><left style="position: absolute; bottom: 0px">'+item.length+'</left></div>';

	return img;
}
function placeItem(id) {
	var place = items[id].place;
	//Get coordinates of player pointer
	var ax = player.action.x;
	var ay = player.action.y;
	var wf = whatsFront(ax, ay);
	if (wf.where == 'wall') return false; //Can't place anything if there is something in the wall layer.
	if (wf.where == 'floor') {
		var fid = wf.id; //Get ID of item on floor
		var ftile = tiles[fid]; //Get tile object of item on floor
		if (ftile.isHole) {
			//If it is a hole, use the place.floor method
			if (place.floor == undefined) return false; //The item does not have a place.floor.
			changeTile(ax, ay, place.floor, true); //Change tile there to the one specified by this item.
			return true;

		}
		else {
			if (place.wall == undefined) return false;
			changeTile(ax, ay, place.wall);
			return true;
		}
	}
	return false;
}
function useItem(id) {
	var itemz = player.inventory[id];
	var amt = itemz.length;
	var consume = false;
	if (amt > 0) {
		var item = items[id];
		if (item.consumable) consume = true;
		if (item.food) {
			for (var d in dynstats) {
				var stat = dynstats[d];
				heal(player, stat, item[stat]);
			}
			updateStat(stat);
		}
		if (item.place) {
			if (placeItem(id)) consume = true;
		}
		if (consume) addItem(player, id, true);
	}

}
function canCraft(recipeID) {
	var recipe = crafting[recipeID];
	var input = recipe.input;
	var match = 0;
	console.log('input items', input);
	for (var i in input) {
		var ii = input[i];
		var has = hasItem(player, ii);
		console.log('id to check', ii, 'inventory', has);
		if (has > 0) match++
	}
	if (match >= input.length) return true;
}
function hasItem(chara, id) {
	if (!chara) return 0;
	if (!chara.inventory) return 0;
	if (!chara.inventory[id]) return 0;
	return chara.inventory[id].length;
}
function craftRecipe(id) {
	var recipe = crafting[id];
	var input = recipe.input;
	var output = recipe.output;

	var cc = canCraft(id);
	if (!cc) return;

	console.log('cc? ', cc);

	for (var i in input) {
		addItem(player, input[i], true);
	}
	for (var o in output) {
		addItem(player, output[o]);
	}

	menuWindow('crafting');
}
function drawCraftRecipe(id) {
	var recipe = crafting[id];
	var cc = canCraft(id);

	var it = recipe.output[0];
	it = items[it] || {'tpos': [0,0], 'name': 'This is an error, call your nearest Snowman for assistance.'};
	var bpos = (-(it.tpos[0]*twidth))+'px '+(-(it.tpos[1]*twidth))+'px';
	var clas = (cc) ? '' : 'unavailable';

	var img = '<div onclick="craftRecipe('+id+')" class="menutton '+clas+'" style="height: auto; padding: 1px; margin: 1px; float: left; width: auto; font-size: 10px"><div class="icon" style="padding: 8px; background-position: '+bpos+'; position: relative"></div> '+it.name+'</div>'

	return img;
}
function menuWindow(what) {
	var mw = '<border onclick="changeMenuSize()">'+what.toUpperCase()+'</border>';
	if (what == 'inventory') {
		for (var i in player.inventory) {
			if (player.inventory[i].length > 0) mw += drawItem(i, player.inventory[i]);
		}
	}
	if (what == 'crafting') {
		for (var c in crafting) {
			mw += drawCraftRecipe(c);
		}
	}

	em_menu.innerHTML = mw;
	currentMenu = what;
}
function changeMenuSize() {
	bigmenu = !bigmenu;
	if (!bigmenu) {
		em_menu.style.top = '432px';
		em_menu.style.height = '144px';
	}
	if (bigmenu) {
		em_menu.style.top = '0px';
		em_menu.style.height = '575px';
	}
}
function preLoadWorld() {
	layer_bottom.style.display = 'inline-block';
	layer_wall.style.display = 'inline-block';
	layer_overlay.style.display = 'inline-block';
	layer_weather.style.display = 'inline-block';
	layer_entities.style.display = 'inline-block';

	lb_menu.style.display = 'inline-block';
	minimap.style.display = 'inline-block';

	loadWorld();

	var bs = bestSpawn(camera.x, camera.y);
	pointer.x = bs.x;
	pointer.y = bs.y;
	player.x = bs.x;
	player.y = bs.y;
	fixCamera(pointer);

	drawSpriteMap(1, asciimode);
	setInterval(drawEntityMap, entityMapUpdate);
	setInterval(weatherCanvas, weatherUpdate);
	setInterval(autoPlayer, 100);
	drawStats();
	everyworld.ready = true;
}
function cleanTile(x, y) {

}
function Zone(type, startx, starty, endx, endy) {
	this.type = type;
	this.start = {'x': startx, 'y': starty};
	this.end = {'x': endx, 'y': endy};
}
function timePass(turns) {
	turns = turns || 1;
	var lastime = whatTimeIsIt();
	if (everyworld.minute == undefined) everyworld.minute = 0;
	if (everyworld.hour == undefined) everyworld.hour = 6;
	if (everyworld.day == undefined) everyworld.day = 1;

	everyworld.minute += turns;
	if (everyworld.minute >= 60) {
		everyworld.minute = 0;
		everyworld.hour++;
		if (everyworld.hour >= 24) {
			everyworld.hour = 0;
			everyworld.day++;
		}
	}

	stat_clock.innerHTML = pad(everyworld.hour,2)+':'+pad(everyworld.minute,2)+' d'+everyworld.day;
	var colors = {
		'day':   'rgb(96, 160, 255)',
		'dusk':  'rgb(192, 144, 96)',
		'night': 'rgb(0, 32, 64)',
		'dawn':  'rgb(192, 224, 255)'
	}
	var time = whatTimeIsIt();
	stat_clock.style.color = (time == 'night') ? '#fff' : '#000';
	stat_clock.style.backgroundColor = colors[time];
	if (lastime != time) {
		drawSpriteMap(1, asciimode);
		timeTintCanvas();
	}
}
function whatTimeIsIt() {
	if (everyworld.hour >= 8 && everyworld.hour < 18) return 'day';
	if (everyworld.hour >= 18 && everyworld.hour < 20) return 'dusk';
	if (everyworld.hour >= 20 || everyworld.hour < 6) return 'night';
	if (everyworld.hour >= 6 && everyworld.hour < 8) return 'dawn';
}
function thunder() {
	setTimeout(function() {timeTintCanvas(5)}, 60);
	setTimeout(function() {timeTintCanvas(5)}, 120);
	setTimeout(function() {timeTintCanvas(5)}, 180);
	setTimeout(function() {drawSpriteMap(1)}, 240);
}
function drugMode(force) {
	timeTintCanvas(0, force);
	setInterval(function() {
		timeTintCanvas(0, force);
	}, 100);
}
function timeTintCanvas(thunder, drugs) {
	return; //TODO Fix "this operation is insecure"
	var overlays = {
		'day':   [1,1,1],
		'dusk':  [1.75,0.8,0.5],
		'night': [0,0.5,0.5],
		'dawn':  [0.,1.2,1.2],
	};

	var time = whatTimeIsIt();
	if (time == 'day') return;

	var over = overlays[time];
	if (thunder) over = [thunder,thunder,thunder];
	if (drugs) over = overlays.day;
	for (var c in layers) {
		var ctx = layers[c];
		var imageData = ctx.getImageData(0,0,canvaswidth,canvasheight);
		var data = imageData.data;

		var w = imageData.width;
		var h = imageData.height;

		for (var i = 0; i < data.length; i += 4) {
			var r = (data[i] + (data[i]   * over[0]))/2;
			if (r > 255) r = 255;
			if (r < 0) r = 0;
			var g = (data[i+1] + (data[i+1]   * over[1]))/2;
			if (g > 255) g = 255;
			if (g < 0) g = 0;
			var b = (data[i+2] + (data[i+2]   * over[2]))/2;
			if (b > 255) b = 255;
			if (b < 0) b = 0;

			data[i] = r;
			data[i+1] = g;
			data[i+2] = b;

			if (drugs) {
				if (drugs == 1 && rand(1,10) == 1) {
					data[i] = data[i+4];
					data[i+1] = data[i+5];
					data[i+2] = data[i+6];
					data[i+3] = data[i+7];
				}
				if (drugs == 2 && rand(1,10) == 1) {
					data[i] += rand(-32, 32);
					data[i+1] += rand(-32, 32);
					data[i+2] += rand(-32, 32);
				}
				if (drugs == 3 && rand(1,10) == 1) {
					data[i] = red(r, g, b);
					data[i+1] = red(r, g, b);
					data[i+2] = red(r, g, b);
				}
				if (drugs == 4 && rand(0,1)) {
					data[i] = data[i+4];
					data[i+1] = data[i+5+5];
					data[i+2] = data[i+6+6+6];
					data[i+3] = data[i+7+7+7+7];
				}
				if (drugs == 5 && rand(1,10) == 1) {
					if (rand(0,1)) data[i] = data[i+4];
					if (rand(0,1)) data[i+1] = data[i+5];
					if (rand(0,1)) data[i+2] = data[i+6];
				}
			}

			for (var dt = 0; dt < 3; dt++) {
				if (data[i+dt] < 0) data[i+dt] = 0;
				if (data[i+dt] > 255) data[i+dt] = 255;
			}
		}
		ctx.putImageData(imageData,0,0);
	}
}
function weatherCanvas() {
	var ctx = layers.weather;
	ctx.clearRect(0,0,canvaswidth,canvasheight);

	var weather = getCurrentWeather();
	ticker += 0.4;

	for (var y = camera.y; y < camera.y+range.y; y++) {
		for (var x = camera.x; x < camera.x+range.x; x++) {
			var absx = x - camera.x;
			var absy = y - camera.y;

			var px = absx*twidth;
			var py = absy*twidth;

			//Rain
			if (weather.rain) {
				ctx.beginPath();
				var frames = weather.rain.frames;
				var ad = ticker % frames;
				var adx = ticker % (frames / weather.rain.xmod);
				var ady = ticker % (frames / weather.rain.ymod);
				var color = weather.rain.color || [0,128,128];
				ctx.strokeStyle = 'rgba('+color[0]+', '+color[1]+', '+color[2]+', 0.8)';
				var w = twidth/frames;
				var ww = w * 1.5;
				ctx.lineWidth = 1;
				if (weather.rain.snow) {
					var color = weather.rain.color || [255,255,255];
					ctx.fillStyle = 'rgb('+color[0]+', '+color[1]+', '+color[2]+')';
					ctx.fillRect(px+(adx*w*weather.rain.xmod), py+(ady*w*weather.rain.ymod), 4, 4);
				}
				else {
					ctx.moveTo(px+(adx*w*weather.rain.xmod), py+(ady*w*weather.rain.ymod));
					ctx.lineTo(px+((adx+1)*w*weather.rain.xmod), py+((ady+1)*w*weather.rain.ymod));
					ctx.stroke();
				}
			}

			//Clouds
			var mul = weather.cloudMul;
			var cloud = clouds.getCloud(x, y, mul) + weather.cloudAdd;
			cloud = round(cloud * weather.cloudChance);
			if (cloud > 1) cloud = 1;
			var col = weather.cloudColor;
			ctx.fillStyle = 'rgba('+col[0]+', '+col[1]+', '+col[2]+', '+cloud+')';
			ctx.fillRect(px, py, twidth, twidth);
		}
	}
	//Thunder
	if (!everyworld.thunder || everyworld.thunder < 0) everyworld.thunder = rand(0,weather.thunder || 0);
	everyworld.thunder--;
	if (weather.thunder > 0 && everyworld.thunder == 4) {
		var sx = rand(0, canvaswidth);
		var sy = rand(0, (canvasheight/2));
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		var segm = rand(5,20);
		ctx.lineWidth = 6;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';

		var ex = sx + rand(-30, 30);
		var ey = sy + 30;
		ctx.lineTo(ex, ey);
		while (segm > 0) {
			segm--;
			ex += rand(-30, 30);
			ey += rand(24,64);
			ctx.lineTo(ex, ey);
		}
		ctx.stroke();
	}
	if (weather.thunder > 0 && everyworld.thunder < 5) {
		var p = round(everyworld.thunder / 6);
		ctx.fillStyle = 'rgba(255, 255, 255, '+p+')';
		ctx.fillRect(0,0,canvaswidth,canvasheight);
	}

	clouds.moveClouds(weather.cloudSpeed);
}
function drawLightning() {
	var ctx = layers.overlay;
	ctx.clearRect(0,0,canvaswidth,canvasheight);

	for (var y = camera.y; y < camera.y+range.y; y++) {
		for (var x = camera.x; x < camera.x+range.x; x++) {
			var absx = x - camera.x;
			var absy = y - camera.y;

			var px = absx*twidth;
			var py = absy*twidth;
			var meta = changeMeta(x, y, 'get');
			if (meta.hp && meta.hp != 100) {
				tilebar(ctx, px, py, meta.hp, 100);
			}
			if (meta.items && meta.items.length > 0) {
				for (var i in meta.items) {
					var item = items[meta.items[i]];
					drawIcon('overlay', item.tpos, absx, absy);
				}
			}
		}
	}
}
function tilebar(ctx, x, y, min, max) {
	var p = Math.ceil((min/max) * twidth);
	var mp = twidth-p;

	ctx.fillStyle = '#0f0';
	ctx.fillRect(x, y, p, 3);
	ctx.fillStyle = '#f00';
	ctx.fillRect(x+p, y, mp, 3);
}
function isVisible(x, y) {
	if (x >= camera.x && x < (camera.x + range.x)) {
		if (y >= camera.y && y < (camera.y + range.y)) return true;
	}
}
function fixCamera(coords) {
	camera.x = snap(coords.x, range.x);
	camera.y = snap(coords.y, range.y);

	fixEntities();
}
function fixEntities() {
	nearEntities = [];

	for (var c in everyworld.characters) {
		var chara = everyworld.characters[c];
		if (chara == player) continue;
		if (isVisible(chara.x, chara.y)) nearEntities.push(chara);
	}
}
function autoPlayer() {
	var auto = isCharaAuto(player);
	if (auto) {
		if (!player.auto) player.auto = 1;
		tickCharacter(player, player.auto);
		newTurn(player.auto);
		player.auto += rand(0,1);
	}
	if (!auto) {
		player.auto = 0;
	}
}
function sleep() {
	if (player.energy >= 100) return;
	inflictStatus(player, 14);
}
function moveCharacter(chara, direction) {
	if (direction != undefined) {
		var d = directions[direction];
		var there = stepable(pointer.x + d.x, pointer.y + d.y);

		var at = stepable(pointer.x+d.x, pointer.y+d.y, true);

		var move = true;

		if (chara == player) {
			var move = false;
			if (player.action && player.action.x == player.x+d.x && player.action.y == player.y+d.y) move = true;
		}

		if (at) {
			var enem = everyworld.characters[at];
			basicAttack(chara, enem);
		}

		if (there && move) {
			if (chara == player) {
				pointer.x += d.x;
				pointer.y += d.y;
			}
			if (!move) return;
			chara.x += d.x;
			chara.y += d.y;

			fatigue(chara, 1);
		}

		if (chara == player) {
			player.action = {'x': player.x+d.x, 'y': player.y+d.y};
			if (!move) return;
		}
	}

	var whf = whatsHere(everyworld.map, chara.x, chara.y);
	var st = tiles[whf].status;
	if (st) inflictStatus(chara, st);

	var meta = changeMeta(chara.x, chara.y, 'get');
	if (meta.items) {
		for (var i in meta.items) {
			addItem(chara, meta.items[i]);
		}
		changeMeta(chara.x, chara.y, 'items', []);
	}
	tickCharacter(chara);
}
function moveCamera(direction) {
	if (!everyworld || !everyworld.ready || isCharaAuto(player)) return;

	moveCharacter(player, direction);

	if (pointer.x < camera.x || pointer.x >= camera.x+range.x || pointer.y < camera.y || pointer.y >= camera.y+range.y) {
		fixCamera(pointer);

		drawSpriteMap(1, asciimode);
	}

	drawLightning();
	drawMinimap();

	newTurn();
}
function addItem(chara, id, del) {
	if (chara.inventory[id] == undefined) chara.inventory[id] = [];
	if (!del) chara.inventory[id].push({});
	if (del) chara.inventory[id].splice(0,1);

	if (currentMenu == 'inventory') menuWindow('inventory');
	if (currentMenu == 'crafting') menuWindow('crafting');
}
function bar(min, max, colormin, colormax) {
	var p = (min < max) ? (min/max) : 1;
	var color = colormin;
	if (colormax) {
		var m = colormax - colormin;
		color = colormin + (m * p);
	}
	var color = 'hsl('+color+', 100%, 40%)';
	return '<dynbarh><left class="boldy">'+Math.floor(min)+'</left><dynbar style="background-color: '+color+'; width: '+(p*100)+'%"></dynbar><right class="boldy">'+Math.floor(max)+'</right></dynbarh>';
}
function expForNextLevel(level) {
	return (level) * 10;
}
function getMaxStat(chara, stat) {
	var mod = 1;
	var fixstats = ['endurance', 'strength', 'dexterity', 'agility', 'intelligence', 'wisdom', 'luck', 'charisma'];
	var percentstats = ['hunger', 'energy', 'battery'];

	if (chara.status) {
		if (chara.status[7] && stat == 'endurance') mod *= 0.75;
		if (chara.status[8]) {
			if (stat == 'dexterity') mod *= 0.75;
			if (stat == 'agility') mod *= 0.75;
		}
		if (chara.status[9]) {
			if (stat == 'agility') mod *= 0.5;
			if (stat == 'strength') mod *= 0.5;
		}
		if (chara.status[23] && stat == 'agility') mod *= 0.5;
		if (stat == 'dexterity') {
			if (chara.status[24] || chara.status[25]) mod *= 0.5;
		}
	}

	if (fixstats.indexOf(stat) >= 0) {
		if (chara.status[5]) mod *= 0.5;
		if (chara.status[13]) mod *= 1.5;
	}
	if (percentstats.indexOf(stat) >= 0) return 100;
	if (stat == 'hp') return Math.ceil(((chara.endurance*2) + chara.strength + chara.hpx) * mod);
	if (stat == 'mp') return Math.ceil(((chara.intelligence*2) + chara.wisdom + chara.mpx) * mod);
	return Math.ceil(chara[stat] * mod);
}
function heal(chara, stat, amt) {
	if (!amt) amt = 0;
	//Hungry: HP regeneration halved.
	if (stat == 'hp' && chara.status[4] && amt > 0) amt *= 0.5;
	//Starving: HP regeneration halted.
	if (stat == 'hp' && chara.status[6] && amt > 0) amt = 0;
	//Cold: Energy damage increased.
	if (stat == 'energy' && chara.status[9] && amt < 0) amt *= 1.5;
	//Hot: Hunger damage increased.
	if (stat == 'hunger' && chara.status[11] && amt < 0) amt *= 1.5;
	//Happy: Stat regeneration increased.
	if (chara.status[3] && amt > 0) amt *= 1.5;
	//Sad: Stat regeneration decreased.
	if (chara.status[2] && amt > 0) amt *= 0.5;
	//Comatose: No stat regeneration (unless energy)
	if (chara.status[0] && stat != 'energy' && amt > 0) amt = 0;
	if (stat != 'energy' && stat != 'hunger') amt = Math.ceil(amt);
	chara[stat] += amt;

	var max = getMaxStat(chara, stat);
	if (chara[stat] < 0) chara[stat] = 0;
	if (chara[stat] >= max) chara[stat] = max;

	updateStat(stat);
}
function getSleepRecoveryAmt(chara) {
	var lv = (chara.level >= 3499) ? 3499 : chara.level;
	return 20 / Math.log10(3500/lv) / 60;
}
function tickTile(x, y, wall) {
	if (!wall) var wh = whatsHere(everyworld.map, x, y);
	if (wall) var wh = whatsHere(everyworld.walls, x, y);
	if (!wh) return;
	var ftile = tiles[wh];
	if (ftile.spreads) {
		var rdir = read(directions);
		var there = {'x': x+rdir.x, 'y': y+rdir.y};
		var wt = whatsHere(everyworld.map, there.x, there.y);
		for (var s in ftile.spreads) {
			if (wt == ftile.spreads[s]) {
				var canSpread = true;
				if (wall && whatsHere(everyworld.walls, there.x, there.y)) canSpread = false;
				if (canSpread) changeTile(there.x, there.y, wh, !wall);
			}
		}
	}
	if (ftile.flower) {
		var rdir = read(directions);
		var there = {'x': x+rdir.x, 'y': y+rdir.y};
		var wt = whatsHere(everyworld.walls, there.x, there.y);
		var fthere = tiles[wt];
		
		if (fthere && fthere.flower) {
			var childs = [wh, wt];
			if (wh != wt) {
				for (var b in ftile.breeds) childs.push(ftile.breeds[b]);
				for (var b in fthere.breeds) childs.push(fthere.breeds[b]);
			}
			var child = read(childs);
			var rdir = read(directions);
			var there = {'x': x+rdir.x, 'y': y+rdir.y};
			var wt = whatsHere(everyworld.walls, there.x, there.y);
			if (wt == undefined) {
				var wt = whatsHere(everyworld.map, there.x, there.y);
				var ft = tiles[wt];
				if (ft.breedflowers) changeTile(there.x, there.y, child);
			}
		}
	}
}
function tickCharacter(chara, turns) {
	turns = turns || 1
	chara.turns += turns;

	//Battery draw
	if (chara.turns % 10 == 0) heal(chara, 'battery', -1);

	//Tick statuses
	var value = 0;
	for (var s in chara.status) {
		if (chara.status[s] > 0) {
			var effect = statuses[s].effect;
			var statuz = statuses[s];
			var mod = 0;
			if (effect.set == 'increase') mod = effect.strength * turns;
			if (effect.set == 'decrease') mod = -(effect.strength * turns);
			chara.status[s] -= turns;
			var stop = statuses[s].stop;
			if (stop && chara[stop] >= getMaxStat(chara, stop)) chara.status[s] = 0;
			if (chara.status[s] <= 0) {
				chara.status[s] = 0;
				if (s == 0) reHeal(chara);
			}
			if (statuz.sleep) heal(chara, 'energy', (getSleepRecoveryAmt(chara) * turns));

			var v = statuses[s].value;
			value += v;
			if (mod != 0) heal(chara, effect.target, mod);
		}
	}

	//Status inflict
	if (chara.hunger >= 80) inflictStatus(chara, 1);
	if (chara.hunger <= 25) inflictStatus(chara, 4);
	if (chara.hunger <= 0) inflictStatus(chara, 6);
	if (chara.mp <= 0) inflictStatus(chara, 2);
	var maxmp = getMaxStat(chara, 'mp') * 0.8;
	if (chara.mp >= maxmp) inflictStatus(chara, 3);
	if (chara.energy <= 0) inflictStatus(chara, 5);
	if (chara.energy >= 80) inflictStatus(chara, 13);
	if (chara.hp <= 0) inflictStatus(chara, 0);

	//Weather status
	var w = getCurrentWeather();
	inflictStatus(chara, w.status);

	//Natural HP regeneration
	var nfreq = (chara.status[1]) ? 1 : 4;
	var hamt = (chara.status[4]) ? 0 : 1;
	if (chara.turns % nfreq == 0) heal(chara, 'hp', hamt);

	//Natural MP regeneration
	if (chara.turns % 2 == 0) heal(chara, 'mp', value*turns);

	drawStats();
}
function useTile() {

}
function fatigue(chara, type) {
	//type 1 = moving, type 2 = acting
	//moving doubles energy draw, acting doubles hunger draw
	//energy draw is reduced by high endurance, hunger draw is reduced by high strength
	var hmul = (type == 1) ? 1 : 2;
	var hamt = (0.03 + (1/chara.strength)) * hmul;
	var emul = (type == 1) ? 2 : 1;
	var eamt = (0.03 + (1/chara.endurance)) * emul;

	//Hunger draw
	heal(chara, 'hunger', -hamt);
	//Energy draw
	heal(chara, 'energy', -eamt);
}
function mineTile(floor) {
	var act = player.action || {'x': player.x, 'y': player.y};
	var front = whatsFront(act.x, act.y);
	var tile = tiles[front.id];
	if (tile.resistance == undefined || !tile.resistance) return;
	if ((front.where == 'floor' && !floor) || (front.where == 'wall' && floor)) return;

	var meta = front.meta;
	if (meta.hp == undefined) meta.hp = 100;
	var force = miningForce(player, front.id);
	meta.hp -= force;
	fatigue(player, 2);
	if (meta.hp <= 0) {
		var drops = tile.mine || [[]];
		for (var d in drops) {
			var drop = drops[d];
			var did = drop[0];
			var dchance = drop[1];

			if (rand(1,dchance) == 1) {
				dropItem(act.x, act.y, did);
			}
		}
		if (front.where == 'wall') {
			changeTile(act.x, act.y);
		}
		if (front.where == 'floor' && tile.hole != undefined) {
			changeTile(act.x, act.y, tile.hole, 1);
		}
		meta.hp = 0;
		if (front.where == 'wall') meta.hp = undefined;
	}

	tickCharacter(player);
	newTurn();
	drawLightning();
}
function changeTile(x, y, newTile, floor) {
	newTile = (newTile != undefined) ? newTile : undefined;
	if (!floor) everyworld.walls[y][x] = newTile;
	if (floor) everyworld.map[y][x] = newTile;
	drawSpriteMap(1);
}
function dropItem(x, y, id) {
	var meta = changeMeta(x, y, 'get');
	if (meta.items == undefined) changeMeta(x, y, 'items', []);
	meta = changeMeta(x, y, 'get');
	meta.items.push(id);
}
function miningForce(chara, tile) {
	var attack = getMaxStat(chara, 'strength');
	var defense = tiles[tile].resistance || 1;
	var d = rand(2*attack, 4*attack) - defense;
	if (d < 1) d = 1;
	return d;
}
function whatsFront(x, y) {
	var whf = whatsHere(everyworld.map, x, y);
	var whw = whatsHere(everyworld.walls, x, y);
	var meta = changeMeta(x, y, 'get');
	if (meta.hp == undefined) changeMeta(x, y, 'hp', 100);
	meta = changeMeta(x, y, 'get');

	if (whw) return {'id': whw, 'where': 'wall', 'meta': meta};
	return {'id': whf, 'where': 'floor', 'meta': meta};
}
function inflictStatus(chara, id) {
	var neg = statuses[id].negates;
	var type = statuses[id].type;
	var val = statuses[id].value;
	var secondary = statuses[id].secondary;
	var duration = statuses[id].duration;
	var take = true;

	if (type == 'physical' && val < 0 && chara.endurance > duration && rand(0,1)) take = false;
	if (type == 'mental' && val < 0 && chara.wisdom > duration && rand(0,1)) take = false;

	if (id == 0) {
		take = true;
		duration = (getMaxStat(chara, 'hp') + getMaxStat(chara, 'mp')) * chara.level;
		if (chara.status[0]) take = false;
	}
	if (secondary && rand(1,10) == 1) inflictStatus(chara, secondary);

	if (take) chara.status[id] = duration;
	if ((id == 8 && chara.status[7]) || (id == 7 && chara.status[8])) inflictStatus(chara, 9);
	if (chara.status[neg]) chara.status[neg] = 0;
};
function spawnMonsters() {
	var dir = read(directions);
	var spawn = {
		'x': player.x + (dir.x * range.x),
		'y': player.y + (dir.y * range.y)
	}
	if (isVisible(spawn.x, spawn.y)) return;

	var step = stepable(spawn.x, spawn.y);
	if (!step) return;

	var ms = getMapSector(spawn.x, spawn.y);
	var ls = getLastSpawn(ms.x, ms.y);
	if (ls == everyworld.hour) return;
	everyworld.sectors[ms.y][ms.x].lastSpawn = everyworld.hour;

	var level = player.level;
	while (rand(0,1)) level--;
	if (level < 1) level = 1;

	spawnEntity(spawn.x, spawn.y, level, 'monster');
}
function spawnEntity(x, y, level, type) {
	var c = new Character(type, level);
	c.x = x;
	c.y = y;
	reSpread(c, 8);
	everyworld.characters.push(c);
}
function getLastSpawn(sectorx, sectory) {
	if (everyworld == undefined || everyworld.sectors == undefined || everyworld.sectors[sectory] == undefined || everyworld.sectors[sectory][sectorx] == undefined) return 'void';
	if (!everyworld.sectors[sectory][sectorx].lastSpawn) everyworld.sectors[sectory][sectorx].lastSpawn = 0;
	return everyworld.sectors[sectory][sectorx].lastSpawn;
}
function newTurn(turns) {
	turns = turns || 1;
	timePass(turns);

	if (whatTimeIsIt() == 'night') spawnMonsters();

	for (var n in nearEntities) {
		var ent = nearEntities[n];
		if (!isCharaAuto(ent)) aiMove(ent);
		tickCharacter(ent);
	}

	for (var x = 0; x < turns; x++) tickRandomTile();

	tickWeather(turns);
}
function tickWeather(turns) {
	var sector = getCurrentSector();
	sector.weather.ticks -= turns;
	if (sector.weather.ticks <= 0) sector.weather = new Weather();
}
function Weather() {
	this.enabled = rand(0,1);
	this.alternate = rand(0,1);
	this.ticks = rand(1, 1440);
}
function tickRandomTile() {
	var rpos = getRandomPosition();
	var rx = rpos.x;
	var ry = rpos.y;
	tickTile(rx, ry);
	tickTile(rx, ry, 1);
}
function aiMove(chara) {
	if (chara == player) return;
	if (chara.lastTick == everyworld.minute) return;
	chara.lastTick = everyworld.minute;

	//Move character
	if (chara.target == undefined) {
		//If character has no target, the nearest unit that is not from its type is selected
		var tgt = getNearestTarget(chara);
		if (tgt) chara.target = tgt;
	}
	//Check if there is still a target
	if (chara.target) {
		var target = everyworld.characters[chara.target.id];
		//Target available, check if unit can attack it.
		if (canAttack(chara, target, 1)) {
			//Target is inside range!
			return;
		}
		else {
			//Target out of range, getting closer to target...
			var bm = bestMove(chara, target);
			moveCharacter(chara, bm);

			return;
		}
	}
	if (!chara.target) {
		//No target available, roam randomly
		moveCharacter(chara, rand(0,7));

		return;
	}
}
function basicAttack(from, to) {
	var ca = canAttack(from, to, 1);
	if (!ca) return;
	var dmg = damageFormula(from, to, 'basic');

	heal(to, 'hp', -dmg);

	if (to.hp <= 0) {
		heal(to, 'strength', -(dmg/2));
		from.xp += to.level;
		if (to != player) {
			var ix = everyworld.characters.indexOf(to);
			everyworld.characters.splice(ix, 1);
			fixEntities();
		}
	}
}
function damageFormula(from, to, type) {
	type = type || 'basic';
	var attack = {
		'basic': 'strength',
		'ranged': 'dexterity',
		'magic': 'intelligence',
	}
	var defense = {
		'basic': 'endurance',
		'ranged': 'endurance',
		'magic': 'wisdom',
	}

	var atk = attack[type];
	atk = getMaxStat(from, atk);
	var def = defense[type];
	def = getMaxStat(to, def);

	var damage = rand(atk, 2*atk) - def;
	if (damage < 1) damage = 1;

	return damage;
}
function bestMove(from, to) {
	var moves = [];
	for (var dd in directions) {
		var dirr = directions[dd];
		var targ = {'x': from.x+dirr.x, 'y': from.y+dirr.y};
		if (!stepable(targ.x, targ.y)) continue;
		moves.push({'direction': dd, 'dist': sdistance(targ, to)});
	}
	moves.sort(function(a, b) {
		return a.dist - b.dist;
	})
	if (moves.length <= 0) return rand(0,7);
	return moves[0].direction;
}
function getNearestTarget(from) {
	var targets = [];
	for (var c in everyworld.characters) {
		var char = everyworld.characters[c];
		if (char.type != from.type) targets.push({'id': c, 'dist': sdistance(char, from)});
	}
	targets.sort(function(a, b) {
		return a.dist - b.dist;
	});
	return targets[0];
}
function canAttack(from, to, range) {
	var dist = sdistance(from, to);
	if (range >= dist) return true;
}
function Character(type, level) {
	this.id = randomID();

	this.type = type;

	this.x = 0;
	this.y = 0;

	this.turns = 0;

	this.inventory = [];

	this.facing = rand(0,3);

	this.level = level || 1;
	this.xp = 0;
	this.statPoints = (this.level * 3 + 32 + 5);

	//Stats: Stats are divided into Physical, Mental, and Social.
	//Physical stats
	this.strength = 1
	this.endurance = 1
	this.dexterity = 1
	this.agility = 1
	//Mental stats
	this.intelligence = 1
	this.wisdom = 1
	//Social stats
	this.charisma = 1
	this.luck = 1

	this.hunger = 100;
	this.energy = 100;
	this.battery = 100;

	this.hpx = rand(this.level, this.level*6);
	this.hp = getMaxStat(this, 'hp');
	this.mpx = rand(this.level, this.level*6);
	this.mp = getMaxStat(this, 'mp');

	this.status = [];

	this.money = (type == 'player') ? 0 : round(300*Math.random());

	this.gender = rand(0,1);

	randomName(this, this.gender);
}
function getRandomName() {
	randomName(player, player.gender);
	ci_name.value = player.name;
	ci_family.value = player.family;

	characterValues();
}
function randomName(chara, gender) {
	var name = '';
	if (gender == 1) name = getFemaleName();
	if (gender == 0) name = getMaleName();
	var name = name.split(' ');
	chara.name = name[0];
	chara.family = name[1];
}
function isEnabled(tech) {
	var have = 0;
	for (var r in tech.requires) {
		var requirement = tech.requires[r];
		if (everyworld.tech[requirement]) have++;
	}
	if (have >= tech.requires.length) return true;
}
function getRandomJob() {
	var available = [];
	for (var j in jobs) {
		if (isEnabled(jobs[j])) available.push(j);
	}
	return read(available);
}
function bestSpawn(x, y) {
	var rp = getRandomPosition(1);
	return {'x': rp.x, 'y': rp.y}
}
function isAreaClean(x, y) {
	for (var xx = x-1; xx < x+1; xx++) {
		for (var yy = y-1; yy < y+1; yy++) if (!stepable(xx, yy)) return false;
	}
	return true;
}
function stepable(x, y, what) {
	if (everyworld.walls && everyworld.walls[y] && everyworld.walls[y][x]) {
		if (tiles[everyworld.walls[y][x]].block) {
			if (what) return;
			return false;
		}
	}
	if (everyworld.map && everyworld.map[y] && everyworld.map[y][x]) {
		if (tiles[everyworld.map[y][x]].block) {
			if (what) return;
			return false;
		}
	}
	if (everyworld.map == undefined || everyworld.map[y] == undefined || everyworld.map[y][x] == undefined) {
		if (what) return;
		return false;
	}

	for (var c in everyworld.characters) {
		var chara = everyworld.characters[c];
		if (x == chara.x && y == chara.y) {
			if (what) return c;
			return false;
		}
	}
	if (what) return;
	return true;
}
function incRandom(start = 0, v) {
	while (rand(0,1)) start += v;
	return start;
}
function Zone(start, end) {
	this.start = start;
	this.end = end;
}
function Coordinate(x, y) {
	this.x = x;
	this.y = y;
}
function expandZone(zone, dir, size) {
	if (dir.x > 0) zone.end.x += size;
	if (dir.x < 0) zone.start.x -= size;
	if (dir.y > 0) zone.end.y += size;
	if (dir.y < 0) zone.start.y -= size;

	return zone;
}
function expandCity() {
	var d = directions[rand(0,3)];
	var city = everyworld.city;

	var size = incRandom(7, 1);
	var zone = getCity();
	expandZone(zone, d, size);

	var z = rand(1,4);

	addZone(z, zone.start, zone.end);
	for (var d = 0; d < 4; d++) if (rand(0,1)) addRoads(directions[d]);
}
function getCity() {
	return new Zone(new Coordinate(everyworld.city.sx, everyworld.city.sy), new Coordinate(everyworld.city.ex, everyworld.city.ey));
}
function addRoads(dir) {
	var zone = getCity();
	expandZone(zone, dir, 1);

	addZone(5, zone.start, zone.end);
}
function spread(number, weight) {
	var values = [];
	var maxweight = 0;
	var highest = {'index': 0, 'value': 0}
	for (var w in weight) {
		var we = weight[w];
		maxweight += we;
		if (we > highest.value) highest = {'index': w, 'value': we};
	}
	for (var w in weight) {
		var val = Math.floor((number / maxweight) * weight[w]);
		values[w] = val;
	}
	var total = 0;
	for (var v in values) total += values[v];
	if (total < number) values[highest.index] += (number - total);
	return values;
}
function reSpread(player, role) {
	var v = 0;
	var weight = [];
	var role = roles[role];
	for (var s in fixstats) {
		var stat = fixstats[s];
		weight[s] = 1;
		if (role.primary == stat) weight[s] = 4;
		if (role.secondary == stat) weight[s] = 3;
		for (var a in role.average) {
			if (role.average[a] == stat) weight[s] = 2;
		}
		if (role.primary == 'random') weight[s] = Math.random();
		var num = player[stat] - 1;
		player[stat] = 1;
		v += num;
	}

	v += player.statPoints;
	var values = spread(v, weight);
	var sp = 0;

	for (var s in fixstats) {
		if (role.primary != 'manual') player[fixstats[s]] += values[s];
		if (role.primary == 'manual') sp += values[s];
	}
	player.statPoints = sp;

	reHeal(player);
}
function reHeal(chara) {
	chara.hp = getMaxStat(chara, 'hp');
	chara.mp = getMaxStat(chara, 'mp');
}
function characterValues() {
	if (ci_name.value) player.name = ci_name.value;
	if (ci_family.value) player.family = ci_family.value;

	if (ci_male.checked) player.gender = 0;
	if (ci_female.checked) player.gender = 1;

	if (ci_role.selectedIndex != undefined) reSpread(player, ci_role.selectedIndex);

	drawStats();
}
function randomizeCharacter() {
	ci_role.selectedIndex = rand(0, roles.length - 1);
	var g = rand(0,1);
	ci_male.checked = (g == 0) ? true : false;
	ci_female.checked = !ci_male.checked;
	player.gender = g;
	getRandomName();
	characterValues();
}
function worldValues() {
	mapw = range.x*3*parseInt(wi_mapw.value);
	maph = range.y*3*parseInt(wi_maph.value);

	terrainGenerator.noise = parseFloat(wi_noise.value);
	wo_noise.value = terrainGenerator.noise;

	wo_hour.value = pad(wi_hour.value,2)+':00';

	var wo = parseInt(wi_weather.selectedIndex) - 1;
	if (wo >= 0) weatherOverride = wo;
	toLog('Weather override to '+wo);

	asciimode = ascii.checked;

	wo_mapw.value = mapw;
	wo_maph.value = maph;
}
function pathFind(from, to) {
	var t = {'x': to.x, 'y': to.y, 'value': 0};
	var queue = [t];
	var pathy = [];
	while (true) {
		for (var q in queue) {
			var qu = queue[q];
			qu.dist = sdistance(qu, from);
		}
		queue.sort(function(a, b) {
			return a.dist - b.dist;
		})
		var pointer = queue[0];

		if (!pointer) break;
		if (pointer.x == from.x && pointer.y == from.y) break;
		for (var d = 0; d < 4; d++) {
			var dir = directions[d];
			var v = pointer.value + 1 + Math.random();
			var point = {'x': pointer.x + dir.x, 'y': pointer.y + dir.y, 'value': v};

			var eligible = true;
			if (!stepable(point.x, point.y)) eligible = false;

			for (var q in queue) {
				var qu = queue[q];
				if (point.x == qu.x && point.y == qu.y) eligible = false;
			}
			for (var p in pathy) {
				var pa = pathy[p];
				if (point.x == pa.x && point.y == pa.y) eligible = false;
			}
			if (eligible) {
				queue.push(point);
			}
		}
		pathy.push(pointer);
		queue.splice(0, 1);
	}
	pathy.sort(function(a, b) {
		return a.value - b.value;
	});

	var mover = {'x': from.x, 'y': from.y};
	var path = [];
	while (true) {
		var lowest = {'value': Infinity, 'x': 0, 'y': 0};
		for (var d = 0; d < 4; d++) {
			var dir = directions[d];
			var point = {'x': mover.x + dir.x, 'y': mover.y + dir.y};

			for (var q in pathy) {
				var qu = pathy[q];
				if (qu.x == point.x && qu.y == point.y && qu.value < lowest.value) lowest = {'value': qu.value, 'x': point.x, 'y': point.y}
			}
		}
		path.push(lowest);
		if (lowest.value == Infinity) break;
		mover.x = lowest.x;
		mover.y = lowest.y;

		if (mover.x == to.x && mover.y == to.y) break;
	}

	return {'pathy': pathy, 'path': path};
}
function getRandomPosition(soft) {
	do {
		var rx = rand(1, everyworld.map[0].length) - 1;
		var ry = rand(1, everyworld.map.length) - 1;
		if (!soft) break;
		if (soft && biomeHere(rx, ry, 1).name != 'city' && isAreaClean(rx, ry)) break;
	}	while (true)

	return {'x': rx, 'y': ry};
}
function aliasToSprite(alias) {
	if (!tiles[alias]) return 'void';
	return tiles[alias].sprite;
}
function biomeHere(x, y, obj) {
	var chunk = getMapChunk(x, y);
	var biom = biomeMap[chunk.y][chunk.x];
	if (obj) biom = terrainGenerator.biomes[biom];
	return biom;
}
function getBiome(temperature, humidity) {
	var n = (temperature*3+humidity) || 0;

	return {'temperature': n, 'biome': terrainGenerator.biomes[n]}
}
function whatsHere(array, x, y) {
	if (array == undefined) return;
	if (array[y] == undefined) return;
	if (array[y][x] == undefined) return;
	return array[y][x];
}
function displayResearch() {

}
function randomExplore() {
	for (var c in everyworld.characters) {
		var chara = everyworld.characters[c];
		var r = getRandomPosition();
		chara.objective = pathFind(chara, r).path;
	}
}
function addZone(type, start, end) {
	if (everyworld.zones == undefined) everyworld.zones = [];
	everyworld.zones.push({
		'type': type,
		'start': start,
		'end': end,
		'x': half(start.x, end.x),
		'y': half(start.x, end.y),
	});
	if (everyworld.city == undefined) everyworld.city = {'sx': Infinity, 'sy': Infinity, 'ex': -Infinity, 'ey': -Infinity};
	if (start.x < everyworld.city.sx) everyworld.city.sx = start.x;
	if (start.y < everyworld.city.sy) everyworld.city.sy = start.y;
	if (end.x > everyworld.city.ex) everyworld.city.ex = end.x;
	if (end.y > everyworld.city.ey) everyworld.city.ey = end.y;

	for (var x = start.x; x < end.x; x++) {
		for (var y = start.y; y < end.y; y++) {
			var meta = changeMeta(x, y, 'get');
			if (meta.zone != undefined) continue;
			changeMeta(x, y, 'zone', type);
			if (type == 0) changeMeta(x, y, 'warehouse', 1);
		}
	}
}
function changeMeta(x, y, arg, value) {
	if (everyworld.meta == undefined) {
		if (arg == 'get') return {};
		everyworld.meta = [];
	}
	if (everyworld.meta[y] == undefined) {
		if (arg == 'get') return {};
		everyworld.meta[y] = [];
	}
	if (everyworld.meta[y][x] == undefined) {
		if (arg == 'get') return {};
		everyworld.meta[y][x] = {};
	}
	if (arg == 'get') return everyworld.meta[y][x];
	everyworld.meta[y][x][arg] = value;
}
function getNearest(sx, sy, arg) {
	var list = [];
	for (var y = 0; y < everyworld.map.length; y++) {
		for (var x = 0; x < everyworld.map[0].length; x++) {
			var meta = changeMeta(x, y, 'get');
			var dist = sdistance({'x': sx, 'y': sy}, {'x': x, 'y': y});
			if (meta[arg] != undefined && stepable(x, y)) list.push({'x': x, 'y': y, 'dist': dist});
		}
	}
	list.sort(function(a, b) {
		return a.dist - b.dist;
	});
	return list[0];
}
function half(v1, v2) {
	return Math.ceil((v2 - v1) / 2) + v1;
}
function getCityCenter() {
	for (var z in zonelist) {
		var zo = zonelist[z];
		if (zo.type == 'warehouse') return {'x': zo.x, 'y': zo.y};
	}
}
function loadWorld() {
	toLog('Loading world...');
	game_menu.style.display = 'none';
	game_game.style.display = 'block';
	if (!everyworld.characters) everyworld.characters = [];

	toLog('<b class="illegal">Controls</b>');
	toLog('<b>WASD / 8426</b> Movement');
	toLog('<b>QEZC / 7913</b> Diagonal Movement');
	toLog('<b>X</b> Sleep');
	toLog('<b>M</b> Mine/Chop/Destroy');
	toLog('<b>J</b> Dig');
	toLog('<b>Status</b> Hover your stat bar (left) to show status conditions.');
	toLog('<b>Stat Increase</b> Click on your stat name <span class="boldy">when shown like this</span> to increase that stat (Costs 1 Stat Point/STP)');
	toLog('<b>Inventory</b> Click food items to eat them. Click building materials to place them, to replace the ground tile, dig a hole then use the item.');
}
function saveGame() {

}

$('body').on('keypress', function(evt) {
	//TODO edit keybindings
    var key = String.fromCharCode(evt.charCode).toLowerCase();

    if (key == 'w' || key == '8') moveCamera(0);
    if (key == 'a' || key == '4') moveCamera(3);
    if (key == 'd' || key == '6') moveCamera(1);
    if (key == 's' || key == '2') moveCamera(2);

    if (key == 'e' || key == '9') moveCamera(4);
    if (key == 'c' || key == '3') moveCamera(5);
    if (key == 'z' || key == '1') moveCamera(6);
    if (key == 'q' || key == '7') moveCamera(7);

    if (key == 'x') sleep();

    if (key == 'u') useTile();
    if (key == 'j') mineTile(true);
    if (key == 'm') mineTile();

    if (key == 'r') displayResearch();
});

//Flow
init();