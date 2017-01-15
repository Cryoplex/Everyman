//Changelog
var changelog = ['a', 'ax', 'af', 'af humans', 'ax zones'];

//Variable declarations
var everyworld;
var lastlog = [];
var tickList = [];
var zonelist = [];
var twidth = 24;
var theight = 24;
var selectedChar = -1;
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
var camera = {'x': 150, 'y': 150};
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
	],

	'features': {
		'8': [0, 0, 15],
		'7': [0, 0, 16, 17, 18],
		'2': [19, 20, 21, 22, 23, 24, 25],
		'3': [19, 21, 25, 26, 27],
		'13': [20, 26],
		'10': [0, 0, 0, 0, 28],
	},
};
var block = {
	'0': false,
	'1': true,
	'5': true,
	'6': true,
	'8': true,
	'11': true,
	'12': true,
	'14': true,
	'15': true,
	'20': true,
	'26': true,
	'28': true,

	'29': true, 
	'30': true, 
	'31': true, 
	'32': true, 
	'33': true, 
	'34': true, 
	'35': true, 
	'36': true, 
	'37': true, 
	'38': true, 
	'39': true, 
	'40': true, 
	'41': true, 
	'42': true, 
}
var tileAliases = {
	'0': 'tile_sea',
	'1': 'tile_deepsea',
	'2': 'tile_grass',
	'3': 'tile_dirt',
	'4': 'tile_stonew',
	'5': 'tile_grasspillar',
	'6': 'tile_stonepillar',
	'7': 'tile_sand',
	'8': 'tile_abyss',
	'9': 'tile_ice',
	'10': 'tile_snow',
	'11': 'tile_pine',
	'12': 'tile_pines',
	'13': 'tile_drygrass',
	'14': 'tile_lava',

	'15': 'tile_whirl',
	'16': 'tile_shell_1',
	'17': 'tile_shell_2',
	'18': 'tile_shell_3',
	'19': 'tile_weed',
	'20': 'tile_bush',
	'21': 'tile_pebbles',
	'22': 'tile_flower_1',
	'23': 'tile_flower_2',
	'24': 'tile_flower_3',
	'25': 'tile_dryleaves',
	'26': 'tile_deadbush',
	'27': 'tile_fossil',
	'28': 'tile_snowman',

	'29': 'tile_ore_Cd',
	'30': 'tile_ore_Hg',
	'31': 'tile_ore_Pb',
	'32': 'tile_ore_As',
	'33': 'tile_ore_Mn',
	'34': 'tile_ore_Cr',
	'35': 'tile_ore_Co',
	'36': 'tile_ore_Ni',
	'37': 'tile_ore_Cu',
	'38': 'tile_ore_Zn',
	'39': 'tile_ore_Se',
	'40': 'tile_ore_Ag',
	'41': 'tile_ore_Sb',
	'42': 'tile_ore_Tl',

	'43': 'tile_oref_Cd',
	'44': 'tile_oref_Hg',
	'45': 'tile_oref_Pb',
	'46': 'tile_oref_As',
	'47': 'tile_oref_Mn',
	'48': 'tile_oref_Cr',
	'49': 'tile_oref_Co',
	'50': 'tile_oref_Ni',
	'51': 'tile_oref_Cu',
	'52': 'tile_oref_Zn',
	'53': 'tile_oref_Se',
	'54': 'tile_oref_Ag',
	'55': 'tile_oref_Sb',
	'56': 'tile_oref_Tl',
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
	{'type': 'fir', 'name': 'Fisher', 'requires': [0], 'tasks': ['fish']},
	{'type': 'com', 'name': 'Shaman', 'requires': [0], 'tasks': ['heal']},
	{'type': 'com', 'name': 'Gatherer', 'requires': [0], 'tasks': ['pickup']},
	{'type': 'com', 'name': 'Builder', 'requires': [0], 'tasks': ['build', 'clean']},
	{'type': 'com', 'name': 'Scientist', 'requires': [], 'tasks': ['research']},
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


	contbutton.style.opacity = (everyworld) ? 1 : 0.5;
	addToLog('everyworld is '+typeof everyworld);
}
function closer(arr, value) {
	arr.sort(function(a, b) {
		return a-value;
	});
	return arr;
}
function regenTile(map, x, y) {

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
	addToLog('walls: '+walls.join('.'));

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
			var feat = terrainGenerator.features[ftile];
			if (feat) feat = read(feat);
			if (feat && rand(1,10) == 1) tile = feat;
		}
	}
	return tile;
}
function Task(what, where, input, output) {

}
function newWorld() {
	var ww = 300;
	var hh = 300;
	var map = newMap(ww, hh);
	addToLog('generating '+ww+'x'+hh+' tiles map');
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

	var iswater = (floor == 1 || floor == 8 || floor == 0);

	if (iswater) {
		var fish = meta.fish;
		if (!fish) fish = 0;
		if (rand(1,100) == 1) changeMeta(absx, absy, 'fish', fish+1);
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
		var therewater = (therefloor == 1 || therefloor == 0 || therefloor == 8);

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
		if (block[everyworld.walls[y][x]]) return false;
	}
	if (everyworld.map && everyworld.map[y] && everyworld.map[y][x]) {
		if (block[everyworld.map[y][x]]) return false;
	}
	if (everyworld.map == undefined || everyworld.map[y] == undefined || everyworld.map[y][x] == undefined) return false;
	return true;
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
	if (!chara.objective) {

	}
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

		var q0 = queue[0] || {'dist': Infinity};
		var q1 = queue[1] || {'dist': Infinity};
		var q2 = queue[2] || {'dist': Infinity};
		console.log('queue0dist', q0.dist, 'queue1dist', q1.dist, 'queue2dist', q2.dist);
		if (!pointer) break;
		if (pointer.x == from.x && pointer.y == from.y) break;
		for (var d = 0; d < 4; d++) {
			var dir = directions[d];
			var v = pointer.value + 1 + Math.random();
			var point = {'x': pointer.x + dir.x, 'y': pointer.y + dir.y, 'value': v};
			changeMeta(pointer.x+dir.x, pointer.y+dir.y, 'value', v);

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

	var rx = rand(1, everyworld.map[0].length) - 1;
	var ry = rand(1, everyworld.map.length) - 1;
	tickTile(rx, ry, 1);

	requestAnimationFrame(ticker);
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
			docero.className = 'boldy';
			docero.style.left = (w * twidth)+'px';
			docero.style.top = (h * theight)+'px';

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
		docero.style.width = twidth+'px';
		docero.style.height = twidth+'px';

		docero.style.backgroundImage = 'none';
		docero.style.backgroundColor = 'transparent';
		docero.style.opacity = 0.8;
		docero.style.display = 'block';
		var meta = everyworld.meta[absy][absx];
		if (meta.bed != undefined) docero.innerHTML += 'bed ';
		if (meta.value != undefined) docero.innerHTML += Math.floor(meta.value)+' ';
		if (meta.science != undefined) docero.innerHTML += 'SO ';
		if (meta.warehouse != undefined) docero.innerHTML += 'ware ';
		if (meta.progress != undefined) docero.innerHTML += (meta.progress * 100)+'% ';
		if (meta.fish) docero.innerHTML += meta.fish+'f ';
		if (meta.zone != undefined) {
			var zones = ['#00f', '#f80', '#08f', '#f00', '#0f0'];
			docero.style.backgroundColor = zones[meta.zone];
		}
	}

	var docers = doc('shadow_'+x+'_'+y);
	var wh = whatsHere(everyworld.walls, absx, absy);
	docers.style.display = (wh == undefined) ? 'none' : 'inline-block';
	if (wh == undefined) return;

	wh = tileAliases[wh];
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
		console.log(chara.objective);
	}
}
function updateEWMap(x, y) {
	var absx = camera.x - Math.floor(range.x / 2) + x;
	var absy = camera.y - Math.floor(range.y / 2) + y;

	var docert = doc('tile_'+x+'_'+y);
	var wh = whatsHere(everyworld.map, absx, absy);
	docert.style.display = (wh == undefined) ? 'none' : 'inline-block';
	docert.style.zIndex = 0;
	wh = tileAliases[wh];
	var cn = 'tile '+wh;
	if (docert.className != cn) docert.className = cn;

	docert.title = 'tile x:'+absx+' y:'+absy+' z:'+docert.style.zIndex;
	docert.onclick = function() {
		action(x, y);
	}
	
	var docerw = doc('wall_'+x+'_'+y);
	docerw.style.zIndex = absy+2;
	var wh = whatsHere(everyworld.walls, absx, absy);
	docerw.style.display = (wh == undefined) ? 'none' : 'inline-block';
	wh = tileAliases[wh];
	var cn = 'tile '+wh;
	if (docerw.className != cn) docerw.className = cn;

	var docero = doc('overlay_'+x+'_'+y);
	docero.style.zIndex = absy+3;
	var cn = 'tile';
	if (docero.className != cn) docero.className = cn;
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
function addZone(type, start, end) {
	if (everyworld.zones == undefined) everyworld.zones = [];
	everyworld.zones.push({
		'type': type,
		'start': start,
		'end': end,
		'x': half(start.x, end.x),
		'y': half(start.x, end.y),
	});
	for (var x = start.x; x < end.x; x++) {
		for (var y = start.y; y < end.y; y++) {
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