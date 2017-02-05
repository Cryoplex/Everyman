//Changelog
var changelog = [
'a',
'ax',
'af',
'af humans',
'ax zones',
'ax pathfinding updated',
'ax explore button for testing purposes'
];

//Variable declarations
var everyworld;
var lastlog = [];
var tickList = [];
var zonelist = [];
var twidth = 24;
var theight = 24;
var selectedChar = -1;
var sprites;
var layers;
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
var camera = {'x': 20, 'y': 20};
var range = {'x': 32, 'y': 16};

var loadrange = 0;

//Config
var terrainGenerator = {
	'noise': 0.02,

	'biomes': [
			{'name': 'dryplains',
			'tiles': [8,1,0,7,3,3,3,3,4,4],
			'walls': [,,,,,,,,,],
			},
			{'name': 'dryplains_t1',
			'tiles': [8,1,9,7,3,3,3,3,3,4],
			'walls': [,,,,,,,,,6],
			},
			{'name': 'dryplains_t2',
			'tiles': [8,9,9,7,3,3,3,3,3,3],
			'walls': [,,,,,,,,5,6],
			},
			{'name': 'dryplains_t3',
			'tiles': [9,9,9,7,3,3,3,3,10,10],
			'walls': [,,,,,,,,5,6],
			},
			{'name': 'dryplains_t4',
			'tiles': [9,9,9,7,3,3,10,10,10,10],
			'walls': [,,,,,,,,5,6],
			},
			{'name': 'dryplains_t5',
			'tiles': [9,9,9,7,3,10,10,10,10,10],
			'walls': [,,,,,,,,5,6],
			},
			{'name': 'tundra',
			'tiles': [9,9,9,7,10,10,10,10,10,10],
			'walls': [,,,,,,,,5,6],
			},
			{'name': 'tundra_t1',
			'tiles': [9,9,9,7,10,10,10,10,10,10],
			'walls': [,,,,,,,,11,6],
			},
			{'name': 'taiga',
			'tiles': [9,9,9,7,10,10,10,10,10,10],
			'walls': [,,,,,,,,11,12],
			},
			{'name': 'taiga_t1',
			'tiles': [8,9,9,7,10,10,10,10,10,4],
			'walls': [,,,,,,,,,12],
			},
			{'name': 'taiga_t2',
			'tiles': [8,1,9,7,10,10,10,10,4,4],
			'walls': [,,,,,,,,,],
			},
			{'name': 'taiga_t3',
			'tiles': [8,1,0,7,2,10,10,2,4,4],
			'walls': [,,,,,,,,,],
			},
			{'name': 'plains',
			'tiles': [8,1,0,7,2,2,2,2,4,4],
			'walls': [,,,,,,,,,],
			},
			{'name': 'plains_t1',
			'tiles': [8,1,0,7,2,2,2,2,2,4],
			'walls': [,,,,,,,,,12],
			},
			{'name': 'forest',
			'tiles': [8,1,0,7,2,2,2,2,2,2],
			'walls': [,,,,,,,,11,12],
			},
			{'name': 'jungle',
			'tiles': [8,1,0,7,2,2,2,2,2,2],
			'walls': [,,,,,,,,12,12],
			},
			{'name': 'forest_t1',
			'tiles': [8,1,0,7,2,2,2,2,4,4],
			'walls': [,,,,,,,,11,5],
			},
			{'name': 'forest_t2',
			'tiles': [8,1,0,7,2,2,4,4,4,4],
			'walls': [,,,,,,,,5,5],
			},
			{'name': 'plateau',
			'tiles': [8,1,0,7,4,4,4,4,4,4],
			'walls': [,,,,,,,,5,5],
			},
			{'name': 'plateau_t2',
			'tiles': [8,1,0,7,7,4,4,4,4,4],
			'walls': [,,,,,,,,5,6],
			},
			{'name': 'plateau_t3',
			'tiles': [8,1,0,7,7,7,4,4,4,4],
			'walls': [,,,,,,,,6,6],
			},
			{'name': 'plateau_t4',
			'tiles': [8,1,0,7,7,7,7,7,4,4],
			'walls': [,,,,,,,,6,6],
			},
			{'name': 'desert',
			'tiles': [8,1,0,7,7,7,7,7,7,7],
			'walls': [,,,,,,,,6,6],
			},
			{'name': 'desert_t1',
			'tiles': [8,1,0,7,7,7,7,7,13,13],
			'walls': [,,,,,,,,,6],
			},
			{'name': 'desert_t2',
			'tiles': [8,1,0,7,7,7,13,13,13,13],
			'walls': [,,,,,,,,,11],
			},
			{'name': 'savanna',
			'tiles': [8,1,0,7,13,13,13,13,13,13],
			'walls': [,,,,,,,,,11],
			},
			{'name': 'savanna_t1',
			'tiles': [8,1,0,7,4,4,13,13,13,13],
			'walls': [,,,,,,,,,6],
			},
			{'name': 'savanna_t2',
			'tiles': [8,1,0,7,4,4,4,4,13,13],
			'walls': [,,,,,,,,6,6],
			},
			{'name': 'hell',
			'tiles': [8,1,0,3,4,4,14,14,4,4],
			'walls': [,,,,,,,,6,6],
			},
			{'name': 'hell_t1',
			'tiles': [1,1,0,3,4,4,14,14,4,4],
			'walls': [,,,,,,,,6,6],
			},
			{'name': 'hell_t2',
			'tiles': [1,0,0,3,4,4,14,4,4,4],
			'walls': [,,,,,,,,6,6],
			},
			{'name': 'mountain',
			'tiles': [0,0,0,3,4,4,4,4,4,4],
			'walls': [,,,,,,,6,6,6],
			},
			{'name': 'mountain_t1',
			'tiles': [1,1,0,7,4,4,4,4,4,4],
			'walls': [,,,,,,6,6,6,6],
			},
			{'name': 'mountain_t2',
			'tiles': [8,1,0,7,3,3,4,4,4,4],
			'walls': [,,,,,6,6,6,6,6],
			},
			{'name': 'mountain_t3',
			'tiles': [8,1,0,7,3,3,3,3,4,4],
			'walls': [,,,,,6,6,6,6,6],
			},
			{'name': 'hotsprings',
			'tiles': [8,1,0,7,3,3,3,3,4,0],
			'walls': [,,,,,6,6,6,6,],
			},
			{'name': 'volcano',
			'tiles': [8,1,0,7,3,3,3,3,4,14],
			'walls': [,,,,,6,6,6,6,],
			},
	]
};
var tiles = {
	"0":{"sprite":"tile_sea","block":false, 'set': 'water', 'tpos': [10,0]},
	"1":{"sprite":"tile_deepsea","block":true, 'set': 'water', 'tpos': [24,0]},
	"2":{"sprite":"tile_grass","features":[19,20,21,22,23,24,25], 'tpos': [21,0]},
	"3":{"sprite":"tile_dirt","features":[19,21,25,26,27], 'tpos': [22,0]},
	"4":{"sprite":"tile_stonew", 'tpos': [23,0]},
	"5":{"sprite":"tile_grasspillar","block":true, 'set': 'dirt', 'tpos': [25,0]},
	"6":{"sprite":"tile_stonepillar","block":true, 'set': 'stone', 'tpos': [26,0]},
	"7":{"sprite":"tile_sand","features":[0,0,16,17,18], 'tpos': [27,0]},
	"8":{"sprite":"tile_abyss","block":true,"features":[0,0,15], 'set': 'water', 'tpos': [28,0]},
	"9":{"sprite":"tile_ice", 'tpos': [29,0]},
	"10":{"sprite":"tile_snow","features":[0,0,0,0,28,57], 'tpos': [30,0]},
	"11":{"sprite":"tile_pine","block":true, 'set': 'tree', 'tpos': [31,0]},
	"12":{"sprite":"tile_pines","block":true, 'set': 'tree', 'tpos': [32,0]},
	"13":{"sprite":"tile_drygrass","features":[20,26], 'tpos': [33,0]},
	"14":{"sprite":"tile_lava","block":true, 'tpos': [34,0]},
	"15":{"sprite":"tile_whirl","block":true, 'tpos': [35,0]},
	"16":{"sprite":"tile_shell_1", 'tpos': [36,0]},
	"17":{"sprite":"tile_shell_2", 'tpos': [37,0]},
	"18":{"sprite":"tile_shell_3", 'tpos': [38,0]},
	"19":{"sprite":"tile_weed", 'tpos': [42,0]},
	"20":{"sprite":"tile_bush","block":true, 'tpos': [43,0]},
	"21":{"sprite":"tile_pebbles", 'tpos': [44,0]},
	"22":{"sprite":"tile_flower_1", 'tpos': [39,0]},
	"23":{"sprite":"tile_flower_2", 'tpos': [40,0]},
	"24":{"sprite":"tile_flower_3", 'tpos': [41,0]},
	"25":{"sprite":"tile_dryleaves", 'tpos': [45,0]},
	"26":{"sprite":"tile_deadbush","block":true, 'tpos': [46,0]},
	"27":{"sprite":"tile_fossil", 'tpos': [47,0]},
	"28":{"sprite":"tile_snowman","block":true, 'tpos': [48,0]},
	"29":{"sprite":"tile_ore_Cd","block":true, 'set': 'stone', 'tpos': [52,0]},
	"30":{"sprite":"tile_ore_Hg","block":true, 'set': 'stone', 'tpos': [53,0]},
	"31":{"sprite":"tile_ore_Pb","block":true, 'set': 'stone', 'tpos': [54,0]},
	"32":{"sprite":"tile_ore_As","block":true, 'set': 'stone', 'tpos': [55,0]},
	"33":{"sprite":"tile_ore_Mn","block":true, 'set': 'stone', 'tpos': [56,0]},
	"34":{"sprite":"tile_ore_Cr","block":true, 'set': 'stone', 'tpos': [57,0]},
	"35":{"sprite":"tile_ore_Co","block":true, 'set': 'stone', 'tpos': [58,0]},
	"36":{"sprite":"tile_ore_Ni","block":true, 'set': 'stone', 'tpos': [59,0]},
	"37":{"sprite":"tile_ore_Cu","block":true, 'set': 'stone', 'tpos': [60,0]},
	"38":{"sprite":"tile_ore_Zn","block":true, 'set': 'stone', 'tpos': [61,0]},
	"39":{"sprite":"tile_ore_Se","block":true, 'set': 'stone', 'tpos': [62,0]},
	"40":{"sprite":"tile_ore_Ag","block":true, 'set': 'stone', 'tpos': [63,0]},
	"41":{"sprite":"tile_ore_Sb","block":true, 'set': 'stone', 'tpos': [64,0]},
	"42":{"sprite":"tile_ore_Tl","block":true, 'set': 'stone', 'tpos': [65,0]},
	"43":{"sprite":"tile_oref_Cd", 'tpos': [52,2]},
	"44":{"sprite":"tile_oref_Hg", 'tpos': [53,2]},
	"45":{"sprite":"tile_oref_Pb", 'tpos': [54,2]},
	"46":{"sprite":"tile_oref_As", 'tpos': [55,2]},
	"47":{"sprite":"tile_oref_Mn", 'tpos': [56,2]},
	"48":{"sprite":"tile_oref_Cr", 'tpos': [57,2]},
	"49":{"sprite":"tile_oref_Co", 'tpos': [58,2]},
	"50":{"sprite":"tile_oref_Ni", 'tpos': [59,2]},
	"51":{"sprite":"tile_oref_Cu", 'tpos': [60,2]},
	"52":{"sprite":"tile_oref_Zn", 'tpos': [61,2]},
	"53":{"sprite":"tile_oref_Se", 'tpos': [62,2]},
	"54":{"sprite":"tile_oref_Ag", 'tpos': [63,2]},
	"55":{"sprite":"tile_oref_Sb", 'tpos': [64,2]},
	"56":{"sprite":"tile_oref_Tl", 'tpos': [65,2]},
	"57":{"sprite":"item_matter", 'tpos': [0,0]}
};

