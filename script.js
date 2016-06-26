var changelog = [
'-- Alpha',
'--- Isometric engine: Added buildings',
'---- The spritesheet for a building should have 9 tiles for roof, 5 for sides and 5 for bottom layer.',
'---- Added decoration for buildings, 8 special tiles with 8 roof decorations, 4 side deco and 4 floor deco.',
'---- The special decoration for doors only appears in the middle of the building floor.',
'----- WTH',
'--- Added people and the player.',
'--- You can control the player using WASD. The top right corner represents "North".',
'--- Added clothes, skin tones and hair. Each of them is colored at random at first.',
];

var MAX_LAYERS = 24;
var TILE_HEIGHT = 60;
var MAP_WIDTH = 30;
var MAP_HEIGHT = 24;

var directionNames = ['north', 'east', 'south', 'west'];

var skinTones = [
	toHSL(0, 1, 1.5),
	toHSL(0, 1.2, 1.4),
	toHSL(0, 1, 1.3),
	toHSL(0, 0.8, 1.2),
	toHSL(0, 1, 1.1),
	toHSL(0, 1, 1),
	toHSL(0, 1, 0.9),
	toHSL(0, 1, 0.8),
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
	for (var p in every.people) {
		var guy = every.people[p];
		makeHolder(guy);
		drawPerson(guy);
	}

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

	this.x = 22;
	this.y = 22;
	this.z = 2;
	this.facing = 0;
	this.walking = false;
	this.skinTone = read(skinTones);
	this.clothes = rand(1, 2);
	this.clothColor = toHSL(rand(0, 360), 1.25, 1.5);

	this.hair = rand(0, 1);
	this.hairColor = toHSL(rand(0, 360), red(1, 1.25), (rand(5, 15) / 10));

	this.mapID = 0;

	makeHolder(this);
}
function makeHolder(guy) {
	guy.element = document.createElement('person_holder');
	guy.element.style.top = (TILE_HEIGHT * (MAX_LAYERS / 8))+'px';
	document.body.appendChild(guy.element);
}
function drawPerson(guy) {
	if (!guy.element) {
		makeHolder(guy);
	}
	if (!guy.facing) guy.facing = 0;
	guy.element.innerHTML = drawTile('tile whatever', size(30, 60), size((guy.x + 1), (guy.y - 1)), guy.z, drawGuy(guy));
}
function toHSL(hue, sat, lig) {
	return 'hue-rotate('+hue+'deg) saturate('+sat+') brightness('+lig+')';
}
function getBackgroundPosition(guy, start, walking) {
	var facing = guy.facing;
	var x = 0;
	var y = 0;

	var directions = [-120, -60, 0, -180];

	if (walking) start -= 30;

	return start+'px '+directions[facing]+'px';
}
function getSkin(guy) {
	var facing = guy.facing;
	return 'url(img/skin.png) '+getBackgroundPosition(guy, 0, guy.walking);
}
function getClothes(guy) {
	var facing = guy.facing;
	var cloth = guy.clothes;
	cloth = cloth * -60;
	return 'url(img/clothes.png) '+getBackgroundPosition(guy, cloth, guy.walking);
}
function getHair(guy) {
	var facing = guy.facing;
	var hair = guy.hair;
	hair = hair * -60;
	return 'url(img/hair.png) '+getBackgroundPosition(guy, hair, guy.walking);
}
function drawGuy(guy) {
	var walking = (guy.walking) ? 'walking_'+guy.facing : '';
	var isMyGuy = (guy == player) ? 'myGuy' : '';
	var g = '<div>';
	//Skin
	g += '<div class="guy_layer '+walking+' '+isMyGuy+'" style="background: '+getSkin(guy)+'; -webkit-filter: '+guy.skinTone+'"></div>';

	//Clothes
	g += '<div class="guy_layer" style="background: '+getClothes(guy)+'; -webkit-filter: '+guy.clothColor+'"></div>';

	//Hair
	g += '<div class="guy_layer" style="background: '+getHair(guy)+'; -webkit-filter: '+guy.hairColor+'"></div>';

	g += '</div>';
	return g;
}
function addPerson(type) {
	var last = every.peopleList.length;
	var id = generateID(last, type, 1, 1);



	var p = new Person(id);
	p.x = rand(0, MAP_WIDTH);
	p.y = rand(0, MAP_HEIGHT);
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
		if (laysByLevel[lay]) defaultTile = laysByLevel[lay];
		tiles[lay] = newLayer(width, height, defaultTile);
	}

	return tiles;
}
function testBuildings() {
	var tiles = DEBUG_MAP;

	placeBuilding(tiles, size(1, 1, 2), size(5, rand(4, 6), rand(4, 10)), 'tile_proto');
	placeBuilding(tiles, size(15, 1, 2), size(5, rand(4, 6), rand(4, 10)), 'tile_proto');

	placeBuilding(tiles, size(1, 9, 2), size(5, rand(4, 6), rand(4, 10)), 'tile_proto');
	placeBuilding(tiles, size(15, 9, 2), size(5, rand(4, 6), rand(4, 10)), 'tile_proto');

	placeBuilding(tiles, size(1, 17, 2), size(5, rand(4, 6), rand(4, 10)), 'tile_proto');
	placeBuilding(tiles, size(15, 17, 2), size(5, rand(4, 6), rand(4, 10)), 'tile_proto');
}
var DEBUG_MAP = newMap(MAP_WIDTH, MAP_HEIGHT, MAX_LAYERS);
testBuildings();

