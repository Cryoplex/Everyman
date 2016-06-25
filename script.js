var changelog = [
'-- Alpha',
];

function resetVariables() {
	if (!every) every = {};
	if (!every.people) every.people = {};
	if (!every.peopleList) every.peopleList = [];
}
function saveGame() {
	localStorage.setItem('every', JSON.stringify(every));
	notification('Game Saved');
}
function loadGame() {
	var losto = localStorage.getItem('every');
	if (!losto) return;
	every = JSON.parse(losto);
	notification('Game Loaded');
}
function update(step) {
	document.title = gameInfo.name+' '+gameInfo.version;
}
function zeroPad(number, fixed) {
	if (!number) number = 0;
	number = number % Math.pow(36, fixed);

	number = number.toString(36).toUpperCase();
	while (number.length < fixed) number = '0'+number;
	return number;
}
function generateID(last, type, zoneX, zoneY) {
	var newID = '';
	if (!zoneX) zoneX = 0;
	if (!zoneY) zoneY = 0;
	if (!type) type = 'default';
	if (!last) last = 0;

	var let = {
		'npc': 'N',
		'player': 'P',
		'default': 'U',
	}[type];

	newID = let + '-' + zeroPad(zoneX, 2) + zeroPad(zoneY, 2) + '-' + zeroPad(last, 9) + zeroPad(rand(1, 1296), 1);

	return newID;

}
function Person(id) {
	this.id = id;
}
function addPerson(type) {
	var last = every.peopleList.length;
	var id = generateID(last, type, 1, 1);



	var p = new Person(id);
	every.people[id] = p;
	every.peopleList.push(id);
}
function loadv(text, min, max) {
	loading.style.opacity = 0.5;
	loading.innerHTML = text+' '+min+'/'+max+' ('+((min/max) * 100)+'%)';

	setTimeout(function() {
		loading.style.opacity = 0;
	}, 1000);
}

function newLayer(width, height, empty) {
	var layer = [];

	for (var h = 0; h < height; h++) {
		layer[h] = [];
		for (var w = 0; w < width; w++) {
			layer[h][w] = empty;
		}
	}
	return layer;
}

function newMap(width, height, layers) {
	var tiles = [];
	for (var lay = 0; lay < layers; lay++) {
		var defaultTile = 'tile_empty';
		var laysByLevel = ['tile_stone', 'tile_grass'];
		if (laysByLevel[lay]) defaultTile = laysByLevel[lay]
		tiles[lay] = newLayer(width, height, defaultTile);
	}

	//People test
	do {
		tiles[2][rand(0, width)][rand(0, height)] = 'tile_someguy';
	}
	while (rand(0, 10));

	//Building test
	do {
		var sz = 2;
		var sx = rand(3, 10);
		var sy = rand(3, 10);

		var mxz = rand(5, 22) + sz;
		var mxx = rand(5, 8) + sx;
		var mxy = rand(5, 8) + sy;
		for (var zz = sz; zz < mxz; zz++) {
			for (var xx = sx; xx < mxx; xx++) {
				for (var yy = sy; yy < mxy; yy++) {
					tiles[zz][yy][xx] = 'tile_building2';
					if (zz > 3) tiles[zz][yy][xx] = 'tile_window';

				}
			}
		}
	}
	while (rand(0,1));

	return tiles;
}
var DEBUG_MAP = newMap(22, 24, 24);
function moveGuys(map) {
	var z = 2;
	for (var y in map[z]) for (var x in map[z][y]) {
		var mappy = map[z][y][x];
		if (mappy == 'tile_someguy') {
			console.log('Is a guy!');
			var movex = parseInt(x) + rand(-1, 1);
			var movey = parseInt(y) + rand(-1, 1);
			if (map[z][movey] && map[z][movey][movex]) {
				map[z][y][x] = 'tile_empty';
				map[z][movey][movex] = 'tile_someguy';
			}
		}
	}

	displayMap();
}
function displayMap(width, height, layers) {
	var tiles = DEBUG_MAP;
	var width = 22;
	var height = 24;
	var layers = 24;

	gaem.innerHTML = drawLayer(size(width, height, layers), size(30, 60), 'tile tile_road', tiles);
}
displayMap(DEBUG_MAP);
setInterval(function() {
	moveGuys(DEBUG_MAP)
}, 1500);

var every = {};
var gameInfo = {
	'name': 'Everyman',
	'version': changes(changelog).latestVersion,
	'changelog': changes(changelog).changelog,
}
loadGame();
resetVariables();
update();
var t = setInterval(saveGame, 60000);