var technology = {
	'0': {'name': 'Prehistory', 'requires': [], 'desc': 'Starting technology. NPC will roam in search for food to survive.'},
	'1': {'name': 'Animal Taming', 'requires': [0], 'desc': 'Will make possible to tame wild animals.'},
	'2': {'name': 'Agriculture', 'requires': [0], 'desc': 'Allows the gathering and planting of seeds.'},
	'3': {'name': 'Fire', 'requires': [0], 'desc': 'Your people will discover fire. Enabling cooking.'},
	'4': {'name': 'Basic Stone Work', 'requires': [0], 'desc': 'Enables the use of basic tools for chopping trees and mining.'},
	'5': {'name': 'Smelting', 'requires': [3], 'desc': 'Requires the discovery of Fire. Your people will be able to use furnaces for smelting and cooking purposes.'},
	'6': {'name': 'Currency: Sea Shells', 'requires': [0], 'desc': 'Allows the use of sea shells as currency. Unlocks shops.'},
	'7': {'name': 'Spears', 'requires': [4], 'desc': 'Unlocks spears used as weapons for hunting.'},

	'8': {'name': '*Law Code', 'requires': [0,1,2,3,4,5,6,7], 'desc': 'test.'},
};
var jobs = [
	//Basic Jobs
	{'type': 'com', 'name': 'Scientist', 'requires': [], 'tasks': ['research']},

	{'type': 'fir', 'name': 'Fisher', 'requires': [0], 'tasks': ['fish']},
	{'type': 'com', 'name': 'Shaman', 'requires': [0], 'tasks': ['heal']},
	{'type': 'com', 'name': 'Gatherer', 'requires': [0], 'tasks': ['pickup']},
	{'type': 'com', 'name': 'Builder', 'requires': [0], 'tasks': ['build', 'clean']},
	{'type': 'fir', 'name': 'Rancher', 'requires': [1]},
	{'type': 'fir', 'name': 'Farmer', 'requires': [2]},
	{'type': 'fir', 'name': 'Forester', 'requires': [4]},
	{'type': 'fir', 'name': 'Miner', 'requires': [4]},
	{'type': 'sec', 'name': 'Cooker', 'requires': [3]},
	{'type': 'sec', 'name': 'Baker', 'requires': [5]},
	{'type': 'sec', 'name': 'Butcher', 'requires': [4]},
	{'type': 'sec', 'name': 'Woodworker', 'requires': [4]},
	{'type': 'sec', 'name': 'Smelter', 'requires': [5]},
	{'type': 'sec', 'name': 'Blacksmith', 'requires': [5]},
	{'type': 'thi', 'name': 'Shopkeeper', 'requires': [6]},
	{'type': 'fir', 'name': 'Hunter', 'requires': [7]},
	{'type': 'com', 'name': 'Soldier', 'requires': [8]},
]

