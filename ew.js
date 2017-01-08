//Changelog
var changelog = ['a'];

//Variable declarations
var everyworld;
var lastlog = [];
var twidth = 24;
var theight = 24;
var directions = [
	{'x': 0, 'y': -1}, //Top
	{'x': 1, 'y': 0}, //Right
	{'x': -1, 'y': 0}, //Left
	{'x': 0, 'y': 1}, //Bottom

	{'x': 1, 'y': -1}, //Topright
	{'x': 1, 'y': 1}, //Bottomright
	{'x': -1, 'y': 1}, //Bottomleft
	{'x': -1, 'y': -1}, //Topleft
];
var camera = {'x': 0, 'y': 0};
var range = {'x': 40, 'y': 20};

var loadrange = 0;

//Config
var terrainGenerator = {
	'noise': 0.02,

	'biomes': [
		[
			{'name': 'frozensea',
			'tiles': [9,9,9,9,9,9,9,9,7,10],
			'walls': [,,,,,,,,],
			},
			{'name': 'tundra',
			'tiles': [9,9,9,7,10,10,10,10,10,10],
			'walls': [,,,,,,,,5,6],
			},
			{'name': 'taiga',
			'tiles': [9,9,9,7,10,10,10,10,10,10],
			'walls': [,,,,,,,,11,12],
			},
			{'name': 'mountain',
			'tiles': [0,0,0,3,4,4,4,4,4,4],
			'walls': [,,,,,,,,6,6],
			},
		],

		[
			{'name': 'dryplains',
			'tiles': [8,1,0,7,3,3,3,3,4,4],
			'walls': [,,,,,,,,,],
			},
			{'name': 'plains',
			'tiles': [8,1,0,7,2,2,2,2,4,4],
			'walls': [,,,,,,,,,],
			},
			{'name': 'forest',
			'tiles': [8,1,0,7,2,2,2,2,2,2],
			'walls': [,,,,,,,,11,12],
			},
			{'name': 'plateau',
			'tiles': [8,1,0,7,4,4,4,4,4,4],
			'walls': [,,,,,,,,5,5],
			},
		],

		[
			{'name': 'desert',
			'tiles': [8,1,0,7,7,7,7,7,7,7],
			'walls': [,,,,,,,,,],
			},
			{'name': 'savanna',
			'tiles': [8,1,0,7,13,13,13,13,13,13],
			'walls': [,,,,,,,,,11],
			},
			{'name': 'jungle',
			'tiles': [8,1,0,7,2,2,2,2,2,2],
			'walls': [,,,,,,,,12,12],
			},
			{'name': 'ocean',
			'tiles': [8,1,0,0,0,0,0,0,7,2],
			'walls': [,,,,,,,,],
			},
		],

		[
			{'name': 'lavasea',
			'tiles': [14,14,14,14,14,14,14,14,3,4],
			'walls': [,,,,,,,,],
			},
			{'name': 'hell',
			'tiles': [14,14,14,3,4,4,4,4,4,4],
			'walls': [,,,,,,,,5,5],
			},
			{'name': 'hotsprings',
			'tiles': [8,1,0,7,3,3,3,3,4,0],
			'walls': [,,,,,,,,6,],
			},
			{'name': 'volcano',
			'tiles': [8,1,0,7,3,3,3,3,4,14],
			'walls': [,,,,,,,,6,],
			},
		],
	],
};
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
};

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
	var humidityMap = [];
	for (var h = 0; h < height; h++) {
		var li = [];
		var tli = [];
		var hli = [];

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
			var hum = noise.noise(rh/4, rw/4);
			tli.push(temp);
			hli.push(hum);

			var biom = getBiome(temp, hum).biome;

			mp.push(tileByHeight(biom, n));
			wp.push(tileByHeight(biom, n, 'wall'));
		}
		map.push(mp);
		walls.push(wp);


		heightMap.push(li);
		temperatureMap.push(tli);
		humidityMap.push(hli);
	}
	addToLog('walls: '+walls.join('.'));

	return {'height': heightMap, 'map': map, 'walls': walls, 'humidity': humidityMap, 'temperature': temperatureMap}
}
function tileByHeight(biom, height, wallmode) {
	height++;
	var max = 2 / biom.tiles.length;
	var v = Math.floor(height / max);
	var tile = biom.tiles[v];
	if (wallmode) tile = biom.walls[v];
	return tile;
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
	everyworld.humidity = map.humidity;
	everyworld.temperature = map.temperature;

	loadWorld();
}
function moveCamera(direction) {
	var d = directions[direction];

	camera.x += d.x;
	camera.y += d.y;

	drawEWMap();

	addToLog('Moved to '+camera.x+' '+camera.y+' wh '+whatsHere(everyworld.map, camera.x, camera.y));
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
			docerw.style.top = (h * theight)+'px';

			doc('layer_bottom').appendChild(docert);
			doc('layer_wall').appendChild(docerw);
		}
	}
}
function updateEWMap(x, y) {
	var absx = camera.x - Math.floor(range.x / 2) + x;
	var absy = camera.y - Math.floor(range.y / 2) + y;

	var docert = doc('tile_'+x+'_'+y);
	docert.style.display = 'inline-block';
	var wh = whatsHere(everyworld.map, absx, absy);
	if (wh == undefined) docert.style.display = 'none';
	wh = tileAliases[wh];
	docert.className = 'tile '+wh;
	

	var docerw = doc('wall_'+x+'_'+y);
	docerw.style.display = 'inline-block';
	var wh = whatsHere(everyworld.walls, absx, absy);
	if (wh == undefined) docerw.style.display = 'none';
	wh = tileAliases[wh];
	docerw.className = 'tile '+wh;
}
function getBiome(temperature, humidity) {
	temperature++;
	humidity++; 

	if (!temperature) temperature = 0;
	if (!humidity) humidity = 0;

	var weatherByTemperature = Math.floor(temperature / (2 / terrainGenerator.biomes.length));
	var weatherByHumidity = Math.floor(humidity / (2 / terrainGenerator.biomes[weatherByTemperature].length));

	return {'humidity': weatherByHumidity, 'temperature': weatherByTemperature, 'biome': terrainGenerator.biomes[weatherByTemperature][weatherByHumidity]}
}
function getWeather(x, y) {
	var humidity = everyworld.humidity;
	var temperature = everyworld.temperature;

	var hh = 0;
	var tt = 0;

	if (humidity && humidity[y] && humidity[y][x]) hh = humidity[y][x];
	if (temperature && temperature[y] && temperature[y][x]) tt = temperature[y][x];

	hh++;
	tt++;

	return {'humidity': hh, 'temperature': tt};
}
function whatsHere(array, x, y) {
	if (array == undefined) return;
	if (array[y] == undefined) return;
	if (array[y][x] == undefined) return;
	return array[y][x];
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

	createEWMap();
	drawEWMap();
}

$('body').on('keypress', function(evt) {
    var key = String.fromCharCode(evt.charCode).toLowerCase();

    if (key == 'w') moveCamera(0);
    if (key == 'a') moveCamera(2);
    if (key == 'd') moveCamera(1);
    if (key == 's') moveCamera(3);
});

//Flow
init();