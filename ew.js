//Changelog
var changelog = ['a', 'ax', 'af', 'af humans'];

//Variable declarations
var everyworld;
var lastlog = [];
var tickList = [];
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
	{'type': 'fir', 'name': 'Fisher', 'requires': [0]},

	{'type': 'com', 'name': 'Shaman', 'requires': [0]},
	{'type': 'com', 'name': 'Gatherer', 'requires': [0]},
	{'type': 'com', 'name': 'Builder', 'requires': [0]},
	{'type': 'com', 'name': 'Scientist', 'requires': []},

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

			var n = n1 + n2 + n3;
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
	var ftile = tile;
	if (wallmode) {
		tile = biom.walls[v];
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
	everyworld.zones = [{'type': 'warehouse', 'start': {}, 'end': {}, 'color': 'rgba(128, 255, 0, 0.1)'}];
	everyworld.tasks = [];

	loadWorld();
	for (var x = 0; x < 10; x++) spawnHuman();
	ticker();
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

	drawEWMap();
	updateShadows();
}
function spawnHuman() {
	if (!everyworld.totalpop) everyworld.totalpop = 0;
	var id = 'H'+everyworld.totalpop;
	everyworld.totalpop++;
	var p = new Person(id, 'human');
	var bs = bestSpawn(camera.x, camera.y);
	p.x = bs.x;
	p.y = bs.y;
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
	if (!everyworld.map || !everyworld.map[y] || !everyworld.map[y][x]) return false;
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
	var qindex = 0;
	while (true) {
		var pointer = queue[qindex];
		if (!pointer) break;
		if (pointer.x == from.x && pointer.y == from.y) break;
		for (var d = 0; d < 4; d++) {
			var dir = directions[d];
			var point = {'x': pointer.x + dir.x, 'y': pointer.y + dir.y, 'value': pointer.value + 1 + Math.random()};

			var eligible = true;
			if (!stepable(point.x, point.y)) eligible = false;

			for (var q in queue) {
				var qu = queue[q];
				if (point.x == qu.x && point.y == qu.y) eligible = false;
			}
			if (eligible) queue.push(point);
		}
		qindex++;
	}
	queue.sort(function(a, b) {
		return a.value - b.value;
	});

	var mover = {'x': from.x, 'y': from.y};
	var path = [];
	while (true) {
		var lowest = {'value': Infinity, 'x': 0, 'y': 0};
		for (var d = 0; d < 4; d++) {
			var dir = directions[d];
			var point = {'x': mover.x + dir.x, 'y': mover.y + dir.y};

			for (var q in queue) {
				var qu = queue[q];
				if (qu.x == point.x && qu.y == point.y && qu.value < lowest.value) lowest = {'value': qu.value, 'x': point.x, 'y': point.y} 
			}
		}
		path.push(lowest);
		if (lowest.value == Infinity) break;
		mover.x = lowest.x;
		mover.y = lowest.y;

		if (mover.x == to.x && mover.y == to.y) break;
	}

	return {'queue': queue, 'path': path};
}
function order(id) {
	selectedChar = id;
}
function positionCharacter(chara) {
	cdoc = doc('chara_'+chara.id);
	var absx = chara.x - camera.x + Math.floor(range.x / 2);
	var absy = chara.y - camera.y + Math.floor(range.y / 2);

	if (!cdoc) return;

	cdoc.style.backgroundColor = 'transparent';
	if (selectedChar == chara.id) cdoc.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
	cdoc.style.top = ((absy - 2) * theight)+'px';
	cdoc.style.left = (absx * twidth)+'px';
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
	}, 200);
}
function ticker() {
	var now = Date.now();
	var willTick = tickList;
	for (var x = 0; x < 3; x++) willTick.push(rand(1, everyworld.characters.length) - 1);
	for (var h in willTick) {
		var chara = everyworld.characters[tickList[h]];
		positionCharacter(chara);
		if (!chara) continue;
		if (!chara.lastTick) chara.lastTick = 0;
		var d = now - chara.lastTick;
		if (d < 250) continue;
		chara.lastTick = now;

		tickCharacter(tickList[h]);
		addToLog('ticked '+tickList[h]+' ('+h+') '+chara.id);
	}

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
			docero.style.left = ((w) * twidth)+'px';
			docero.style.top = ((h) * theight)+'px';

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