var changelog = [
'-- Alpha',
'--- Isometric engine: Added buildings',
'---- The spritesheet for a building should have 9 tiles for roof, 5 for sides and 5 for bottom layer.',
'---- Added decoration for buildings, 8 special tiles with 8 roof decorations, 4 side deco and 4 floor deco.',
'---- The special decoration for doors only appears in the middle of the building floor.',
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

	placeBuilding(tiles, size(1, 1, 2), size(5, rand(4, 6), rand(4, 20)), 'tile_proto');
	placeBuilding(tiles, size(8, 1, 2), size(5, rand(4, 6), rand(4, 20)), 'tile_proto');
	placeBuilding(tiles, size(15, 1, 2), size(5, rand(4, 6), rand(4, 20)), 'tile_proto');

	placeBuilding(tiles, size(1, 9, 2), size(5, rand(4, 6), rand(4, 20)), 'tile_proto');

	placeBuilding(tiles, size(15, 9, 2), size(5, rand(4, 6), rand(4, 20)), 'tile_proto');

	placeBuilding(tiles, size(1, 17, 2), size(5, rand(4, 6), rand(4, 20)), 'tile_proto');
	placeBuilding(tiles, size(8, 17, 2), size(5, rand(4, 6), rand(4, 20)), 'tile_proto');
	placeBuilding(tiles, size(15, 17, 2), size(5, rand(4, 6), rand(4, 20)), 'tile_proto');

	return tiles;
}
var DEBUG_MAP = newMap(22, 24, 24);
function displayMap(width, height, layers) {
	var tiles = DEBUG_MAP;
	var width = 22;
	var height = 24;
	var layers = 24;

	gaem.innerHTML = drawLayer(size(width, height, layers), size(30, 60), 'tile tile_road', tiles);
}
displayMap(DEBUG_MAP);

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