function init() {
	var ver = changes().latestVersion;
	document.title = 'Everyworld '+ver;
	addToLog('Changing title to '+document.title);

	addToLog('Generating spritesheet');
	sprites = new Spritesheet('tiles', []);
	for (var t in tiles) {
		var x = 0, y = 0;
		var tile = tiles[t];
		var x = (tile.tpos && tile.tpos[0]) ? tile.tpos[0] : 0;
		var y = (tile.tpos && tile.tpos[1]) ? tile.tpos[1] : 0;

		sprites.positions[t] = [x, y];
		addToLog('Sprite for '+tile.sprite+' added at x:'+x+' y:'+y);
	}

	addToLog('Getting context of layers');
	layers = {
		'bottom': getc('layer_bottom'),
		'wall': getc('layer_wall'),
		'shadow': getc('layer_shadow'),
		'overlay': getc('layer_overlay'),
		'items': getc('layer_items'),
		'entities': getc('layer_entities'),
	}

	contbutton.style.opacity = (everyworld) ? 1 : 0.5;
	addToLog('everyworld is '+typeof everyworld);
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
	img.src = 'img_td/tiles.png';

	this.img = img;
	this.width = twidth
	this.height = theight * 2;
	this.positions = positions;
}
Spritesheet.prototype = {
	draw: function(wherecontext, id, x, y){
		var pos = this.positions[id];
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
function drawSprite(layer, spriteID, x, y) {
	sprites.draw(layers[layer], spriteID, x, y);
}
function drawSpriteMap(x, y) {
	var map = everyworld.map;
	var walls = everyworld.walls;

	for (var l in layers) {
		layers[l].clearRect(0, 0, 640, 480);
	}
	for (var y = camera.y-range.y; y < camera.y+range.y; y++) {
		for (var x = camera.x-range.x; x < camera.x+range.x; x++) {

			var absx = x - camera.x + Math.floor(range.x / 2);
			var absy = y - camera.y + Math.floor(range.y / 2);

			var id = (map[y] && map[y][x] != undefined) ? map[y][x] : 57;
			drawSprite('bottom', id, absx, absy);

			var id = (walls[y] && walls[y][x]) ? walls[y][x] : 57;
			drawSprite('wall', id, absx, (absy-1));
		}
	}
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
function newMap(height, width) {
	var noise = new SimplexNoise();
	var map = [];
	var walls = [];
	var heightMap = [];
	var temperatureMap = [];
	for (var h = 0; h < height; h++) {
		var li = [];
		var tli = [];

		var mp = [];
		var wp = [];
		for (var w = 0; w < width; w++) {
			var rw = parseInt(w) * (terrainGenerator.noise);
			var rh = parseInt(h) * (terrainGenerator.noise);

			var n1 = noise.noise(rw, rh);
			var n2 = noise.noise(rw * 2, rh * 2) / 2;
			var n3 = noise.noise(rw * 3, rh * 3) / 3;
			var n4 = noise.noise(rw * 4, rh * 4) / 4;

			var n = n1 + n2 + n3 + n4;
			if (n < -1) n = -1;
			if (n > 0.99) n = 0.99;
			li.push(n);
			var temp = noise.noise(rw/4, rh/4);

			tli.push(temp);

			var biom = getBiome(temp).biome;

			mp.push(tileByHeight(biom, n));
			wp.push(tileByHeight(biom, n, 'wall'));
		}
		map.push(mp);
		walls.push(wp);


		heightMap.push(li);
		temperatureMap.push(tli);
	}

	return {'height': heightMap, 'map': map, 'walls': walls, 'temperature': temperatureMap}
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
			if (feat && rand(1,10) == 1) tile = feat;
		}
	}
	return tile;
}
function Task(what, where, input, output) {
	
}
function newWorld() {
	var ww = 50;
	var hh = 50;
	var map = newMap(ww, hh);
	if (!everyworld) everyworld = {};
	everyworld.height = map.height;
	everyworld.map = map.map;
	everyworld.walls = map.walls;
	everyworld.temperature = map.temperature;
	everyworld.tech = [true];
	everyworld.meta = [];


	loadWorld();
	var bs = bestSpawn(camera.x, camera.y);
	for (var x = 0; x < 10; x++) spawnHuman(bs.x, bs.y);
	addZone(0, {'x': bs.x-1, 'y': bs.y-1}, {'x': bs.x+2, 'y': bs.y+2});

	ticker();
}
function cleanTile(x, y) {

}
function tickTile(x, y, abs) {
	var absx = camera.x - Math.floor(range.x / 2) + x;
	var absy = camera.y - Math.floor(range.y / 2) + y;

	if (abs) {
		absx = x;
		absy = y;
	}

	var floor = whatsHere(everyworld.map, absx, absy);
	var wall = whatsHere(everyworld.walls, absx, absy);
	var meta = changeMeta(absx, absy, 'get');

	var iswater = (tiles[floor].set == 'water')

	if (iswater) {
		var fish = meta.fish;
		if (!fish) fish = 0;
		if (rand(1,100) == 1) changeMeta(absx, absy, 'fish', fish+1);
	}

	//Zoned changes
	if (meta.zone != undefined) {

	}
	

	//Spreading tiles
	var rside = rand(0,3);
	var dir = directions[rside];
	var rx = x+dir.x;
	var ry = y+dir.y;

	var tx = absx+dir.x;
	var ty = absy+dir.y;

	var therefloor = whatsHere(everyworld.map, tx, ty);
	var therewall = whatsHere(everyworld.walls, tx, ty);
	var theremeta = changeMeta(tx, ty, 'get');
	if (rx > 0 && ry > 0 && rx < range.x && ry < range.y && rand(0,1) && !theremeta.progress) {
		var therewater = (tiles[therefloor].set == 'water');

		if (meta.fish > 0 && therewater) {
			var hf = meta.fish || 0;
			var tf = theremeta.fish || 0;
			changeMeta(absx, absy, 'fish', hf-1);
			changeMeta(tx, ty, 'fish', tf+1);
		}

		if (floor == '9' && therewater) {
			everyworld.map[ty][tx] = 9;
		}
		if (iswater && therefloor == '9') {
			everyworld.map[ty][tx] = 0;
		}
		if (floor == '9' && meta.fish > 0) {
			meta.fish--;
		}

		setTimeout(function() {
			tickTile(rx, ry, abs);
		}, 100);
	}
	if (abs) return;

	updateEWMap(x, y);
	updateShadow(x, y);
}
function Zone(type, startx, starty, endx, endy) {
	this.type = type;
	this.start = {'x': startx, 'y': starty};
	this.end = {'x': endx, 'y': endy};
}
function timePass() {
	if (everyworld.minute == undefined) everyworld.minute = 0;
	if (everyworld.hour == undefined) everyworld.hour = 6;

	everyworld.minute += 1;
	if (everyworld.minute >= 60) {
		everyworld.minute = 0;
		everyworld.hour++;
		if (everyworld.hour >= 24) {
			everyworld.hour = 0;
		}
	}

	updateShadows();
}
function updateCamera() {
	positionAll();
	drawEWMap();
	updateShadows();
}
function moveCamera(direction) {
	var d = directions[direction];

	camera.x += d.x;
	camera.y += d.y;

	for (var c in everyworld.characters) {
		var chara = everyworld.characters[c];
		if (chara.x > camera.x - range.x && chara.x < camera.x + range.x &&
			chara.y > camera.y - range.y && chara.y < camera.y + range.y) {
			var i = tickList.indexOf(c);
			if (i < 0) tickList.push(c);
		}
		//chara.lastTick = 0;
	}
	updateCamera();

	drawSpriteMap();
}
function spawnHuman(x, y) {
	if (!everyworld.totalpop) everyworld.totalpop = 0;
	var id = 'H'+everyworld.totalpop;
	everyworld.totalpop++;
	var p = new Person(id, 'human');
	p.x = x;
	p.y = y;
	p.job = getRandomJob();
	p.hobby = getRandomJob();
	if (!everyworld.characters) everyworld.characters = [];
	everyworld.characters.push(p);
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
	startx = x;
	starty = y;
	while (!stepable(startx, starty)) {
		startx += red(-1, 0, 1);
		starty += red(-1, 0, 1);
	}
	return {'x': startx, 'y': starty}
}
function stepable(x, y) {
	if (everyworld.walls && everyworld.walls[y] && everyworld.walls[y][x]) {
		if (tiles[everyworld.walls[y][x]].block) return false;
	}
	if (everyworld.map && everyworld.map[y] && everyworld.map[y][x]) {
		if (tiles[everyworld.map[y][x]].block) return false;
	}
	if (everyworld.map == undefined || everyworld.map[y] == undefined || everyworld.map[y][x] == undefined) return false;
	return true;
}
function work(id) {
	var chara = everyworld.characters[id];
	var job = jobs[chara.job];
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
function tickCharacter(id) {
	var chara = everyworld.characters[id];
	var cdoc = doc('chara_'+chara.id);
	if (!cdoc) {
		var d = document.createElement('chara');
		d.className = 'guy_layer';
		d.id = 'chara_'+chara.id;
		d.style.background = 'url(img_td/someguy.png)';
		d.style.zIndex = chara.y+2;
		d.title = chara.name+' '+chara.family+' ('+jobs[chara.job].name+'/'+jobs[chara.hobby].name+')';
		d.onclick = function() {
			order(chara.id);
		}
		layer_entities.appendChild(d);
	}
	work(id);
	if (chara.objective && chara.objective.length > 0) {
		gps(chara, chara.objective[0]);
		chara.objective.splice(0, 1);
	}

	positionCharacter(chara);
}
function gps(from, to) {
	//0 top, 1 right, 2 bottom, 3 left
	var dir = 0;
	if (from.y > to.y) dir = 0;
	if (from.y < to.y) dir = 2;
	if (from.x > to.x) dir = 3;
	if (from.x < to.x) dir = 1;

	moveCharacter(from, dir);
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
function order(id) {
	selectedChar = id;
}
function positionCharacter(chara) {
	cdoc = doc('chara_'+chara.id);
	var absx = chara.x - camera.x + Math.floor(range.x / 2);
	var absy = chara.y - camera.y + Math.floor(range.y / 2);

	if (!cdoc) return;

	var top = cdoc.style.top;
	var left = cdoc.style.left;
	var ntop = ((absy - 2) * theight)+'px';
	var nleft = (absx * twidth)+'px';

	cdoc.style.backgroundColor = 'transparent';
	if (selectedChar == chara.id) cdoc.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
	cdoc.style.top = ntop;
	cdoc.style.left = nleft;
	cdoc.style.zIndex = chara.y+2;
	cdoc.style.backgroundPosition = getBackgroundPosition(chara, 0, chara.walking);
}
function moveCharacter(chara, direction) {
	var dir = direction;
	chara.facing = dir;
	chara.walking = true;
	var direction = directions[direction];
	var there = {'x': chara.x + direction.x, 'y': chara.y + direction.y};
	if (stepable(there.x, there.y)) {
		chara.x += direction.x;
		chara.y += direction.y;
	}
	setTimeout(function() {
		chara.walking = false;
		positionCharacter(chara);
	}, 100);
	if (selectedChar == chara.id) {
		camera.x = chara.x;
		camera.y = chara.y;
		updateCamera();
	}
}
function positionAll() {
	for (var c in everyworld.characters) positionCharacter(everyworld.characters[c]);
}
function ticker() {
	var now = Date.now();
	var willTick = tickList;
	for (var x = 0; x < 3; x++) willTick.push(rand(1, everyworld.characters.length) - 1);
	for (var h in willTick) {
		var chara = everyworld.characters[tickList[h]];
		if (!chara) continue;
		if (!chara.lastTick) chara.lastTick = 0;
		var d = now - chara.lastTick;
		if (d < 250) continue;
		chara.lastTick = now;

		tickCharacter(tickList[h]);
	}

	var rx = rand(1, range.x) - 1;
	var ry = rand(1, range.y) - 1;
	tickTile(rx, ry);

	var r = getRandomPosition();
	tickTile(r.x, r.y, 1);

	requestAnimationFrame(ticker);
}
function getRandomPosition() {
	var rx = rand(1, everyworld.map[0].length) - 1;
	var ry = rand(1, everyworld.map.length) - 1;
	return {'x': rx, 'y': ry};
}
function createEWMap() {
	for (var w = 0; w < range.x; w++) {
		for (var h = 0; h < range.y; h++) {
			var docert = document.createElement('tile');
			docert.id = 'tile_'+w+'_'+h;
			docert.style.left = (w * twidth)+'px';
			docert.style.top = (h * theight)+'px';

			var docerw = document.createElement('wall');
			docerw.id = 'wall_'+w+'_'+h;
			docerw.style.left = (w * twidth)+'px';
			docerw.style.top = ((h-1) * theight)+'px';

			var docers = document.createElement('shadow');
			docers.id = 'shadow_'+w+'_'+h;
			docers.style.left = ((w) * twidth)+'px';
			docers.style.top = ((h+1) * theight)+'px';

			var docero = document.createElement('tile');
			docero.id = 'overlay_'+w+'_'+h;
			docero.className = 'boldy overlay';
			docero.style.left = (w * twidth)+'px';
			docero.style.top = ((h-1) * theight)+'px';
			docero.style.fontSize = '8px';

			doc('layer_bottom').appendChild(docert);
			doc('layer_wall').appendChild(docerw);
			doc('layer_shadow').appendChild(docers);
			doc('layer_overlay').appendChild(docero);
		}
	}
}
function updateShadow(x, y) {
	var hour = everyworld.hour;

	var absx = camera.x - Math.floor(range.x / 2) + x;
	var absy = camera.y - Math.floor(range.y / 2) + y;

	//Overlay
	var docero = doc('overlay_'+x+'_'+y);
	docero.style.opacity = 0;
	docero.style.display = 'none';
	if (everyworld.weather == 'rain' && y % 2 == 0) {
		docero.style.opacity = 1;
		docero.style.display = 'inline-block';
		docero.className = 'tile overlay tile_rain';
	}
	if (everyworld.weather == 'thunder' && y % 2 == 0) {
		docero.style.opacity = 1;
		docero.style.display = 'inline-block';
		docero.className = 'tile overlay tile_thunder';
	}
	if (everyworld.weather == 'snow' && y % 2 == 0) {
		docero.style.opacity = 1;
		docero.style.display = 'inline-block';
		docero.className = 'tile overlay tile_snowy';
	}

	if (everyworld.meta[absy] && everyworld.meta[absy][absx]) {
		docero.innerHTML = '';
		docero.className = 'tile overlay';
		docero.style.width = twidth+'px';
		docero.style.height = twidth+'px';

		docero.style.backgroundImage = 'none';
		docero.style.backgroundColor = 'transparent';
		docero.style.opacity = 0.2;
		docero.style.display = 'block';
		var meta = everyworld.meta[absy][absx];
		if (meta.bed != undefined) docero.innerHTML += 'bed ';
		if (meta.value != undefined) docero.innerHTML += Math.floor(meta.value)+' ';
		if (meta.science != undefined) docero.innerHTML += 'SO ';
		if (meta.warehouse != undefined) docero.innerHTML += 'ware ';
		if (meta.progress != undefined) docero.innerHTML += (meta.progress * 100)+'% ';
		if (meta.fish) docero.innerHTML += meta.fish+'f ';
		if (meta.zone != undefined) {
			var zones = ['#80f', '#f80', '#08f', '#f00', '#0f0', '#000'];
			docero.style.backgroundColor = zones[meta.zone];
		}
	}

	var docers = doc('shadow_'+x+'_'+y);
	var wh = whatsHere(everyworld.walls, absx, absy);
	docers.style.display = (wh == undefined) ? 'none' : 'inline-block';
	if (wh == undefined) return;

	wh = tiles[wh].sprite;
	var whs = 'tile shadow '+wh;
	if (docers && docers.className && docers.className != whs) docers.className = whs;

	var skew = (hour - 12) * 5;
	var addwidth = Math.tan(skew*Math.PI/180) * theight;

	var dst = 'scaleY(-1) skewX('+skew+'deg)';
	if (docers.style.transform != dst) docers.style.transform = dst;

	var dsl = ((x * twidth)-addwidth)+'px';
	if (docers.style.left != dsl) docers.style.left = dsl;
}
function action(x, y) {
	var absx = camera.x - Math.floor(range.x / 2) + x;
	var absy = camera.y - Math.floor(range.y / 2) + y;

	if (selectedChar) {
		var chara;
		for (var c in everyworld.characters) {
			var ch = everyworld.characters[c];
			if (ch.id == selectedChar) {
				chara = ch;
				break;
			}
		}
		chara.objective = pathFind(chara, {'x': absx, 'y': absy}).path;
	}
}
function aliasToSprite(alias) {
	if (!tiles[alias]) return 'void';
	return tiles[alias].sprite;
}
function updateEWMap(x, y) {
	var absx = camera.x - Math.floor(range.x / 2) + x;
	var absy = camera.y - Math.floor(range.y / 2) + y;

	var docert = doc('tile_'+x+'_'+y);
	var wh = whatsHere(everyworld.map, absx, absy);
	docert.style.zIndex = 0;
	wh = aliasToSprite(wh);
	var cn = 'tile '+wh;
	if (docert.className != cn) docert.className = cn;

	docert.title = 'tile x:'+absx+' y:'+absy+' z:'+docert.style.zIndex;
	docert.onclick = function() {
		action(x, y);
	}
	
	var docerw = doc('wall_'+x+'_'+y);
	docerw.style.zIndex = absy+2;
	var wh = whatsHere(everyworld.walls, absx, absy);
	wh = aliasToSprite(wh);
	var cn = 'tile '+wh;
	if (docerw.className != cn) docerw.className = cn;

	var docero = doc('overlay_'+x+'_'+y);
	docero.style.zIndex = absy+3;
	docero.style.opacity = 0;
}
function getBiome(temperature) {
	temperature++;

	if (!temperature) temperature = 0;

	var weatherByTemperature = Math.floor(temperature / (2 / terrainGenerator.biomes.length));

	return {'temperature': weatherByTemperature, 'biome': terrainGenerator.biomes[weatherByTemperature]}
}
function whatsHere(array, x, y) {
	if (array == undefined) return;
	if (array[y] == undefined) return;
	if (array[y][x] == undefined) return;
	return array[y][x];
}
function updateShadows() {
	for (var w = 0; w < range.x; w++) {
		for (var h = 0; h < range.y; h++) {
			updateShadow(w, h);
		}
	}
}
function displayResearch() {
	
}
function drawEWMap() {
	for (var w = 0; w < range.x; w++) {
		for (var h = 0; h < range.y; h++) {
			updateEWMap(w, h);
		}
	}
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
	addToLog('Loading world...');
	game_menu.style.display = 'none';
	game_game.style.display = 'block';
	if (!everyworld.characters) everyworld.characters = [];

	createEWMap();
	drawEWMap();
	setInterval(timePass, 1000);
}

$('body').on('keypress', function(evt) {
    var key = String.fromCharCode(evt.charCode).toLowerCase();

    if (key == 'w') moveCamera(0);
    if (key == 'a') moveCamera(3);
    if (key == 'd') moveCamera(1);
    if (key == 's') moveCamera(2);
    if (key == 'r') displayResearch();
});

//Flow
init();