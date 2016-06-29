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
'--- Added loads of (unfinished) stuff.',
];

var MAX_LAYERS = 23;
var TILE_HEIGHT = 60;
var MAP_WIDTH = 23;
var MAP_HEIGHT = 23;

var directionNames = ['north', 'east', 'south', 'west'];
var altDirections = ['south', 'west', 'north', 'east'];

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

var mapTypes = ['first', 'second', 'third', 'resid'];
var sectorMapTypes = [
//Residential
	['res', 'mix'],
//Primary
	['fir'],
//Secondary
	['sec'],
//Teriary
	['thi', 'mix'],
//Transition
	['par', 'wil'],
]

function resetVariables() {
	if (!every) every = {};
	if (!everyman.people) everyman.people = {};
	if (!everyman.peopleList) everyman.peopleList = [];
}
function saveGame() {
	localStorage.setItem('every', JSON.stringify(every));
	notification('Game Saved');
}
function loadGame() {
	var losto = localStorage.getItem('every');
	if (!losto) return;
	every = JSON.parse(losto);
	for (var p in everyman.people) {
		var guy = everyman.people[p];
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
function Person(id, type) {
	this.id = id;

	this.type = type;

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
	this.outlineColor = toHSL(0, 0, 5);
	if (type == 'player') this.outlineColor = toHSL(120, 2, 2);
	if (type == 'monster') this.outlineColor = toHSL(0, 2, 2);

	this.mapID = {'x': 0, 'y': 0};

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
	var isoPos = getIsoTilePosition(size(30, 60), size((guy.x - 1), (guy.y - 3), guy.z));
	var opacity = 0.2;
	if (!isVisible(getActiveMap(), size(guy.x, guy.y, guy.z))) opacity = 1;
	guy.element.innerHTML += '<outline class="guy_layer" style="opacity: '+opacity+'; -webkit-filter: '+guy.outlineColor+'; background: '+getOutline(guy)+'; top: '+isoPos.top+'; left: '+isoPos.left+'"></outline>';
}
function getActiveMap() {
	var pos = player.mapID;
	var map = CITY.map[pos.x][pos.y].map;
	return map;
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
function getOutline(guy) {
	var facing = guy.facing;
	return 'url(img/outline.png) '+getBackgroundPosition(guy, 0, guy.walking);
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
function getPeopleLength() {
	var n = 0;
	for (var e in everyman.people) n++;
	return n;
}
function addPerson(type) {
	var last = getPeopleLength();
	var id = generateID(last, type, 1, 1);

	console.log('Adding person type '+type+' id ('+last+') '+id);

	var p = new Person(id, type);

	console.log('Person '+JSON.stringify(p));
	p.x = rand(0, MAP_WIDTH);
	p.y = rand(0, MAP_HEIGHT);
	console.log('Every people length '+getPeopleLength());
	everyman.people[id] = p;
	everyman.peopleList.push(id);

	console.log('Every people length (after) '+getPeopleLength());
}
function loadv(text, min, max) {
	loading.style.opacity = 0.5;
	loading.innerHTML = text+' '+min+'/'+max+' ('+((min/max) * 100)+'%)';

	setTimeout(function() {
		loading.style.opacity = 0;
	}, 1000);
}

function newLayer(width, height, empty, lay) {
	var layer = [];

	for (var h = 0; h < height; h++) {
		layer[h] = [];
		for (var w = 0; w < width; w++) {
			var toadd = empty;

			if (lay == 1) {
				toadd = 't_grass';
				if ((w >= 10 && w <= 12) || (h >= 10 && h <= 12)) toadd = 't_alley';
				if (w < 5 || w > 17 || h < 5 || h > 17) toadd = 't_road_walk';
				if (w == 1 || w == 21) {
					toadd = 't_road';
				}
				if (h == 1 || h == 21) {
					toadd = 't_road';
				}
				if (w == 0 || w == 22) toadd = 't_road_ns';
				if (h == 0 || h == 22) toadd = 't_road_ew';

				if ((w == 2 || w == 20) && (h < 2 || h > 20)) {
					toadd = 't_cross_ns';
				}
				if ((h == 2 || h == 20) && (w < 2 || w > 20)) {
					toadd = 't_cross_ew';
				}

				if ((w == 0 && h == 0) || (w == 22 && h == 22) || (w == 0 && h == 22) || (w == 22 && h == 0)) toadd = 't_crossroad';
			}


			layer[h][w] = toadd;
		}
	}
	return layer;
}

function newMap(width, height, layers) {
	var tiles = [];
	for (var lay = 0; lay < layers; lay++) {
		var defaultTile = 'tile_empty';
		var laysByLevel = [];
		if (laysByLevel[lay]) defaultTile = laysByLevel[lay];
		tiles[lay] = newLayer(width, height, defaultTile, lay);
	}

	return tiles;
}
function addBuildingHere(slot) {
	var here = getActiveMap();
	var block = size(rand(3, 5), rand(3, 5), rand(5, 20));

	var x = (slot == 1 || slot == 3) ? 13 : 5;
	var y = (slot == 2 || slot == 3) ? 13 : 5;

	placeBuilding(here, size(x, y, 2), block, 'tile_proto');

	displayMap(getActiveMap());
}
function testBuildings() {
	var tiles = DEBUG_MAP;

	placeBuilding(tiles, size(5, 5, 2), size(5, 5, 5), 'tile_proto');
	placeBuilding(tiles, size(13, 5, 2), size(5, 5, 5), 'tile_proto');
	placeBuilding(tiles, size(5, 13, 2), size(5, 5, 5), 'tile_proto');
	placeBuilding(tiles, size(13, 13, 2), size(5, 5, 5), 'tile_proto');

}
var DEBUG_MAP = newMap(MAP_WIDTH, MAP_HEIGHT, MAX_LAYERS);
var CITY = new City();
testBuildings();

var player = new Person(0, 'player');
function movePlayer(direction) {
	moveGuy(player, direction, true);
}
//Map types:
/*
	wild		No city built
	first		Farm, rural area
	second		Industries
	third		Central Business District
	mixed		Offices, shops and apartments
	resid		Single-family housing
	park		Transition between districts
*/
function expandCity(city) {
	var cityMap = city.map;
	var num = rand(0, 3);
	var direction = directionNames[num];
	var altDirection = altDirections[num];

	var width = cityMap.length;
	var height = cityMap[0].length;

	var sector = rand(0, 4);
	var type = read(sectorMapTypes[sector]);
	var dname = newDistrictName();

	if (direction == 'west') {
		var arr = [];
		for (var e in city.map[0]) arr.push(new EmptyMap(type, sector, dname));
		city.map.unshift(arr);
		displaceAllGuys('east');
	}
	if (direction == 'east') {
		var arr = [];
		for (var e in city.map[0]) arr.push(new EmptyMap(type, sector, dname));
		city.map.push(arr);
	}
	if (direction == 'north') {
		for (var e in city.map) city.map[e].unshift(new EmptyMap(type, sector, dname));
		displaceAllGuys('south');
	}
	if (direction == 'south') {
		for (var e in city.map) city.map[e].push(new EmptyMap(type, sector, dname));
	}
	console.log('Expanded '+direction);

	displayMap();
}
function displaceAllGuys(direction) {
	for (var g in everyman.people) {
		var guy = everyman.people[g];
		if (direction == 'north') guy.mapID.y--;
		if (direction == 'south') guy.mapID.y++;
		if (direction == 'east') guy.mapID.x++;
		if (direction == 'west') guy.mapID.x--;
	}
	var guy = player;
	if (direction == 'north') guy.mapID.y--;
	if (direction == 'south') guy.mapID.y++;
	if (direction == 'east') guy.mapID.x++;
	if (direction == 'west') guy.mapID.x--;
}
function drawCityMap(city) {
	var div = '<div class="cityMap">';

	for (var dx in city.map) {
		for (var dy in city.map[0]) {
			var sq = city.map[dx][dy];
			var youAreHere = (player.mapID.x == dx && player.mapID.y == dy) ? 'youAreHere' : '';
			div += '<div title="District '+sq.districtName+""+'0'+""+sq.sector+'-'+sq.type.toUpperCase()+'" class="'+sq.type+' cityMapTile '+youAreHere+'" style="top: '+(parseInt(dy) * 8)+'px; left: '+(parseInt(dx) * 8)+'px"></div>';
		}
		div += '<div class="breaker"></div>';
	}

	div += '</div>';
	return div;
}
function EmptyMap(type, sector, dname) {
	this.type = type;
	this.sector = sector;
	this.districtName = dname;
	this.map = newMap(MAP_WIDTH, MAP_HEIGHT, MAX_LAYERS);
}
function City() {
	this.tier = 0;
	this.population = 0;
	this.map = newCityMap(1, 1);
}
function newDistrictName() {
	return zeroPad(rand(0, Math.pow(36, 5)), 3);
}
function newCityMap(width, height) {
	var map = [];

	for (var w = 0; w < width; w++) {
		map[w] = [];
		for (var h = 0; h < height; h++) {
			map[w][h] = new EmptyMap('res', 0, newDistrictName());
		}
	}

	return map;
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
	var dir = direction;
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

	var wh = whatsHere(getActiveMap(), size(nextx, nexty, guyObject.z));
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
		guyObject.x = 0;
		displaceThere(guyObject, dir);
	}
	if (guyObject.x > maxw) {
		guyObject.x = maxw;
		displaceThere(guyObject, dir);
	}
	if (guyObject.y < 0) {
		guyObject.y = 0;
		displaceThere(guyObject, dir);
	}
	if (guyObject.y > maxh) {
		guyObject.y = maxh;
		displaceThere(guyObject, dir);
	}

	drawPerson(guyObject);
}
function displaceThere(guy, direction) {
	var destination = size(guy.mapID.x, guy.mapID.y);

	if (direction == 'north') destination.y--;
	if (direction == 'south') destination.y++;
	if (direction == 'east') destination.x++;
	if (direction == 'west') destination.x--;

	var exists = (CITY.map[destination.x] && CITY.map[destination.x][destination.y]) ? true : false;
	if (exists) {
		var width = CITY.map[destination.x][destination.y].map.length - 1;

		guy.mapID.x = destination.x;
		guy.mapID.y = destination.y;

		if (direction == 'north') player.y = width;
		if (direction == 'south') player.y = 0;

		if (direction == 'west') player.x = width;
		if (direction == 'east') player.x = 0;
	}

	displayMap();
}
function displayMap(width, height, layers) {
	var tiles = getActiveMap();
	var width = MAP_WIDTH;
	var height = MAP_HEIGHT;
	var layers = MAX_LAYERS;

	gaem.innerHTML = drawLayer(size(width, height, layers), size(30, 60), 'tile tile_road', tiles);

	cMap.innerHTML = drawCityMap(CITY);
}
function displayOverlay() {

}
function getRandomDirection() {
	return read(['north', 'south', 'east', 'west']);
}
function districtString(map) {
	return map.districtName+''+'0'+map.sector+'-'+map.type.toUpperCase();
}
function tickPeople() {
	if (!everyman) return;
	for (var e in everyman.people) {
		if (rand(1,5) == 1) continue;
		var person = everyman.people[e];

		//Move guy
		if (rand(0,1)) moveGuy(person, getRandomDirection());

		if (!person.mapID) person.mapID = {
			'x': 0,
			'y': 0,
		}
		if (person.mapID == player.mapID) {
			if (person.z != 2) person.z = 2;
			drawPerson(person);
		}
	}
	info.innerHTML = 'You are on district '+districtString(CITY.map[player.mapID.x][player.mapID.y]);
}
displayMap(getActiveMap);

drawPerson(player);
$('body').on('keypress', function(evt) {
    var key = String.fromCharCode(evt.charCode).toLowerCase();

    if (key == 'w') movePlayer('north');
    if (key == 'a') movePlayer('west');
    if (key == 'd') movePlayer('east');
    if (key == 's') movePlayer('south');

    if (key == 'x') {
    	var pos = size(player.x, player.y, player.z);

    	getActiveMap()[pos.z][pos.y][pos.x] = 'tile_road';
    	displayMap();
    }
});

var everyman = {};
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