var player = new Person();
function movePlayer(direction) {
	moveGuy(player, direction, true);
}
function whatsHere(array, pos) {
	if (array[pos.z]) {
		if (array[pos.z][pos.y]) {
			var hier = array[pos.z][pos.y][pos.x]
			if (hier) {
				if (hier == 'tile_empty' || hier == 'tile tile_empty') return false;
				return hier;
			}
		}
	}
	return false;
}
function moveGuy(guyObject, direction, isPlayer) {
	if (!direction) direction = 'north';
	var directions = {
		'north': size(0, -1),
		'south': size(0, 1),
		'east': size(1, 0),
		'west': size(-1, 0),
	}
	var directionID = directionNames.indexOf(direction);
	guyObject.facing = directionID;

	direction = directions[direction];

	var nextx = guyObject.x + direction.x;
	var nexty = guyObject.y + direction.y;

	var wh = whatsHere(DEBUG_MAP, size(nextx, nexty, guyObject.z));
	if (wh) return;


	guyObject.x += direction.x;
	guyObject.y += direction.y;

	guyObject.walking = true;
	setTimeout(function() {
		guyObject.walking = false;
		drawPerson(guyObject);
	}, 100);

	var maxw = MAP_WIDTH - 1;
	var maxh = MAP_HEIGHT - 1;

	if (guyObject.x < 0) {
		console.log('Guy reached x inner boundary.');
		guyObject.x = 0;
	}
	if (guyObject.x >= maxw) {
		console.log('Guy reached x outer boundary.');
		guyObject.x = maxw;
	}
	if (guyObject.y < 0) {
		console.log('Guy reached y inner boundary.');
		guyObject.y = 0;
	}
	if (guyObject.y >= maxh) {
		console.log('Guy reached y outer boundary.');
		guyObject.y = maxh;
	}

	drawPerson(guyObject);
}
function displayMap(width, height, layers) {
	var tiles = DEBUG_MAP;
	var width = MAP_WIDTH;
	var height = MAP_HEIGHT;
	var layers = MAX_LAYERS;

	gaem.innerHTML = drawLayer(size(width, height, layers), size(30, 60), 'tile tile_road', tiles);
}
function displayOverlay() {

}
function getRandomDirection() {
	return read(['north', 'south', 'east', 'west']);
}
function tickPeople() {
	for (var e in every.people) {
		if (rand(1,5) == 1) continue;
		var person = every.people[e];

		//Move guy
		if (rand(0,1)) moveGuy(person, getRandomDirection());

		if (!person.mapID) person.mapID = 0;
		if (person.mapID == player.mapID) {
			if (person.z != 2) person.z = 2;
			drawPerson(person);
		}
	}
}
displayMap(DEBUG_MAP);

drawPerson(player);
$('body').on('keypress', function(evt) {
    var key = String.fromCharCode(evt.charCode).toLowerCase();

    if (key == 'w') movePlayer('north');
    if (key == 'a') movePlayer('west');
    if (key == 'd') movePlayer('east');
    if (key == 's') movePlayer('south');

    if (key == 'x') {
    	var pos = size(player.x, player.y, player.z);

    	DEBUG_MAP[pos.z][pos.y][pos.x] = 'tile_road';
    	displayMap();
    }
});

var every = {};
var gameInfo = {
	'name': 'Everyman',
	'version': changes(changelog).latestVersion,
	'changelog': changes(changelog).changelog,
}
setInterval(tickPeople, 500);
loadGame();
resetVariables();
update();
var t = setInterval(saveGame, 60000);