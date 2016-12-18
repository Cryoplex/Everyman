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
'ab Fixed a buggy bug with loading the game',
'af Added lost items. Spawned each hour in the ground. Press SPACE to collect them.',
'af Added trash bins. They generate random items each hour. Press SPACE to interact with them. You can also throw items inside them.',
'af Buildings now update each day, and city expands each month.',
'af You can now talk to NPCs and even steal them.',
'af Added policemen. They roam the city around. If you do crimes, they will chase you. Once chased, you go into arrest and a fee is deducted from your account.',
'ax NPC now go to "work" and make money. They disappear in the meantime.',
'ax NPC now sleep when tired, restoring energy. Player can sleep in a bed too, to retore energy and make time pass fast.',
'ax NPC now have age. NPC aged 18+ can work. Their birthday is 1 Spring each year.',
'ax Changed building size and road-walk width. Fixed NPC pathfinding when outside of the road-walk.',
'ab Fixed lag spikes caused by the new NPC walking AI.',
'ab Fixed NPC getting stuck in trash bins.',
'ax Tileset now changes color at dawn (5-6 AM), day (7-5 AM/PM), dusk (6-7 PM) night (8-11 PM and 12-4 AM)',
'ax NPC now marry with different gender NPC randomly. Only if they are 18+, they share a common family name.',
'ax NPC now randomly eat stuff in order to survive, they use the money they have to eat it.',
'ax NPC now have children randomly, they hatch in 9 months',
'ax Increased performance. A fucking lot. Moving from one map to another is fast af now.',
'ab Fixed a bug causing items to become useless by players.',
'ax You can use items that restore health etc only when they will make an effect on you.',
'ax NPCs now only turn into interns after dying for whatever reason (there is a 50% chance of this happening each comma, so they have 3 chances of being intern before actually dying)',
'ax Added wanted levels. Shown in the right stat HUD',
'ax Slave jobs renamed to community jobs.',
'ab Fixed how cities are expanded upon city creation.',
'af Added the hospital. You can enter comma or faint if your health/energy is low. After comma, you can prevent death up to 3 times.',
'ax Fixed a lot of performance issues',
'af You can now attack other NPCs, you can get arrested for doing so, with high, lifetime, fees.',
'ax Some changes in the HUD',
'ab Fixed many bugs',
'ax Pressing F you can see your family, also the deceased ones.',
'ax Using a sink increases your Hygiene stat.',
'af Added Karma. Karma is increased by talking with NPCs and recycling. Karma is reduced by damaging other npcs, stealing and commiting crimes.',
'ax Drugs are checked only if there is a policeman nearby, and upon arrest of the player.',
'ab Fixed NPC sleeping almost forever due to a wrong calculation',
'ax Added a new meter that shows your current wanted level and how it decreases over time.',
'ab Fixed a bug causing the player to become invisible if you were working or sleeping and refreshed the page.',
'ax Changed Illegal Jobs crime to Laundered Money. Triggered once you get a paycheck at an illegal job.',
'ax Jobs now only drops output items, not shop/input items.',
'ax Now you can buy items from drug dealers',
'ax Reduced NPC price per kill',
'ax You now get good karma for throwing drugs into a trash bin, and for killing drug dealers.',
'ab Fixed Karma decreased by non-effective "Resistance to Authority" crime triggers.',
'af Added stats. Physical, Psychological and Social. You can see your stats pressing E. You can see other NPC stats if your friendship is high enough.',
];

var MAX_LAYERS = 5;
var TILE_HEIGHT = 48;
var MAP_WIDTH = 23;
var MAP_HEIGHT = 23;
var BASE_HOUSE_VALUE = 100000;
var ENTRY_PRICE_MOD = 1.5;
var MAX_NPC = 100;
var VISION_RANGE_X = 8;
var VISION_RANGE_Y = 5;

var TICK_PEOPLE_INTERVAL = 150;

var wantedOfficers = {};
var policemenCount = 0;
var activePolicemen = [];

var YEAR_MONTHS = 4;
var MONTH_DAYS = 20;

var ticker = 0;
var totalticker = 0;

var lastDrops = [];

var moneyticker = 0;

var lastlog = [];

var directionNames = ['north', 'east', 'south', 'west'];
var altDirections = ['south', 'west', 'north', 'east'];

var wantedLevels = [
'Clean',
'Mischievous Kid',
'Delinquent',
'Rebel',
'Criminal',
'Outlaw',
'Terrorist',
'Public Enemy',
'Serial Killer',
'Most Wanted',
'Worldwide Criminal',
];

var music = {
	'fir': {
		'day': {
			'outside': new Audio('music/fir_day_outside.mp3'),
		},
		'night': {
			'outside': new Audio('music/fir_night_outside.mp3'),
		},
	},
	'sec': {
		'day': {
			'outside': new Audio('music/slum_day_outside.mp3'),
		},
		'night': {
			'outside': new Audio('music/sec_night_outside.mp3'),
		},
	},
	'thi': {
		'day': {
			'outside': new Audio('music/thi_day_outside.mp3'),
		},
		'night': {
			'outside': new Audio('music/thi_night_outside.mp3'),
		},
	},
	'res': {
		'day': {
			'outside': new Audio('music/res_day_outside.mp3'),
		},
		'night': {
			'outside': new Audio('music/res_night_outside.mp3'),
		},
	},

	'par': {},
	'mix': {},
	'slum': {},
	'wil': {},
};
music.par = music.res;
music.mix = music.thi;
music.slum = music.sec;
music.wil = music.fir;

var lastplayed;

//TODO - Dentro del juego, poder crear trabajos, al crear una nueva empresa, crear un nuevo trabajo, con su nombre, sector y drops
var jobList = {
	'fir': [
	//Primary sector jobs have no input. They generate items by workforce at a rate of 2 items per worker per hour.
	{'name': 'Farmer', 'output': [1, 7, 10, 11, 14, 15]},
	],

	'sec': [
	//Secondary sector jobs take one or various items as input, and generate output items at a rate of 2 items/worker/hour.
	{'name': 'Food Processor', 'input': [1, 7, 15], 'output': [2, 8, 16]},
	{'name': 'Tomato Pharmacologist', 'input': [2, 1], 'output': [5, 6]},
	{'name': 'Baker', 'input': [8], 'output': [9]},
	{'name': 'Hamburger Chef', 'input': [1, 2, 9, 10, 11, 14], 'output': [12, 13]},
	],

	'thi': [
	//Tertiary sector jobs take a list of items from the warehouse and sell them in a shop.
	{'name': 'Shopkeeper', 'shop': [1, 2, 5, 6, 9, 12, 13, 16]},
	],

	'com': [
	//Community jobs take no items and generate no items. Jobs such as policeman are community jobs. They were called 'slave' before.
	{'name': 'Policeman'},
	],

	'slum': [
	//Slum sector jobs may take items as input, may output items and also may sell them. Slum jobs are illegal and you risk a 1% chance each hour of work of being sent to jail.
	{'name': 'Ketchupaine Brewer', 'input': [2], 'output': [3], 'shop': [3, 5]},
	],
};

var technology = {
	'0': {'name': 'Prehistory', 'job': [{'sector': 'fir', 'id': 0}]},
}


var staticPlaces = {
	'dream': new Inside('dream'),
	'hospital': new Inside('hospital'),
	'jail': new Inside('jail'),
}

var everyman, city, player, furtuto;
var world;

//TODO Dentro del juego, poder construir objetos, dedicándose a la investigación. Crear objetos con su nombre, descripción, propiedades, etc, guardar todos esos objetos en una variable "extra items" que se añadirá a la lista actual al cargar el juego
var itemList = [
	//Every item must be obtainable.
	new Item(0, {'test': true}), //Default item
	new Item(1, {'name': 'Tomato', 'desc': 'Edible. Harvested by farmers.', 'food': true, 'hunger': 5, 'price': 1}), //Harvested by farmers
	new Item(2, {'name': 'Ketchup', 'desc': 'Edible. Made with real tomatoes.', 'food': true, 'hunger': 1, 'price': 2, 'byproduct': 4}), //Made by ketchup makers
	new Item(3, {'name': 'Ketchupaine', 'desc': 'Drug. Increases energy and reduces health.', 'drug': true, 'health': -5, 'energy': 10, 'illegal': true, 'price': 10}), //Made by ketchupaine brewers
	new Item(4, {'name': 'Ketchup Wrapper', 'desc': 'Trash item result after eating Ketchup.', 'tile': 2, 'price': 0.05}), //Produced after consuming Ketchup
	new Item(5, {'name': 'Acetiltomatylic Acid', 'desc': 'Medicine made with Tomatoes used to treat pain.', 'food': true, 'health': 10, 'energy': -1, 'price': 25}),
	new Item(6, {'name': 'Tomatine Shot', 'desc': 'Energy drunk that restores your hunger and energy.', 'food': true, 'hunger': 2, 'energy': 5, 'price': 8}),
	new Item(7, {'name': 'Wheat', 'desc': 'Harvested in farms. Used to make bread.', 'price': 1}),
	new Item(8, {'name': 'Flour', 'desc': 'Crushed wheat. Used to make bread.', 'food': true, 'hunger': 1, 'price': 2}),
	new Item(9, {'name': 'Bread', 'desc': 'Tasty Bread. Restores hunger.', 'food': true, 'hunger': 8, 'price': 8}),
	new Item(10, {'name': 'Onion', 'desc': 'Ew, onions.', 'food': true, 'hunger': 2, 'price': 4}),
	new Item(11, {'name': 'Lettuce', 'desc': 'Harvested in farms. Well, you can eat this raw if you want.', 'food': true, 'hunger': 1, 'price': 2}),
	new Item(12, {'name': 'Hamburger (Vegetarian)', 'desc': 'Made with tomato, onion, lettuce and bread.', 'food': true, 'hunger': 20, 'price': 20}),
	new Item(13, {'name': 'Hamburger (Meat)', 'desc': 'Hamburger with steak and ketchup.', 'food': true, 'hunger': 30, 'price': 32}),
	new Item(14, {'name': 'Steak', 'desc': 'Edible. Harvested by farmers.', 'food': true, 'hunger': 10, 'price': 12}),

	new Item(15, {'name': 'Coffee Powder', 'desc': 'Harvested by farmers', 'food': true, 'hunger': 1, 'price': 3}),
	new Item(16, {'name': 'Coffee', 'desc': 'Made with Coffee Powder lol', 'food': true, 'hunger': 3, 'energy': 15, 'price': 20}),
];

var crimes = [
	{'name': 'Assault and theft', 'tier': 5},
	{'name': 'In-shop theft', 'tier': 4},
	{'name': 'Theft attempt', 'tier': 3},

	{'name': 'Income from laundered money', 'tier': 1},
	{'name': 'Drug possesion', 'tier': 3},

	{'name': 'Illegal item possesion', 'tier': 2},

	{'name': 'Resistance to authority', 'tier': 1},

	{'name': 'Threatening', 'tier': 4},
	{'name': 'Violence against Others', 'tier': 5},
	{'name': 'Murder', 'tier': 6},

	{'name': 'Violence against Police', 'tier': 7},
	{'name': 'Murder of a Policeman', 'tier': 8},

	{'name': 'Violence against minors', 'tier': 9},
	{'name': 'Murder of a minor', 'tier': 10},

	{'name': 'Bounty Hunting', 'tier': -2},
	{'name': 'Self Defense', 'tier': -1},
];
var furniturePrices = {
	'tile_closet': 180,
	'tile_table': 50,
	'tile_sink': 250,
	'tile_sink2': 250,
	'tile_toilet': 400,
	'tile_cabinet': 180,
	'tile_fridge': 400,
	'tile_cooker': 680,
	'tile_woodwall': 5,
	'tile_hidden': 5,
	'tile_bin': 40,

	'buildg': 1,
	'tile_bin2': 1,
}
var furnitureNames = {
	'tile_closet': 'Closet', 'tile_table': 'Table', 'tile_sink': 'Sink', 'tile_sink2': 'Sink', 'tile_toilet': 'Toilet', 'tile_cabinet': 'Cabinet', 'tile_fridge': 'Fridge', 'tile_cooker': 'Oven',
	'tile_woodwall': 'Wood Wall',
	'tile_hidden': 'Stone Wall',
	'tile_bin': 'Trash Bin',

	'buildg': 'test',
	'tile_bin2': 'buy',
}
var furnitureStatus = {
	'tile_hidden': 'build',
	'tile_woodwall': 'build',

	'tile_closet': 'buy',
	'tile_table': 'buy',
	'tile_sink': 'buy',
	'tile_sink2': 'buy',
	'tile_toilet': 'buy',
	'tile_fridge': 'buy',
	'tile_cabinet': 'buy',
	'tile_cooker': 'buy',
	'tile_bin': 'buy',

	'buildg': 'buy',
	'tile_bin2': 'buy',
}
var NPCTurns = [];
var CarTurns = [];

var skinTones = [
	toHSL(0, 1, 1.5),
	/*
	toHSL(0, 1.2, 1.4),
	toHSL(0, 1, 1.3),
	toHSL(0, 0.8, 1.2),
	toHSL(0, 1, 1.1),
	toHSL(0, 1, 1),
	toHSL(0, 1, 0.9),
	toHSL(0, 1, 0.8),
	*/
];

var mapTypes = ['first', 'second', 'third', 'resid'];
var sectorMapTypes = [
//Residential
	['res', 'mix', 'slum'],
//Primary
	['fir'],
//Secondary
	['sec'],
//Teriary
	['thi', 'mix'],
//Transition
	['par', 'wil'],
];

function displayDrops() {
	var dd = '<b>Last Drops</b><br>';
	for (var e in lastDrops) {
		if (itemList[e] && itemList[e].name) dd += lastDrops[e]+' x '+itemList[e].name+'<br>';
	}
	return dd;
}

function resetVariables() {
	if (!player) player = new Person(0, 'player');
	if (!everyman) everyman = {};

	if (everyman.time == undefined) {
		everyman.time = {
			'hours': 0, 'minutes': 0, 'day': 1, 'month': 1, 'year': 1970,
		}
	}

	if (!everyman.people) everyman.people = {};
	if (!everyman.peopleList) everyman.peopleList = [];

	if (!everyman.warehouse) everyman.warehouse = [];
	if (!everyman.interns) everyman.interns = {
		'fir': [], 'sec': [], 'thi': [], 'com': [], 'slum': []
	};

	if (!city) {
		city = new City();
		while (!getZonesByType(city)) expandCity(city, true);
		buildCity(city);
	}
	if (!world) {
		world = new EmptyMap('wil', 4, 'world');
		city.map[0][0] = world;
	}
	NPCTurns = canAnNPCWalk(0, 0, 1);
	CarTurns = canAnNPCWalk(0, 0, 1, 1);
}
function addToLog(text) {
	lastlog.push(text);
	if (lastlog.length > 10) lastlog.splice(0, 1);

	debug_interns.innerHTML = lastlog.join('<br>');
}
function afterLoad() {
	everyman.peopleList = [];
	for (var p in everyman.people) {
		var guy = everyman.people[p];
		guy.id = p;
		makeHolder(guy);
		drawPerson(guy);
		everyman.peopleList.push(p);
	}
	player.working = false;
	player.sleeping = false;
	player.hold = false,

	makeHolder(player);
	drawPerson(player);
}
function battle(guy)  {
	$('#battle_blocker').fadeIn(1000);
	$('#battle').fadeIn(2000);
}
function drawWarehouse() {
	var wh = '<br><b>Items in City Warehouse</b><br>';
	for (var e in everyman.warehouse) {
		var id = e;
		if (everyman.warehouse[id] >= 1) {
			var qty = everyman.warehouse[id];
			var name = itemList[id].name;
			wh += qty+'x'+name+'<br>';
		}
	}
	debug_warehouse.innerHTML = wh;
}
function makeIntern(id) {
	var guy = everyman.people[id];
	if (guy == undefined) return;
	if (guy.type == 'police' || guy.type == 'police_extra') return;
	if (guy.job == undefined) guy.job = new Job(guy.mapID.x, guy.mapID.y);
	var randomSector = guy.job.type;
	var r = guy.job.id;

	if (everyman.interns[randomSector][r] == undefined) everyman.interns[randomSector][r] = 0;
	everyman.interns[randomSector][r]++;
	killPerson(id, 'sold their soul');
}
function isEmpty(arr) {
	for (var e in arr) if (arr[e]) return false;
	return true;
}
function saveGame() {
	localStorage.setItem('everymanPlayer', tcompress(player));
	localStorage.setItem('everyman', tcompress(everyman));
	localStorage.setItem('everymanCity', tcompress(city));
}
function Item(id, config) {
	this.name;
	this.price = 0;
	this.food = false;
	this.id = id;

	for (var e in config) {
		this[e] = config[e];
	}
}
function resetGame() {
	localStorage.removeItem('everyman');
	localStorage.removeItem('everymanPlayer');
	localStorage.removeItem('everymanCity');
	window.location = window.location;
}
function loadGame() {
	var losto = localStorage.getItem('everyman');
	if (losto) {
		everyman = tdecompress(losto);
	}

	var losto = localStorage.getItem('everymanPlayer');
	if (losto) {
		player = tdecompress(losto);
	}

	var losto = localStorage.getItem('everymanCity');
	if (losto) {
		city = tdecompress(losto);
	}
}
function update(step) {
	document.title = gameInfo.name+' '+gameInfo.version;

	updateInterns();
}
function zeroPad(number, fixed, dec, trim) {
	if (!number) number = 0;
	if (trim) number = Math.floor(number)
	var base = (dec) ? 10 : 36;
	number = number % Math.pow(10, fixed);


	number = number.toString(10).toUpperCase();
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
		'car': 'C',
	}[type];

	newID = let + '-' + zeroPad(last, 3) + zeroPad(rand(1, 1296), 1);

	return newID;

}
function isCriminal(guy) {
	if (guy.crime == undefined) guy.crime = [];
	var level = 0;
	for (var c in guy.crime) level += guy.crime[c];
	return level;
}
function Person(id, type, isCar) {
	this.id = id;

	this.type = type;

	this.x = 0;
	this.y = 0;
	this.z = 2;
	this.facing = rand(0,3);
	this.walking = false;
	this.sleeping = false;

	this.age = rand(10,50);
	if (type == 'player') this.age = 25;

	this.homes = [];

	this.health = 100; //If it reaches 0, this person dies
	this.hunger = 100; //If it reaches 0, drains hunger
	this.energy = 100; //If it reaches 0, forces sleep and disables movement
	this.hygiene = 100; //Reduced by dirty actions

	this.healthx = 100;
	this.hungerx = 100;
	this.energyx = 100;
	this.hygienex = 100;

	//Stats: Stats are divided into Physical, Psychological, and Social.
	//Physical Stats: Influence the outcome of combat
	this.strength = Math.random();      //Increases damage caused in combat
	this.endurance = Math.random();     //Decreases damage received in combat

	//Psychological Stats: Influence your skills and yourself
	this.intelligence = Math.random();   //Increases the speed at which you learn
	this.luck = Math.random();           //Increases chances of good stuff happening, including dodge chances and critical chances

	//Social Stats: Influence your behavior with other NPC
	this.charisma = Math.random();        //Increases friendship with NPCs
	this.frugality = Math.random();       //Changes prices at shops

	this.totalStats = getTotalStats(this);



	this.deathStrikes = 0; //You can prevent death 3 times before actually dying

	this.crime = [];

	this.friendship = 0;

	this.lastMove = 0;


	this.money = (type == 'player') ? 3000 : round(300*Math.random());

	this.gender = rand(0,1);

	this.name = 'Random Guy';
	if (this.gender == 1) this.name = getFemaleName();
	if (this.gender == 0) this.name = getMaleName();
	var name = this.name.split(' ');
	this.name = name[0];
	this.family = name[1];

	this.sterile = false;
	this.pregnant = false;
	this.pregnantTime = 0;

	this.marry;

	this.variation = rand(0,1);
	if (isCar) {
		this.gender = 0;
		this.variation = 'car_0';
		this.name = zeroPad(rand(0, 99999), 5, 1);
	}

	this.mapID = {'x': 2, 'y': 2};

	this.karma = 0;
}
function getStat(guy, stat) {
	console.log('getStat', stat, 'from', guy);
	var agedist = Math.abs(guy.age - 25);
	console.log('age distance is', agedist);
	var agemod = Math.pow(1.05, -agedist);
	console.log('age mod is', agemod);

	if (!guy.totalStats) guy.totalStats = getTotalStats(guy);
	var statpercent = guy[stat] / guy.totalStats;
	console.log('stat value is', guy[stat], 'stat percent is', (statpercent * 100), '% from total stats', guy.totalStats);

	var v = round(100 * statpercent * agemod);

	console.log('calculated stat is', v);

	return v;
}
function changeStat(guy, stat, amt) {
	guy[stat] += amt;
	guy.totalStats = getTotalStats(guy);
}
function getTotalStats(guy) {
	var stats = ['strength', 'endurance', 'agility', 'intelligence', 'frugality', 'luck', 'charisma', 'popularity', 'deal'];
	var v = 0;
	for (var s in stats) {
		if (guy[stats[s]] == undefined) guy[stats[s]] = Math.random();
		v += guy[stats[s]];
	}
	return v;
}
function lostItem(mapx, mapy) {
	var sp = new SpawnPoint('item');
	var iid = rand(1, itemList.length) - 1;
	if (city.map[mapx][mapy].lostItems == undefined) city.map[mapx][mapy].lostItems = [];
	var litems = city.map[mapx][mapy].lostItems;
	for (var li in litems) {
		if (litems[li].x == sp.x && litems[li].y == sp.y) {
			return;
		}
	}

	city.map[mapx][mapy].lostItems.push({'x': sp.x, 'y': sp.y, 'id': iid});

	if (mapx == player.mapID.x && mapy == player.mapID.y) drawLostItems();
}
function drawLostItems() {
	$('item_holder').each(function() {
		$(this).remove();
	});

	var li = city.map[player.mapID.x][player.mapID.y].lostItems;
	if (li && li.length > 0) {
		for (var it in li) {
			var litem = li[it];
			drawObject(litem.x, litem.y, 'items', getItemTile(litem.id));
		}
	}
}
function onPlayerNotification(text) {
	onCoordinateNotification(player.x, player.y, text);
}
function onCoordinateNotification(x, y, text) {
	//var isoPos = getIsoTilePosition(size(32, 64), size(x-1, y-3, 2));
	var tdPos = {
			'top': (y * 24) - 24,
			'left': x * 24,
	}

	var el = document.createElement('person_holder');
	el.style.width = 'auto';
	el.style.height = 'auto';
	el.className = 'tile whatever';
	el.style.top = (TILE_HEIGHT * (MAX_LAYERS / 8))+'px';

	var tl = (text.length > 50) ? 50 : text.length;
	var wd = (tl * 5);


	el.innerHTML = '<div style="top: '+tdPos.top+'px; left: '+tdPos.left+'px; z-index: 999; width: '+wd+'px" class="coordNotification">'+text+'</div>';
	var time = 100 * text.length;

	document.body.appendChild(el);
	setTimeout(function() {
		document.body.removeChild(el);
	}, time);
}
function drawObject(x, y, tileset, bpos) {
	//var isoPos = getIsoTilePosition(size(32, 64), size(x-1, y-3, 2));
	var tdPos = {
		'top': ((y * 24) - 24)+'px',
		'left': x * 24+'px',
	}

	var el = document.createElement('item_holder');
	el.className = 'tile whatever';
	el.style.top = (TILE_HEIGHT * (MAX_LAYERS / 8))+'px';

	el.style.opacity = (player.insideStatic || player.inside) ? 0 : 1;

	el.innerHTML = '<div style="top: '+tdPos.top+'; left: '+tdPos.left+'; background: url(img/'+tileset+'.png); z-index: '+(x+y)+'; background-position: '+bpos+'; background: '+tileset+'" class="tile collectible"></div>';

	document.body.appendChild(el);
}


function makeHolder(guy) {
	if (!guy.id && guy != player) return;
	guy.element = document.createElement('person_holder');
	guy.element.className = 'tile whatever';
	guy.element.style.top = '0px';

	var n = 'npch_'+guy.id;

	if (!doc(n)) guy.element.appendChild(getInsideHolder(guy));

	if (guy.element.parentNode != document.body) document.body.appendChild(guy.element);
}
function getInsideHolder(guy) {
	//var isoPos = getIsoTilePosition(size(32, 64), size((guy.x - 1), (guy.y - 3), guy.z));

	var tdPos = {
		'top': ((guy.y * 24) - 24)+'px',
		'left': guy.x * 24+'px',
	}


	var gih = document.createElement('div');
	gih.id = 'npch_'+guy.id;
	gih.title = guy.name+' '+guy.family+' '+guy.id;
	gih.className = 'guy_layer';
	gih.style.top = tdPos.top;
	gih.style.left = tdPos.left;
	gih.style.zIndex = 9999;

	gih.innerHTML = drawGuy(guy);

	return gih;
}
function getRelativePos(guy) {
	var relativex = (guy.mapID.x - player.mapID.x) * MAP_WIDTH;
	var relativey = (guy.mapID.y - player.mapID.y) * MAP_HEIGHT;

	relativex += (guy.x);
	relativey += (guy.y);


	return {'x': relativex, 'y': relativey, 'distance': distance(player, guy)};
}
function isGuyVisibleByPlayer(guy) {
	if ((player.inside != guy.inside) || guy.working || guy.sleeping || player.insideStatic != guy.insideStatic) return false;
	if (player.mapID.x != guy.mapID.x || player.mapID.y != guy.mapID.y) return false;
	return true;
}
function drawPerson(guy) {
	if (!guy) return;
	if (!guy.id && guy != player) return;
	if (!guy.element) makeHolder(guy);

	var relpos = getRelativePos(guy);

	var hname = 'npch_'+guy.id;

	if (!isGuyVisibleByPlayer(guy)) {
		guy.element.style.display = 'none';
		if (doc(hname)) doc(hname).style.display = 'none';
		return;
	}
	doc(hname).style.opacity = (!isVisible(getActiveMap(), size(player.x, player.y, player.z))) ? 0.5 : 1;
	if (!guy.facing) guy.facing = 0;

	if (guy.element.style.display != 'inline-block') guy.element.style.display = 'inline-block';
	var opac = 1;
	if (guy.element.style.opacity != opac) guy.element.style.opacity = opac;

	if (doc(hname)) {
		doc(hname).style.display = 'inline-block';
		//var isoPos = getIsoTilePosition(size(30, 60), size((relpos.x - 1), (relpos.y - 3), guy.z));
		var tdPos = {
			'top': ((guy.y - player.y + VISION_RANGE_Y) * 24) - 24,
			'left': (guy.x - player.x + VISION_RANGE_X) * 24,
		}
		if (doc(hname).style.top != tdPos.top) doc(hname).style.top = tdPos.top+'px';
		if (doc(hname).style.left != tdPos.left) doc(hname).style.left = tdPos.left+'px';
	}

	var zindex = 0;
	zindex = (guy.z * 4);

	if (doc(hname).style.zIndex != zindex) doc(hname).style.zIndex = zindex;

	var picname = 'npcpic_'+guy.id;
	if (doc(picname)) {
		var bgpos = getBackgroundPosition(guy, 0, guy.walking);
		if (doc(picname).style.backgroundPosition != bgpos) doc(picname).style.backgroundPosition = bgpos;
	}
}
function editActiveMap(x, y, z, newTile) {
	var pos = player.mapID;
	var mappy = city.map[pos.x][pos.y];
	var map = mappy.map;
	if (player.inside != undefined) {
		map = mappy.inside.map;
	}
	map[z][y][x] = newTile;
	return newTile;
}
function getActiveMap() {
	var pos = player.mapID;
	var mappy = city.map[pos.x][pos.y];
	var map = mappy.map;
	if (player.inside != undefined) {
		map = mappy.inside.map;
	}
	if (map == undefined) map = staticPlaces['dream'].map;
	if (player.insideStatic != undefined) {
		if (staticPlaces[player.insideStatic] == undefined) staticPlaces[player.insideStatic] = new Inside(player.insideStatic);
		map = staticPlaces[player.insideStatic].map;
	}
	return map;
}
function toHSL(hue, sat, lig) {
	return 'hue-rotate('+hue+'deg) saturate('+sat+') brightness('+lig+')';
}
function getBackgroundPosition(guy, start, walking) {
	var facing = guy.facing;
	var x = 0;
	var y = 0;

	var directions = [-96, -48, 0, -144];
	start = -24;
	if (walking) start = 0;

	return start+'px '+directions[facing]+'px';
}
function drawGuy(guy) {
	var walking = (guy.walking) ? 'walking_'+guy.facing : '';
	var isMyGuy = (guy == player) ? 'myGuy' : '';

	if (guy.gender == undefined) guy.gender = rand(0,1);
	if (guy.variation == undefined) guy.variation = rand(0,1);

	var gend = guy.gender;

	if (!guy.job) {
		guy.variation = 'none_0';
	}
	if (guy.age < 18) {
		guy.variation = 'kid_1';
	}
	if (guy.age < 13) {
		guy.variation = 'kid_0';
	}
	if (guy.age > 55) {
		guy.variation = 'oldfart_0';
	}

	if (guy.job && guy.age >= 18 && guy.age < 55) {
		if (guy.job.type == 'fir' || guy.job.type == 'com' || guy.job.type == 'slum') {
			guy.variation = guy.job.type+'_'+guy.job.id;
		}
	}
	if (guy.car || guy.type == 'car') {
		guy.gender = 0;
		guy.variation = 'car_0';
	}
	if (isPolice(guy)) guy.variation = 'com_0';


	//Anatomy of an NPC image



	//var g = '<div class="guy_layer" id="npcpic_'+guy.id+'" style="background: url(img/npc/npc_'+gend+'_'+guy.variation+'.png) '+getBackgroundPosition(guy, 0, guy.walking)+'">';
	var g = '<div class="guy_layer" id="npcpic_'+guy.id+'" style="background: url(img_td/someguy.png) '+getBackgroundPosition(guy, 32, guy.walking)+'">';

	g += '</div>';
	return g;
}
function getPeopleLength() {
	var n = 0;
	for (var e in everyman.people) n++;
	return n;
}
function getStealChance(guy) {
	var base = 0;
	var time = everyman.time.hours + (everyman.time.minutes / 60);
	if (time < 8) base = 90;
	if (time >= 8) base = 50;
	if (time >= 10) base = 30;
	if (time >= 12) base = 10;
	if (time >= 18) base = 70;

	return base;
}
function addCrime(player, c, amt, set) {
	var closepoliceman = isAPolicemanOnSight();
	if (!closepoliceman) return;
	closepoliceman.target = {'x': player.x, 'y': player.y, 'mapID': {'x': player.mapID.x, 'y': player.mapID.y}};
	if (player.crime[c] == undefined) player.crime[c] = 0;
	var crimeStrength = crimes[c].tier;
	if (!set && amt > 0) changeKarma(player, -(crimeStrength/10));
	player.crime[c] += amt;
	if (set) player.crime[c] = amt;
}
function addCar(type, mapx, mapy) {
	//TODO
	var last = getPeopleLength();
	var id = generateID(last, type, 1, 1);

	if (mapx == undefined) mapx = rand(2, city.map.length) - 1;
	if (mapy == undefined) mapy = rand(2, city.map[0].length) - 1;

	var p = new Person(id, type, 'car');

	var sp = new SpawnPoint('car');
	p.mapID.x = mapx;
	p.mapID.y = mapy;

	p.x = sp.x;
	p.y = sp.y;

	p.type = 'car';
	p.car = true;

	p.job = new Job(p.mapID.x, p.mapID.y);
	p.homes = [];

	everyman.people[id] = p;
	everyman.peopleList.push(id);
}
function addPerson(type, mapx, mapy, mother) {
	var last = getPeopleLength();
	var id = generateID(last, type, 1, 1);

	if (mapx == undefined) mapx = rand(2, city.map.length) - 1;
	if (mapy == undefined) mapy = rand(2, city.map[0].length) - 1;

	var p = new Person(id, type);

	if (mother) {
		p.family = mother.family; //Nice TV show tho
		p.age = 0;
		p.x = mother.x;
		p.y = mother.y;
		p.mapID = {
			'x': mother.mapID.x,
			'y': mother.mapID.y,
		}
	}

	if (!mother) {
		var sp = new SpawnPoint();
		p.mapID.x = mapx;
		p.mapID.y = mapy;

		p.x = sp.x;
		p.y = sp.y;
	}

	p.job = new Job(p.mapID.x, p.mapID.y);
	p.homes = [];

	everyman.people[id] = p;
	everyman.peopleList.push(id);

	if (everyman.peopleList.length > MAX_NPC) updateInterns();

	getPolicemen();
}
function Home(x, y) {
	this.x = x;
	this.y = y;
	this.rent = getHouseValue(x, y);
	this.entryPrice = round(this.rent * ENTRY_PRICE_MOD);
	this.price = round(this.rent * 60);
	this.due = 0;
	this.bought = false;
	this.nextDueDate = new EMDate(0, 1, 0);
	this.unpaid = 0;
}
function upgradeJob(job) {
	job.level++;
	if (job.workhours > 0) job.workhours -= 0.25;
	if (job.payday > 1) job.payday -= 0.5;
	job.baseSalary += getJobSalary(job.x, job.y, 'basemod');
}
function getJobId(x, y) {
	if (!city.map || !city.map[x] || !city.map[x][y]) return;
	var map = city.map[x][y];
	if (map.jobID != undefined) return map.jobID;
	var type = getJobSalary(x, y, 'type');
	var r = jobList[type];
	var max = rand(1, r.length) - 1;

	city.map[x][y].jobID = max;

	return max;
}
function Job(x, y) {
	this.x = x;
	this.y = y;
	this.type = getTypeOfMap(city.map, x, y);
	this.id = getJobId(x, y);

	this.workhours = getJobSalary(x, y, 'hours');
	this.payday = getJobSalary(x, y, 'payday');

	this.level = 0;

	this.baseSalary = (getJobSalary(x, y, 'base') / 20) / 24;
	this.type = getJobSalary(x, y, 'type');

	this.itemChances = getJobSalary(x, y, 'itemChances');

	this.workedHours = 0;
	this.dueHours = 0;
	this.production = 0;
	this.end = false;
	this.nextPaycheck = new EMDate(this.payday, 0, 0);
}
function getCheck(job) {
	var payday = job.payday;
	var objective = payday * job.workhours;

	var worked = job.workedHours;

	var efficiency = 1;
	if (objective > 0) efficiency = (worked / objective);
	var baseSalary = job.baseSalary * worked;

	var nextPaycheck = getDateValue(everyman.time) - getDateValue(job.nextPaycheck);


	return {'payday': payday, 'objective': objective, 'worked': worked, 'efficiency': efficiency, 'baseSalary': baseSalary, 'nextPaycheck': nextPaycheck}
}
function getJobSalary(x, y, peek) {
	//Work at farms/etc: 0 salary, low extra salary, no work hours, daily payday
	//Work at factories: high work hours, low salary, high extra salary, slow payday
	//Work at office: low work hours, high salary, no extra salary, fast payday
	//Work at cleaning service: Low salary, high hours, daily payday
	//Work as drug dealer: Highest extra salary, no work hours, daily payday
	var base = getHouseValue(x, y);
	var type = getTypeOfMap(city.map, x, y);
	if (type == 'mix') type = 'thi';
	if (type != 'fir' && type != 'sec' && type != 'thi' && type != 'slum') type = 'com';
	if (peek == 'type') return type;
	var salaryMod = {
		'base': {
			'fir': 0,
			'sec': 1,
			'thi': 1.5,
			'com': 0.5,
			'slum': 2.0,
		},
		'hours': {
			'fir': 0,
			'sec': 8,
			'thi': 4,
			'com': 16,
			'slum': 12,
		},
		'payday': {
			'fir': 0,
			'sec': 20,
			'thi': 5,
			'com': 1,
			'slum': 1,
		},
		'itemChances': {
			'fir': 2,
			'sec': 8,
			'thi': 16,
			'com': 32,
			'slum': 4,
		}
	}
	if (peek == 'basemod') return salaryMod.base[type];
	var mod = salaryMod[peek][type];
	base *= mod;
	if (peek == 'base') return base;
	return mod;
}
function checkHomeRent(home) {
	if (home.nextDueDate == undefined) home.nextDueDate = new EMDate(0, 1, 0);
	if (home.due == undefined) home.due = 0;
	if (home.rent == undefined) home.rent = getHouseValue(home.x, home.y);
	if (home.price == undefined) home.price = (home.rent * 60);
	if (home.bought == undefined) home.bought = false;

	if (home.bought) return;

	var due = home.nextDueDate;
	if (getDateValue(everyman.time) > getDateValue(due)) {
		home.due += home.rent;
		home.nextDueDate = new EMDate(0, 1, 0);
	}
}
function getDateValue(date) {
	var value = 0;
	value += (date.minutes / 1440);
	value += (date.hours / 24);
	value += date.day;
	value += (MONTH_DAYS * date.month);
	value += ((MONTH_DAYS * YEAR_MONTHS) * date.year);

	return value;
}
function EMDate(add_days, add_months, add_years) {
	this.hours = everyman.time.hours;
	this.minutes = everyman.time.minutes;
	this.day = everyman.time.day;
	this.month = everyman.time.month;
	this.year = everyman.time.year;

	if (add_days != undefined) { this.day += add_days; }
	if (add_months != undefined) { this.month += add_months; }
	if (add_years != undefined) { this.year += add_years; }

	while (this.day > MONTH_DAYS) {
		this.day -= MONTH_DAYS;
		this.month++;
	}
	while (this.month > YEAR_MONTHS) {
		this.month -= YEAR_MONTHS;
		this.year++;
	}
}
function SpawnPoint(item) {
	this.x = red(3, 18)
	this.y = red(3, 18);

	this.x += rand(0, 1);
	this.y += rand(0, 1);

	if (item == 'car') {
		var type = rand(0,1);
		if (type == 0) {
			this.x = rand(0, 22);
			this.y = red(1, 21);
			if (this.y == 1) this.facing = 3;
			if (this.y == 21) this.facing = 1;
		}
		if (type == 1) {
			this.y = rand(0, 22);
			this.x = red(1, 21);
			if (this.x == 1) this.facing = 2;
			if (this.x == 21) this.facing = 0;
		}
	}

	if (item && item != 'car') {

		var type = rand(0,1);
		if (type == 0) {
			this.x = rand(17, 20);
			this.y = rand(2, 20);
		}
		if (type == 1) {
			this.y = rand(17,20);
			this.x = rand(2, 20);
		}
	}
}

function enterStaticBuilding(id) {
	player.x = 3;
	player.y = 3;

	player.insideStatic = id;
	displayMap();

	player.outsideCoords = {'x': player.x, 'y': player.y};
}

function newLayer(width, height, empty, lay, type, variation) {
	var layer = [];

	for (var h = 0; h < height; h++) {
		layer[h] = [];
		for (var w = 0; w < width; w++) {
			var toadd = '';

			if (lay == 1 && type == 'res') {
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
			if (lay == 1 && type == 'sea') {
				toadd = 'tile_sea';
			}
			if (lay == 1 && type != 'sea') {
				toadd = 't_road_walk';
			}
			if (lay == 1 && type == 'wil') {
				toadd = 't_grass';
			}
			if (lay == 1 && type == 'dung') {
				toadd = 't_road';
				if (w > 0 && h > 0 && w < (width - 1) && h < (height - 1)) {
					toadd = 'tile_woodfloor';
					if (variation == 'sec' || variation == 'jail') toadd = 'tile_ironfloor';
					if (variation == 'thi' || variation == 'mix' || variation == 'hospital') toadd = 'tile_clearfloor';
					if (variation == 'dream') toadd = red('t_road', 't_alley');
				}
			}
			if (lay == 2 && type == 'dung') {
				if (w == 0 || h == 0 || w == (width - 1) || h == (height - 1)) {
					toadd = 'tile_outerwall';
					if (variation == 'hospital') toadd = 'tile_hospital_wall';
				}
				if (w == 2 && h == 22) toadd = 'tile_empty';

				if (variation == 'hospital') {
					if ((w >= 6 && h == 16) || (w == 6 && h >= 16)) toadd = 'tile_hospital_desk';
					if (h == 11 || ((w == 7 || w == 15) && h <= 11)) toadd = 'tile_hospital_wall';
					if (h == 11 && (w == 2 || w == 9 || w == 17)) toadd = 'tile_empty';

					if ((w == 1 || w == 8 || w == 16 || w == 4 || w == 19 || w == 12) && h > 0 && h < 3) {
						toadd = (h == 1) ? 'tile_bed2' : 'tile_bed1';
					}
					if (h == 1) {
						if (w == 2 || w == 9 || w == 17 || w == 5 || w == 20 || w == 13) toadd = 'tile_hospital_blood';
						if (w == 3 || w == 10 || w == 18) toadd = 'tile_hospital_healthmeter';
					}
				}

				if (variation == 'sec') {
					if (w > 1 && w < (width - 1) && (h == 1 || h == 6)) {
						toadd = 'tile_belt';
						if (w == 2) toadd = 'tile_belt_machiner';
					}
					if (w == 1 && (h == 2 || h == 7)) toadd = 'tile_belt_machinel';
					if (w > 0 && w < 8 && h == 14) toadd = 'tile_crystalwall';
					if (w == 8 && h >= 14) toadd = 'tile_outerwall';

					if (w == 8 && h == 18) toadd = 'tile_work_door';

					if (w > 0 && w < 18 && w % 2 == 0 && h == 10) toadd = 'tile_cfence';
					if (w > 16 && w < (width - 1) && h == 10 && w % 2 == 0) toadd = 'tile_metal_post';
					if (w > 10 && w < (width - 1) && h > 12 && h < (height - 1) && h % 3 == 0 && w % 2 == 0) toadd = 'tile_metal_frame';
				}
				if (variation == 'thi') {
					if ((w > 0 && w < 5 || w > (width - 6) && w < (width - 1)) && h == 1) toadd = 'tile_shop_fridge';
					if (w > 5 && w < (width - 6) && (h == 1 || h == 6 || h == 11)) {
						toadd = 'tile_shop_shelf';
						if (h > 1) toadd = 'tile_shop_counter';
					}
					if (h == 15 && w >= 6 && w < (width - 1)) {
						toadd = 'tile_shop_desk';
						if (w == 11 || w == 19) toadd = 'tile_shop_work_door';
					}
					if ((w == 6 || w == 13) && h < (height - 1) && h > 15) {
						if (h < 18) toadd = 'tile_shop_desk'; 
						if (w == 6 && h > 17) toadd = 'tile_outerwall';
						if (h == 16) toadd = 'tile_shop_desk_machine';
						if (h == 19 && w == 6) toadd = 'tile_work_door';
					}
					if ((w == 7 || w == 14) && h == 16) toadd = 'tile_shop_vendor';
				}

			}

			if (lay == 2 && type == 'dung' && (variation == 'fir' || variation == 'res' || variation == 'mix' || variation == 'slum')) {
				toadd = 'tile_outerwall';

				if (w > 0 && h > 0 && w < (width - 1) && h < (height - 1)) toadd = 'tile_empty';

				if ((w == 6 || (w > 10 && w < (width - 1))) && h > 0 && h < (height - 1)) toadd = 'tile_hidden';
				if (w == 6 && h == 12) toadd = 'tile_empty';

				if ((h == 9 || h == 15 || (h > 0 && h < 5)) && w > 0 && w < (width - 1)) toadd = 'tile_hidden';
				if (w >= 7 && w < (width - 1) && ((h > 0 && h < 10) || (h > 13 && h < (height - 1)))) toadd = 'tile_hidden';

				if (variation == 'fir' && toadd == 'tile_hidden') toadd = 'tile_woodwall';

				if ((h == 9) && h != 0 && h != (height - 1) && (w == 3)) toadd = 'tile_empty';
				if ((h == 15) && h != 0 && h != (height - 1) && (w == 3)) toadd = 'tile_empty';

				if (w == 3 && h == 15 && (variation == 'res' || variation == 'mix' || variation == 'slum')) toadd = 'tile_door';

				if (w == 1) {
					if (h == 10) toadd = 'tile_fridge';
					if (h == 11) toadd = 'tile_cooker';
					if (h == 12) toadd = 'tile_cabinet';
				}
				if (h == 5) {
					if (w == 1) toadd = 'tile_bed2';
					if (w == 3) toadd = 'tile_table';
					if (w == 2) toadd = 'tile_closet';
				}
				if (h == 10) {
					if (w == 7) toadd = 'tile_sink2';
					if (w == 8) toadd = 'tile_toilet';
				}
				if (w == 1 && h == 6) toadd = 'tile_bed1';


				if (w == 2 && h == (height - 1)) toadd = 'tile_empty';

				if (variation == 'fir' && w == 0 && h == 13) toadd = 'tile_work_door';
			}
			if (lay == 2) if ((variation == 'mix' || variation == 'slum') && w == 0 && h == 18) toadd = 'tile_work_door';


			if (toadd && toadd != 'tile_empty') layer[h][w] = toadd;
		}
	}
	return layer;
}
function beautifyTile(mapx, mapy) {
	var minx = parseInt(mapx) - 1;
	var maxx = parseInt(mapx) + 1;

	var miny = parseInt(mapy) - 1;
	var maxy = parseInt(mapy) + 1;
	for (var x = minx; x <= maxx; x++) {
		for (var y = miny; y <= maxy; y++) {
			decorateMap(city, x, y);
		}
	}
}
function getItemTile(id) {
	if (itemList[id].tile) return getItemTile(itemList[id].tile);
	return '-'+(parseInt(id) * 30)+'px 0px';
}
function decorateMap(mapobject, mapx, mapy) {
	if (!mapobject) return;
	if (getTypeOfMap(mapobject.map, mapx, mapy) == 'void') return;

	mapobject = mapobject.map;
	var map = mapobject[mapx][mapy].map;
	var maptype = mapobject[mapx][mapy].type;
	var surr = getSurroundingTypes(mapobject, mapx, mapy);
	var layer = map[1];

	for (var y = 0; y < MAP_HEIGHT; y++) {
		for (var x = 0; x < MAP_WIDTH; x++) {
			var maxh = layer.length;
			var maxw = layer[y].length;

			var halfh = Math.floor(maxh / 2);
			var halfw = Math.floor(maxw / 2);
			if (maptype == 'par') {
				var mw = maxw - 5;
				var mh = maxh - 5;
				var toadd = 't_road';
				if (x <= 4 || y <= 4 || x >= mw || y >= mh) toadd = 't_road_walk';

				layer[y][x] = toadd;
			}
			if (maptype == 'sea') {
				var toadd = '';
				if (surr.bottom != 'sea' && x > maxw - 4) toadd = 't_road_walk';

				if (toadd) layer[y][x] = toadd;
			}
			if (maptype != 'wil' && maptype != 'sea') {
				toadd = 't_road_walk';
				if (x > 5 && x < (maxw - 6) && y > 5 && y < (maxh - 6)) toadd = (maptype == 'fir' || maptype == 'par') ? 't_grass' : 't_alley';
				if (x < 2 || y < 2 || x > (maxw - 3) || y > (maxh - 3)) toadd = 't_road';
				if (x == 0 || x == (maxw - 1)) toadd = 't_road_ns';
				if (y == 0 || y == (maxh - 1)) toadd = 't_road_ew';
				if ((x == 0 || x == (maxw - 1)) && (y == 0 || y == (maxh - 1))) toadd = 't_crossroad';

				if (canAnNPCWalk(x, y) && ((x < 2 || y < 2 || x > (maxw - 3) || y > (maxh - 3)))) {
					toadd = 't_cross_ns';
					if (y >= 2 && y <= (maxh - 3)) toadd = 't_cross_ew';
				}

				layer[y][x] = toadd;
			}
		}
	}
	var layer = map[2];
	for (var y = 0; y < MAP_HEIGHT; y++) {
		for (var x = 0; x < MAP_WIDTH; x++) {
			var toadd = '';
			if (maptype == 'fir') {
				if ((x >= 6 && x <= 16) && (y == 6 || y == 16)) toadd = 'tile_fence_ns';
				if ((y >= 6 && y <= 16) && (x == 6 || x == 16)) toadd = 'tile_fence_ew';
				if (x == 11 && y == 16) toadd = 'tile_fence_door';
			}

			if (maptype != 'sea' && maptype != 'par') {
				if (x == 19 && y == 19) toadd = 'tile_bin';
			}

			if (toadd) layer[y][x] = toadd;
		}
	}

}
function updateBuilding(wherex, wherey) {
	if (isHome(player, wherex, wherey)) return;
	city.map[wherex][wherey].building = undefined;
	var buildingType = city.map[wherex][wherey].type;
	city.map[wherex][wherey].inside = new Inside(buildingType);
	decorateMap(city, wherex, wherey);

	if (wherex == player.mapID.x && wherey == player.mapID.y) displayMap();
}
function buildBuilding(wherex, wherey) {
	var here = city.map[wherex][wherey].map;
	if (city.map[wherex][wherey].building > 0) return;
	var floors = 3;
	var buildingType = city.map[wherex][wherey].type;
	if (buildingType == 'sea' || buildingType == 'par' || buildingType == 'wil') return;

	var blueprint = getBluePrint(buildingType, getJobId(wherex, wherey));

	var bsize = rand(3, 7);

	var block = size(7, bsize, floors);
	city.map[wherex][wherey].building = floors;
	city.map[wherex][wherey].bsize = bsize;
	city.map[wherex][wherey].inside = new Inside(buildingType, bsize, floors);
	var tileset = 'tile_proto';
	if (buildingType == 'fir') tileset = 'tile_agro';

	placeBuilding(here, size(7, 7, 2), block, tileset);

	addPerson('npc', wherex, wherey); 
}
function getFamilyOf(guy, all) {
	if (!all) var l = '<b>Family of '+guy.name+' '+guy.family+'</b><br><br>';
	if (everyman.graveyard == undefined) everyman.graveyard = [];
	if (all) var l = '<b>Total population</b> '+everyman.peopleList.length+' alive, '+everyman.graveyard.length+' deceased.<br>';
	for (var p in everyman.people) {
		var g = everyman.people[p];
		if (g.family != guy.family && !all) continue;
		l += displayFamilyGuy(g)+'<br>'
	}
	for (var p in everyman.graveyard) {
		var g = everyman.graveyard[p];
		if (g.family != guy.family && !all) continue;
		l += displayFamilyGuy(g)+'<br>'
	}
	if (player.family == guy.family || all) {
		l += displayFamilyGuy(player, 'you')+'<br>';
	}
	return l;
}
function displayFamilyGuy(g, you) {
	var y = (you == 'you') ? ' (You)' : '';
	var ex1 = (g.causeOfDeath) ? ' '+g.causeOfDeath+' at' : '';
	var prefix = (g.causeOfDeath) ? '&dagger;' : '';
	var s1 = (g.sleeping) ? '(Sleeping)' : '';
	var s2 = (g.working) ? '(Working)' : '';
	return prefix+''+g.name+' '+g.family+y+' the '+getMyJobName(g)+ex1+' '+g.age+' years '+s1+' '+s2;
}
function getBluePrint(sector, id) {
	var blueprints = {
		'fir': [
			new Building('2;3;5', '4', '6', '8;7;2', '2'),
		],
		'sec': [
			new Building('2;3;5', '4', '6', '8;7;2', '2'),
		],
		'thi': [
			new Building('2;3;5', '4', '6', '8;7;2', '2'),
		],
		'mix': [
			new Building('2;3;5', '4', '6', '8;7;2', '2'),
		],
		'res': [
			new Building('2;3;5', '4', '6', '8;7;2', '2'),
		],
		'slum': [
			new Building('2;3;5', '4', '6', '8;7;2', '2'),
		],
		'sea': [
			new Building('2;3;5', '4', '6', '8;7;2', '2'),
		],
		'par': [
			new Building('2;3;5', '4', '6', '8;7;2', '2'),
		],
		'wil': [
			new Building('2;3;5', '4', '6', '8;7;2', '2'),
		],
	}
	return blueprints[sector][id];
}
function Building(front, sidev, back, sidei, middle) {
	this.front = new BuildingSide(front);
	this.sidev = new BuildingSide(sidev);
	this.back = new BuildingSide(back);
	this.sidei = new BuildingSide(sidei);
	this.middle = new BuildingSide(middle);
}
function BuildingSide(string) {
	var spl = string.split(';');
	if (spl.length == 1) {
		this.main = spl[0].split('.');
	}
	else {
		this.cornerLeft = spl[0].split('.');
		this.main = spl[1].split('.');
		this.cornerRight = spl[2].split('.');
	}
}
function Inside(type) {
	this.map = [];
	for (var xx = 0; xx < 4; xx++) this.map.push(newLayer(MAP_WIDTH, MAP_HEIGHT, 'tile_empty', xx, 'dung', type));
}
function changeTile(mp, x, y, newTile) {
	mp[y][x] = newTile;
}
function getBestZone(mapx, mapy) {
	var thisZone = {'x': mapx, 'y': mapy};
	var maxx = city.map.length - 1;
	var maxy = city.map[0].length - 1;
	var maxvalue = maxx + maxy;

	var firzones = ['fir', 'res'];
	var seczones = ['sec', 'slum'];
	var thizones = ['thi', 'mix'];

	var mod = 25600;

	var firvalue = Math.pow(2, -sdistance({'x': 0, 'y': maxy}, thisZone));

	var secvalue = Math.pow(2, -sdistance({'x': maxx, 'y': 0}, thisZone));

	var thivalue = Math.pow(2, -sdistance({'x': maxx, 'y': maxy}, thisZone));

	var tot = firvalue + secvalue + thivalue;
	var r = tot * Math.random();

	if (r <= (firvalue)) return read(firzones);
	if (r <= (firvalue + secvalue)) return read(seczones);
	if (r <= (firvalue + secvalue + thivalue)) return read(thizones);

	return read(read([firzones, seczones, thizones]));
}
function getBestZoneOld(mapobject, mapx, mapy, forcerandom) {
	var zones = [];
	for (var x = mapx-2; x < mapx+2; x++) {
		for (var y = mapy-2; y < mapy+2; y++) {
			var thisZone = getTypeOfMap(mapobject, x, y);
			if (thisZone && thisZone != 'wil' && thisZone != 'sea' && thisZone != 'void' && thisZone != 'par') {
				zones.push(thisZone);
			}
		}
	}
	var randomZone = read(['fir', 'sec', 'thi', 'res', 'mix', 'slum', 'par']);
	if (forcerandom) return randomZone;
	zones.push(randomZone);

	return read([read(zones), randomZone]);
}
function getSurroundingTypes(mapobject, mapx, mapy) {
	mapx = parseInt(mapx);
	mapy = parseInt(mapy);
	return {
		'top': getTypeOfMap(mapobject, mapx-1, mapy),
		'left': getTypeOfMap(mapobject, mapx, mapy-1),
		'right': getTypeOfMap(mapobject, mapx, mapy+1),
		'bottom': getTypeOfMap(mapobject, mapx+1, mapy),
	}
}
function getHouseValue(mapx, mapy, peeklevel) {
	var mod = 0;
	mod += getLotValue(mapx, mapy, 'self');
	var dirs = ['top', 'left', 'topleft', 'topright', 'bottom', 'right', 'bottomleft', 'bottomright'];

	for (var d in dirs) {
		var c = coordsFrom(mapx, mapy, dirs[d]);
		var modv = getLotValue(c.x, c.y, 'short');
		mod += modv
	}

	for (var d in dirs) {
		var c = coordsFrom(mapx, mapy, dirs[d], true);
		var modv = getLotValue(c.x, c.y, 'long');
		mod += modv
	}

	if (peeklevel == 'neighborhood') return mod;

	var floormod = 3;
	floormod -= (getBuildingHeight(mapx, mapy) - 3);
	if (floormod) mod += floormod;

	if (peeklevel == 'floormod') return floormod;

	var houseValue = BASE_HOUSE_VALUE;

	houseValue *= 0.2;

	houseValue /= 12;

	houseValue *= Math.pow(1.05, mod);



	return round(houseValue);
}
function getLotValue(mapx, mapy, peeklevel) {
	var svalues = {'res': 0, 'mix': -1, 'fir': -2, 'slum': -3, 'els': -4};
	var values = {'fir': -2, 'wil': -3, 'slum': -4, 'sec': -5, 'thi': 1, 'par': 1, 'sea': 2, 'els': 0};
	var valuesl = {'fir': -1, 'wil': -2, 'slum': -2, 'sec': -3, 'sea': 1, 'els': 0};
	var modifier = 0;
	var thislot = getTypeOfMap(city.map, mapx, mapy);

	if (peeklevel == 'self') {
		modifier += (svalues[thislot]) ? svalues[thislot] : svalues.els;
	}
	if (peeklevel == 'short') {
		modifier += (values[thislot]) ? values[thislot] : values.els;
	}
	if (peeklevel == 'long') {
		modifier += (valuesl[thislot]) ? valuesl[thislot] : valuesl.els;
	}


	return modifier;
}

function getSurroundingFloors(mapx, mapy) {
	mapx = parseInt(mapx);
	mapy = parseInt(mapy);
	var surr = {};
	var dirs = ['top', 'left', 'topleft', 'topright', 'bottom', 'right', 'bottomleft', 'bottomright'];
	for (var d in dirs) {
		var name = dirs[d];
		surr[name] = getBuildingHeight(coordsFrom(mapx, mapy, dirs[d]));
	}
	for (var d in dirs) {
		var name = dirs[d]+'l';
		surr[name] = getBuildingHeight(coordsFrom(mapx, mapy, dirs[d], true));
	}

	var min, max;
	for (var s in surr) {
		var su = surr[s];
		if (min == undefined || su < min) min = su;
		if (max == undefined || su > max) max = su;
	}
	if (min == undefined) min = 3;
	if (max == undefined) max = 3;
	return {'min': min, 'max': max, 'rand': rand(min, max+1)};
}
function coordsFrom(x, y, direction, longy) {
	var n = (longy) ? 2 : 1;
	if (direction == 'top' || direction == 'topleft' || direction == 'topright') x -= n;
	if (direction == 'left' || direction == 'topleft' || direction == 'bottomleft') y -= n;
	if (direction == 'right' || direction == 'topright' || direction == 'bottomright') y += n;
	if (direction == 'bottom' || direction == 'bottomleft' || direction == 'bottomright') x += n;

	return {'x': x, 'y': y};
}
function getBuildingHeight(coords) {

	var mapx = coords.x;
	var mapy = coords.y;
	if (!city.map[mapx]) return 3;
	if (!city.map[mapx][mapy]) return 3;
	var m = city.map[mapx][mapy].building;
	if (m == undefined) return 3;
	return m;
}
function getBoundLimit(map, mapx, mapy) {
	if (mapx < 0) return 'west';
	if (mapy < 0) return 'north';
	if ((mapx >= map.length) && (mapy >= map[0].length)) return 'southeast';
	if (mapx >= map.length) return 'east';
	if (mapy >= map[0].length) return 'south';
}
function getTypeOfMap(mapobject, mapx, mapy, exists) {
	var m = mapobject[mapx];
	if (!m) {
		if (exists) return false;
		return 'void';
	}
	m = m[mapy];
	if (!m) {
		if (exists) return false;
		return 'void';
	}
	if (m.type == 'sea' && exists) return false;
	return m.type;
}

function newMap(width, height, layers, type) {
	var tiles = [];
	for (var lay = 0; lay < layers; lay++) {
		var defaultTile = 'tile_empty';
		var laysByLevel = [];
		if (laysByLevel[lay]) defaultTile = laysByLevel[lay];
		tiles[lay] = newLayer(width, height, defaultTile, lay, type);
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
function getMyJobName(who) {
	if (who == undefined) who = player
	var classy = 'c_none';
	var jname = '';
	if (who.job) {
		classy = 'c_'+who.job.type;
		jname = jobList[who.job.type][who.job.id].name;

	}
	if (!who.job || who.age < 18) {
		if (who.age < 4) {
			jname = 'Baby';
			classy = 'c_baby';
		}
		if (who.age >= 4 && who.age <= 12) {
			jname = 'Kid';
			classy = 'c_kid';
		}
		if (who.age > 12 && who.age < 18) {
			jname = 'Teenager';
			classy = 'c_teen';
		}
		if (who.age > 18) {
			jname = 'Unemployed';
			classy = 'c_none';
		}
		if (who.age > 55) {
			jname = 'Retired';
			classy = 'c_oldfart';
		}
	}
	return '<span class="'+classy+'">'+jname+'</span>';
}
function getRandomFoodItem(getid) {
	var items = [];
	for (var i in itemList) if (itemList[i].food) {
		if (!getid) items.push(itemList[i].name);
		if (getid) items.push(i);
	}
	return read(items);
}

function movePlayer(direction) {
	if (player.working || player.sleeping) return;
	moveGuy(player, direction, true);

	if (isAPolicemanOnSight()) {
		addCrime(player, 6, displayCrime(player, 'wanted') / 10);
	}

	drawMap();
}
function drawMap() {
	for (var x = -VISION_RANGE_X; x < VISION_RANGE_X; x++) {
		for (var y = -VISION_RANGE_Y; y < VISION_RANGE_Y; y++) {
			drawColumn(MAX_LAYERS, x, y);
		}
	}
}
function drawColumn(layers, relx, rely) {
	for (var layer = 0; layer < layers; layer++) {
		var el = 'maptile_'+layer+'_'+relx+'_'+rely;
		if (!doc(el)) {
			var el = document.createElement('maptile');
			el.id = 'maptile_'+layer+'_'+relx+'_'+rely;
			el.style.top = (VISION_RANGE_Y * 24) + ((layer - 1) * -24) + (rely * 24)+'px';
			el.style.left = (VISION_RANGE_X * 24) + (relx * 24)+'px';

			document.body.appendChild(el);
		}
		var el = 'maptile_'+layer+'_'+relx+'_'+rely;
		var wmap = getActiveMap();
		var x = player.x + relx;
		var y = player.y + rely;

		var wtile = whatsHere(wmap, {'x': x, 'y': y, 'z': layer});
		if (!wtile) {
			wtile = 'tile_empty';
			if (layer == 1) wtile = 'tile_sea';
		}
		var ncn = 'tile '+wtile;
		if (doc(el).className != ncn) doc(el).className = ncn;
	}

	for (var e in everyman.people) {
		var guy = everyman.people[e];
		if (guy.mapID.x != player.mapID.x || guy.mapID.y != player.mapID.y) continue;
		if (guy.x < (player.x - VISION_RANGE_X) || guy.x > (player.x + VISION_RANGE_X)) continue;
		if (guy.y < (player.y - VISION_RANGE_Y) || guy.y > (player.y + VISION_RANGE_Y)) continue;
		drawPerson(guy);
	}
}
function mapExists(x, y) {
	if (city) {
		if (city.map[x]) {
			if (city.map[x][y]) return true;
		}
	}
}
function getRandomEmptySpace(city) {
	var map = city.map;
	var emptySpaces = [];
	for (var w in map) {
		for (var h in map[w]) if (getTypeOfMap(map, w, h) == 'wil' || getTypeOfMap(map, w, h) == false) emptySpaces.push({'w': w, 'h': h});
	}
	var rt = red('w', 'h');
	var rw = rand(0, map.length);
	var rh = rand(0, map[0].length);
	if (emptySpaces.length < 1) emptySpaces.push({'w': rw, 'h': rh});
	return read(emptySpaces);
}
function checkExits(city, pointer) {
	var dirs = ['north', 'west', 'east', 'south'];
	var exits = [];
	for (var di in dirs) {
		var dir = dirs[di];
		if (isDestinationOutOfLimits(city, pointer, dir)) {
			exits.push(dir);
			continue;
		}
		var np = {'w': pointer.w, 'h': pointer.h};
		np = movePointer(np, dir);
		if (city.map[np.w][np.h].type == 'wil') exits.push(dir);
	}
	return exits;
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
	trans       Roads between districts (only for cars)
*/
function populateChunkAt(map, mapx, mapy, forcerandom) {
	var pointer = {'w': mapx, 'h': mapy};
	var extrapointer = {'w': parseInt(mapx), 'h': parseInt(mapy)};

	expandCityLimits(city, extrapointer);
	var type = getBestZone(mapx, mapy);

	//if ((mapx - 3) % 6 == 0 && (mapy - 3) % 6 == 0) type = 'par';
	//if (mapx < 1 || mapy < 1) type = 'sea';

	forceNewZone(city, pointer, type, 0);
}
function expandCity(city, forcerandom) {
	var cityMap = city.map;

	var i = 1;
	do {
		var pointer = getRandomEmptySpace(city);
		populateChunkAt(cityMap, pointer.w, pointer.h, forcerandom);
		beautifyTile(pointer.w, pointer.h);
		buildBuilding(pointer.w, pointer.h);
		i++;

		var pointer = {'x': rand(0, city.map.length-1), 'y': rand(0, city.map[0].length-1)};
		updateBuilding(pointer.x, pointer.y);

		var pointer = {'x': rand(0, city.map.length-1), 'y': rand(0, city.map[0].length-1)};
		if (!isHome(pointer.x, pointer.y)) {
			city.map[pointer.x][pointer.y] = 'wil';
			populateChunkAt(cityMap, pointer.x, pointer.y);
		}
	} while (rand(0,1));
}
function expandMap(map) {
	var width = map.length;
	var height = map[0].length;

	console.log('width', width, 'height', height);
}
function fixPointer(tpointer, direction) {
	if (direction == 'west') movePointer(tpointer, 'east');
	if (direction == 'north') movePointer(tpointer, 'south');
}
function forceNewZone(city, pointer, type, sector) {
	var name = newDistrictName();

	if (getTypeOfMap(city.map, pointer.w, pointer.h) == 'wil' || !getTypeOfMap(city.map, pointer.w, pointer.h)) {
		city.map[pointer.w][pointer.h] = new EmptyMap(type, sector, name);
		decorateMap(city, pointer.w, pointer.h);
	}
}
function getLeftPointer(pointer, direction, alt) {
	var np = {'h': pointer.h, 'w': pointer.w};
	var lefts = {
		'north': 'west', 'east': 'north', 'south': 'east', 'west': 'south'
	}
	var rights = {
		'north': 'east', 'east': 'south', 'south': 'west', 'west': 'north'
	}
	var dir = (alt) ? rights[direction] : lefts[direction];
	movePointer(np, dir);

	return {'w': np.w, 'h': np.h, 'dir': dir};
}
function isDestinationOutOfLimits(city, pointerz, direction) {
	var minx = 0;
	var miny = 0;
	var maxx = city.map.length;
	var maxy = city.map[0].length;

	pointerz = JSON.parse(JSON.stringify(pointerz));
	var newPointer = (direction == undefined) ? pointerz : movePointer(pointerz, direction);
	if (newPointer.x) newPointer.w = newPointer.x;
	if (newPointer.y) newPointer.h = newPointer.y;

	if (newPointer.h < miny || newPointer.w < minx) return true;
	if (newPointer.h >= maxy || newPointer.w >= maxx) return true;
}
function expandCityLimits(city, pointer) {
	var typof = getTypeOfMap(city, pointer.w, pointer.h);
	if (typof != 'void') return;
	var direction = getBoundLimit(city.map, pointer.w, pointer.h);

	var dname = newDistrictName();

	if (direction == 'west') {
		var arr = [];
		for (var e in city.map[0]) arr.push(new EmptyMap('wil', 4, dname));
		city.map.unshift(arr);
		displaceAllGuys('east');
	}
	if (direction == 'east' || direction == 'southeast') {
		var arr = [];
		for (var e in city.map[0]) {
			var type = 'wil';
			arr.push(new EmptyMap(type, 4, dname));

		}
		city.map.push(arr);
	}
	if (direction == 'north') {
		for (var e in city.map) city.map[e].unshift(new EmptyMap('wil', 4, dname));
		displaceAllGuys('south');
	}
	if (direction == 'south' || direction == 'southeast') {
		for (var e in city.map) {
			var type = 'wil';
			city.map[e].push(new EmptyMap(type, 4, dname));
		}
	}

	return true;
}
function getZonesByType(city) {
	var zones = {
		'fir': 0, 'sec': 0, 'thi': 0, 'res': 0, 'mix': 0, 'slum': 0,
	}
	for (var w in city.map) {
		for (var h in city.map[w]) {
			var tile = city.map[w][h];
			if (zones[tile.type] != undefined) zones[tile.type] = 1;
			if  (zones.fir + zones.sec + zones.thi + zones.res + zones.mix + zones.slum == 6) return true;
		}
	}
	return false;
}
function getMapFromPointer(city, pointer) {
	if (city.map[pointer.w] == undefined) return;
	return city.map[pointer.w][pointer.h];
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
			//TODO Mostrar un icono especial cuando ese distrito sea tu casa/trabajo, que cambie de color si tu casa está sin pagar, o si tienes trabajo que hacer
			div += '<div title="District '+dx+'x'+dy+' '+sq.districtName+""+'0'+""+sq.sector+' '+sq.type+'" class="'+sq.type+' cityMapTile '+youAreHere+'" style="top: '+(parseInt(dy) * 4)+'px; left: '+(parseInt(dx) * 4)+'px"></div>';
		}
		div += '<div class="breaker"></div>';
	}

	div += '</div>';
	return div;
}
function cityMapToIso(city) {

}
function EmptyMap(type, sector, dname, surr) {
	this.type = type;
	this.sector = sector;
	this.districtName = dname;
	this.map = newMap(MAP_WIDTH, MAP_HEIGHT, MAX_LAYERS, type);
}
function pickFurniture(force) {
	var infront = whatsInFrontOf(player);
	if (everyman.held) {
		if (!infront.upfront || infront.upfront == 'tile_empty') {
			editActiveMap(infront.frontcoords.x, infront.frontcoords.y, 2, everyman.held);
			everyman.held = undefined;
			displayMap();
		}
	}
	else {
		if (infront.upfront) {
			var checkItem = furnitureStatus[infront.upfront];
			var mode = isHome(player, player.mapID.x, player.mapID.y);
			var exitStatus = 0;
			if (!mode) exitStatus = 'home_not_yours';
			if (!checkItem) exitStatus = 'forbidden_item';
			if (checkItem == 'build' && !mode.bought) exitStatus = 'not_on_build_mode';
			if (exitStatus && !force) {
				return;
			}
			everyman.held = infront.upfront;
			editActiveMap(infront.frontcoords.x, infront.frontcoords.y, 2, 'tile_empty');
			displayMap();
		}
	}
}
function pick(x, y, z) {

}
function City() {
	this.tier = 0;
	this.population = 0;
	this.map = newCityMap(3, 3);
}
function newDistrictName() {
	return zeroPad(rand(0, Math.pow(36, 5)), 3);
}
function newCityMap(width, height) {
	var map = [];

	for (var w = 0; w < width; w++) {
		map[w] = [];
		for (var h = 0; h < height; h++) {
			var type = 'wil';
			//if (h == 0 || w == 0) type = 'sea';

			map[w][h] = new EmptyMap(type, 4, newDistrictName());
		}
	}

	for (var w = 0; w < width; w++) {
		for (var h = 0; h < height; h++) {
			decorateMap(city, w, h);
		}
	}

	return map;
}
function whatsHere(array, pos) {
	if (array[pos.z]) {
		if (array[pos.z][pos.y]) {
			var hier = array[pos.z][pos.y][pos.x];
			if (hier) {
				if (hier == 'tile_empty' || hier == 'tile tile_empty') return false;
				return hier;
			}
		}
	}
	return false;
}
function Pointer(obj) {
	this.x = parseInt(obj.x);
	this.y = parseInt(obj.y);
	this.w = parseInt(obj.x);
	this.h = parseInt(obj.y);
}
function movePointer(pointer, direction, hypo) {
	var dir = direction; //north, east, west, south
	var directions = {
		'north': size(0, -1),
		'south': size(0, 1),
		'east': size(1, 0),
		'west': size(-1, 0),
		'center': size(0, 0),
	}
	if (!pointer.w) pointer.w = parseInt(pointer.x);
	if (!pointer.h) pointer.h = parseInt(pointer.y);

	if (hypo) pointer = new Pointer(pointer);

	var directionID = directionNames.indexOf(direction);
	dir = directions[direction];

	pointer.w += parseInt(dir.x);
	pointer.h += parseInt(dir.y);

	pointer.x += parseInt(dir.x);
	pointer.y += parseInt(dir.y);

	return pointer;
}
function moveGuy(guyObject, direction, isPlayer, force) {
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

	if (city.map[guyObject.mapID.x] == undefined) guyObject.mapID.x = 1;
	if (city.map[guyObject.mapID.x][guyObject.mapID.y] == undefined) guyObject.mapID.y = 1;

	var guyMap = city.map[guyObject.mapID.x][guyObject.mapID.y];
	var litems = guyMap.lostItems;
	var oldmap = guyMap;
	if (guyObject.inside != undefined) {
		guyMap = guyMap.inside.map;
		litems = [];
	}
	else {
		guyMap = guyMap.map;
	}
	if (guyObject.insideStatic) {
		guyMap = staticPlaces[guyObject.insideStatic].map;
		litems = [];
	}

	direction = directions[direction];

	var nextx = guyObject.x + direction.x;
	var nexty = guyObject.y + direction.y;

	var wh = whatsHere(guyMap, size(nextx, nexty, guyObject.z));
	var wh2 = (whatsHere(guyMap, size(nextx, nexty, guyObject.z-1)) == 'tile_sea') ? true : false;

	if (force) {
		wh = false;
		wh2 = false;
	}
	if ((wh || wh2)) return 'thump';


	guyObject.x += direction.x;
	guyObject.y += direction.y;

	if (guyObject.id != undefined || guyObject == player) {
			guyObject.walking = true;
		setTimeout(function() {
			guyObject.walking = false;
			drawPerson(guyObject);
		}, 100);
	}
	for (var e in litems) {
		var li = litems[e];
		if (li.x == guyObject.x && li.y == guyObject.y && guyObject == player) {
			getLostItem(oldmap, e);
		}
	}

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
	if (guyObject.id != undefined || guyObject == player) drawPerson(guyObject);
}
function redrawInside() {
	var thismap = getActiveMap();
	city.map[player.mapID.x][player.mapID.y].inside = new Inside(getTypeOfMap(city.map, player.mapID.x, player.mapID.y));

	displayMap();
}
function displaceThere(guy, direction) {
	//TODO Añadir una pequeña transición al mover de un mapa a otro
	//Saves last position to reload last map after the movement.
	var lastpos = {
		'x': guy.mapID.x,
		'y': guy.mapID.y,
	}
	//Creates a new pointer to the destination (mapID)
	var destination = movePointer(new Pointer(guy.mapID), direction, true);
	//Checks whether the map is out of limits or is sea/void
	var exists = (!isDestinationOutOfLimits(city, destination) && getTypeOfMap(city.map, destination.x, destination.y, 1)) ? true : false;
	//if (destination.x != 0 || destination.y != 0) destination = {'x': 0, 'y': 0}

	if (exists || guy.inside || guy.insideStatic) {
		if (!guy.inside && !guy.insideStatic) {
			guy.mapID.x = destination.x;
			guy.mapID.y = destination.y;

			if (direction == 'north') guy.y = MAP_HEIGHT - 1;
			if (direction == 'south') guy.y = 0;

			if (direction == 'west') guy.x = MAP_WIDTH - 1;
			if (direction == 'east') guy.x = 0;
		}
		if (guy.insideStatic != undefined) {
			guy.insideStatic = undefined;
			guy.x = guy.outsideCoords.x;
			guy.y = guy.outsideCoords.y;
			destination = size(guy.mapID.x, guy.mapID.y);
		}
		if (guy.inside) {
			guy.inside = undefined;
			guy.x = guy.outsideCoords.x;
			guy.y = guy.outsideCoords.y;
		}

		if (guy == player) displayMap();
	}
	if (guy == player) {
		recheckGuys();
		if (lastpos && lastpos.mapID) {
			loadMapChunk(lastpos.mapID.x, lastpos.mapID.y);
			loadMapChunk(lastpos.mapID.x, lastpos.mapID.y, true);
		}
		playSong(getTypeOfMap(city.map, player.mapID.x, player.mapID.y), everyman.time.hours, player.inside);
		drawMap();
	}
	if (guy != player) {
		switchStatus(guy);
	}
}
function playSong(type, hours, inside) {
	var time = (hours >= 5 && hours <= 17) ? 'day': 'night';
	var inside = (inside) ? 'inside' : 'outside';

	checkSong(type, time, inside);
	var songObject = music[type][time][inside];
	if (lastplayed) {
		checkSong(lastplayed.type, lastplayed.time, lastplayed.inside);
		var lastsong = music[lastplayed.type][lastplayed.time][lastplayed.inside];
		lastsong.volume = 0;
		lastsong.pause();
	}
	songObject.volume = 1;
	songObject.play();
	lastplayed = {'type': type, 'time': time, 'inside': inside}
}
function checkSong(type, time, inside) {
	if (music[type] == undefined) music[type] = {'day': {}, 'night': {}};
	if (music[type][time] == undefined) music[type][time] = {'inside': new Audio('music/undefined.mp3'), 'outside': new Audio('music/undefined.mp3')};
	if (music[type][time][inside] == undefined) music[type][time][inside] = new Audio('music/undefined.mp3');
}
function loadChunksAround(guy) {
	for (var x = guy.mapID.x - 1; x <= guy.mapID.x + 1; x++) {
		for (var y = guy.mapID.y - 1; y <= guy.mapID.y + 1; y++) {
			if (sdistance(guy.mapID, size(x,y)) > 1) continue;
			if (!isDestinationOutOfLimits(city, size(x, y))) {
				loadMapChunk(x, y);
				loadMapChunk(x, y, 1);
			}
		}
	}
}
function switchStatus(guy) {
	if (!guy.sleeping && guy.energy < 10 && rand(0,1)) {
		guy.sleeping = true;
	}

	if (!guy.working && guy.age >= 18 && guy.job && guy.job.dueHours > 0 && rand(0,1)) {
		guy.working = true;
	}

	if (guy.age >= 18 && guy.marry == undefined && rand(0,1)) {
		var candidates = [];
		for (var p in everyman.people) {
			var cand = everyman.people[p];
			if (cand.gender != guy.gender && cand.family != guy.family && cand.age >= 18 && cand.marry == undefined) {
				candidates.push(cand);
			}
		}
		var marry = read(candidates);
		if (marry == undefined) return;
		guy.marry = marry.id;
		marry.marry = guy.id;
		var familyName = (guy.gender == 0) ? guy.family : marry.family;
		guy.family = familyName;
		marry.family = familyName;
	}

	if (guy.age >= 18 && guy.age < 55 && !guy.sterile && !guy.pregnant && guy.gender == 1 && guy.marry && rand(0,1)) {
		guy.pregnant = true;
		if (rand(0,1)) {
			guy.sterile = true;
		}
	}
}
function recheckGuys() {
	for (var g in everyman.peopleList) {
		tickPeople(everyman.peopleList[g], true);
		drawPerson(everyman.people[everyman.peopleList[g]]);
		everyman.peopleList[g].lastMove = totalticker;
	}
}
function getMapPos(x, y) {
	var mx = 32;
	mx *= MAP_WIDTH;

	var my = 32;
	my *= MAP_HEIGHT;

	var relpx = (x - player.mapID.x);
	var relpy = (y - player.mapID.y);

	var relx = relpx * mx;
	var rely = 24 + (relpx * my);

	return {
		'left': relx+'px',
		'top': rely+'px',
	}
}
function isMapViewable(x, y, inside, staticc) {
	var itis = true;
	if (!(x >= player.mapID.x-VISION_RANGE && x <= player.mapID.x+VISION_RANGE && y >= player.mapID.y-VISION_RANGE && y <= player.mapID.y+VISION_RANGE)) itis = false;
	if (player.inside && !inside) itis = false;
	if ((inside && !player.inside)) itis = false;
	if (staticc && player.insideStatic != staticc) itis = false;
	if (staticc != player.insideStatic) itis = false;
	if (staticc == player.insideStatic && staticc) itis = true;
	return itis;
}
function loadMapChunk(x, y, inside, staticc) {
	return;
	createMapChunk(x, y, inside, staticc);

	if (!staticc) {
		if (city.map[x] == undefined) return;
		var map = city.map[x][y];
		if (map == undefined) return;
		if (inside) map = city.map[x][y].inside;
	}
	if (staticc) {
		x = player.mapID.x;
		y = player.mapID.y;
		map = staticPlaces[staticc];
	}

	if (!map) return;
	var iv = isMapViewable(x, y, inside, staticc);

	var pos = getMapPos(x, y);
	if (!map.element) return;
	if (iv) {
		map.element.style.display = 'inline-block';
		map.element.style.opacity = 1;
	}
	if (!iv) {
		map.element.style.display = 'none';
		map.element.style.opacity = 0;
	}

	map.element.style.left = pos.left;
	map.element.style.zIndex = x+y;
	map.element.style.top = pos.top;

	if (map.element.parentNode != document.body) document.body.appendChild(map.element);
}
function createMapChunk(x, y, inside, staticc) {
	var mappy;
	if (!staticc) mappy = city.map[x][y];
	if (inside) mappy = mappy.inside;
	if (staticc) mappy = staticPlaces[staticc];
	if (mappy && mappy.element && mappy.element.parentNode == document.body) return;
	var mel = document.createElement('citychunk');

	if (mappy == undefined) return;

	mel.innerHTML = drawLayer(size(MAP_WIDTH, MAP_HEIGHT, MAX_LAYERS), size(24, 48), mappy.map, '', x, y, false);

	var pos = getMapPos(x, y);
	mel.style.left = pos.left;
	mel.style.top = pos.top;
	mel.style.display = 'none';

	mappy.element = mel;
}
function drawTileElement(mapx, mapy, position) {
	position.mapID = {'x': mapx, 'y': mapy};
	var ele = document.createElement('tile');

	var mp = city.map[mapx][mapy].map
	var wh = whatsHere(mp, position);
	ele.className = 'tile '+wh;
	var relpos = getRelativePos(position);
	var opa = 1 / (relpos.distance / 16);
	ele.style.opacity = opa;

	return ele;
}
function displayMap(width, height, layers, worldmap) {
	if (!worldmap) var tiles = getActiveMap();
	if (worldmap) {
		var tiles = [[]];
		for (var w in city.map) {
			tiles[0][w] = [];
			for (var h in city.map[w]) {
				tiles[0][w][h] = 'tile_'+city.map[w][h].type;
			}
		}
	}
	if (player.insideStatic != undefined) {
		if (staticPlaces[player.insideStatic] == undefined) {
			staticPlaces[player.insideStatic] = new Inside(player.insideStatic);
		}
		tiles = staticPlaces[player.insideStatic].map;
	}
	var width = MAP_WIDTH;
	var height = MAP_HEIGHT;
	var layers = MAX_LAYERS;

	loadChunksAround(player);

	for (var sp in staticPlaces) loadMapChunk(0, 0, 0, sp);

	cMap.innerHTML = drawCityMap(city);

	drawLostItems();

	drawPerson(player);

}
function getTimeTileset() {
	if (everyman.time.tileset == undefined) everyman.time.tileset = 'day';
	return everyman.time.tileset;
}
function displayOverlay() {

}
function getRandomDirection() {
	return read(['north', 'south', 'east', 'west']);
}
function districtString(map) {
	return map.districtName+''+'0'+map.sector+'-'+map.type.toUpperCase();
}
function switchTime(type) {
	clearInterval(timer_tp);
	if (type == 'fast') {
		timer_tp = setInterval(function() {timePass(type)}, 25);
	}
	if (type == 'slow') {
		timer_tp = setInterval(function() {timePass(type)}, 1000);
	}
}
function addItemToWarehouse(id, amt) {
	if (everyman.warehouse[id] == undefined) everyman.warehouse[id] = 0;
	everyman.warehouse[id] += amt;

	addToLog('Added '+amt+' x item id '+id+' to warehouse.');
}
function internWork() {
	for (var s in everyman.interns) {
		if (s == 'slave') {
			everyman.interns.com = JSON.parse(JSON.stringify(everyman.interns.slave));
			delete everyman.interns.slave;
			continue;
		}
		for (var i in jobList[s]) {
			if (!everyman.interns[s][i]) everyman.interns[s][i] = 1;
			var interns = everyman.interns[s][i];
			var job = jobList[s][i];

			if (job == undefined) continue;

			var inputList = job.input;
			var outputList = job.output;
			if (!inputList && !outputList) continue;
			var input, output;
			if (inputList != undefined && outputList != undefined) {
				//Input + Output job, 2xinput, 1xoutput
				var input = (interns * 4);
				var output = (interns * 2);
				var stock = 0;
				var objective = inputList.length;
				for (var it in inputList) {
					var id = inputList[it];
					var qty = everyman.warehouse[id];
					if (qty >= input) stock++;
				}
				if (stock >= objective) {
					for (var it in inputList) {
						var id = inputList[it];
						addItemToWarehouse(id, -input);
					}
					for (var it in outputList) {
						var id = outputList[it];
						addItemToWarehouse(id, output);
					}
				}
			}
			if (inputList == undefined && outputList != undefined) {
				//Output only job (2xoutput)
				var output = (interns * 2);
				for (var it in outputList) {
					var id = outputList[it];
					addItemToWarehouse(id, output);
				}
			}

		}
	}
}
function updateInterns() {
	internWork();
	drawWarehouse();
}
function newDayEvents() {
	var rx = rand(1, city.map.length) - 1;
	var ry = rand(1, city.map[0].length) - 1;
	updateBuilding(rx, ry);

	for (var w in city.map) for (var h in city.map[w]) {
		var map = city.map[w][h];
		if (map.lostItems) {
			var total = map.lostItems.length - 1;
			var r = rand(0, total);
			map.lostItems.splice(0, r);
		}
		if (map.trash == undefined) map.trash = [];
		if (map.trash && rand(0,1)) {
			map.trash = [];
		}
	}
}
function immigrantPack(type) {
	var sx = city.map.length;
	var sy = city.map[0].length;
	var size = (sx * sy);
	var immigrantsPerMonth = Math.ceil(size);
	immigrantsPerMonth++;

	var immigrantsPerDay = Math.ceil(immigrantsPerMonth / MONTH_DAYS);
	immigrantsPerDay++;

	var r = 0;
	if (type == 'day') r = rand(0, immigrantsPerDay);
	if (type == 'month') r = rand(0, immigrantsPerMonth);
	for (var im = 0; im < r; im++) addPerson();
}
function displayCrime(guy, peek) {
	var l = '';
	var totalvalue = 0;

	for (var e in guy.crime) {
		var c = guy.crime[e];
		if (c > 0) {
			var fee = round(c * crimes[e].tier);
			l += crimes[e].name+' (Severity: '+crimes[e].tier+') $'+fee+' fee.<br>';
			totalvalue += fee;
		}
	}
	var punishment = (totalvalue * 1000);
	var wanted;
	if (totalvalue < 0) wanted = -1;
	if (totalvalue == 0) wanted = 0;
	if (totalvalue > 0) wanted = Math.ceil(Math.log10(totalvalue) * 1.5) - 1;
	if (wanted > 10) wanted = 10;
	if (wanted < -1) wanted = -1;

	var lastlevel = Math.pow(10, ((wanted) / 1.5));
	var nextlevel = Math.pow(10, ((wanted + 1) / 1.5));
	var percent = (totalvalue - lastlevel) / (nextlevel - lastlevel);

	if (peek == 'fee') return totalvalue;
	if (peek == 'time') return punishment;
	if (peek == 'wanted') return wanted;
	if (peek == 'percent') return percent;

	l += '<hr>Total fees: $'+totalvalue.toFixed(2)+'<br>...or '+duration(punishment * 1000)+' in jail.<br>Wanted radius: '+wanted;
	return l;
}
function tickCrime(guy) {
	for (var c in guy.crime) {
		var crimeTier = crimes[c].tier;
		
		var toreduce = 1 - (0.1 / Math.abs((crimeTier + 1) * (1 + displayCrime(player, 'wanted'))));

		guy.crime[c] *= toreduce;
		guy.crime[c] -= 0.01;


		if (guy.crime[c] <= 0) guy.crime[c] = 0;
	}
}
function transitionTileset(tileset) {
	if (everyman.time.tileset == undefined) everyman.time.tileset = 'day';
	if (!tileset) tileset = everyman.time.tileset;
	var map = getActiveMap();
	$('tile').each(function() {
		$(this).removeClass('day dawn dusk night');
		$(this).addClass(tileset);
	});
}
function tickPregnancy() {
	for (var tp in everyman.peopleList) {
		var p = everyman.peopleList[tp];
		if (everyman.people[p].pregnant) {
			var guy = everyman.people[p];
			guy.pregnantTime++;
			if (guy.pregnantTime >= 9) {
				guy.pregnantTime = 0;
				guy.pregnant = false;
				addPerson(guy.type, guy.mapID.x, guy.mapID.y, guy);
			}
		}
	}
}
function swapDayTileset() {
	//Time hue changes
	var day_tileset = everyman.time.tileset;
	if (everyman.time.hours > 6 && everyman.time.hours < 18) {
		//Day
		if (everyman.time.tileset != 'day') everyman.time.tileset = 'day';
	}
	if (everyman.time.hours == 5 || everyman.time.hours == 6) {
		//Dawn
		if (everyman.time.tileset != 'dawn') everyman.time.tileset = 'dawn';
	}
	if (everyman.time.hours == 18 || everyman.time.hours == 19) {
		//Dusk
		if (everyman.time.tileset != 'dusk') everyman.time.tileset = 'dusk';
	}
	if (everyman.time.hours > 19 || everyman.time.hours < 5) {
		//Night
		if (everyman.time.tileset != 'night') everyman.time.tileset = 'night';
	}
	document.body.className = 'dd_'+everyman.time.tileset;
	//transitionTileset(everyman.time.tileset);
}
function timePass(type) {
	var amt = 1;
	if (type == 'fast') amt = 6;
	if (player.concentration) amt = 60;

	everyman.time.minutes += amt;

	if (isCriminal(player)) tickCrime(player);

	if (everyman.time.minutes >= 60) {
		everyman.time.minutes = 0;
		everyman.time.hours++;

		if (player.working) {
			var ichances = rand(1, player.job.itemChances);
			if (ichances == 1) {
				var rd = read(getDropsForJob(player.job));
				if (rd) addItemToInventory(rd, 1);
				if (lastDrops[rd] == undefined) lastDrops[rd] = 0;
				lastDrops[rd]++;
			}
		}

		var rx = rand(1, city.map.length) - 1;
		var ry = rand(1, city.map[0].length) - 1;
		if (rx > 0 && ry > 0) lostItem(rx, ry);

		for (var p in everyman.people) {
			var pg = everyman.people[p];
			if (pg.working && pg.job && pg.job.dueHours < 0) pg.working = false;
			if (pg.sleeping) sleepy(pg, amt);
			if (pg.sleeping && pg.energy >= (pg.energyx * 0.9)) pg.sleeping = false;

			if (pg.job == undefined) person.job = new Job(person.mapID.x, person.mapID.y);

			if (pg.working) tickWork(pg, 1);
		}

		swapDayTileset();


		addRandomItemToTrash();
		updateInterns();
	}
	if (everyman.time.hours >= 24) {
		everyman.time.hours = 0;
		everyman.time.day++;

		if (player.job != undefined) {
			player.job.dueHours += player.job.workhours;
			player.job.end = false;
		}
		for (var p in everyman.people) {
			var pp = everyman.people[p];
			if (pp.job != undefined) {
				pp.job.dueHours += pp.job.workhours;
				pp.job.end = false;
			}
		}

		immigrantPack('day');

		newDayEvents();
	}
	if (everyman.time.day >= MONTH_DAYS) {
		everyman.time.day = 1;
		everyman.time.month++;

		immigrantPack('month');

		tickPregnancy();

		expandCity(city);
	}
	if (everyman.time.month >= YEAR_MONTHS) {
		everyman.time.month = 1;
		everyman.time.year++;

		for (var p in everyman.people) {
			if (everyman.people[p].age == undefined) everyman.people[p].age = rand(0, 100);
			everyman.people[p].age++;
		}
	}
	if (player.working) {
		tickWork(player, (amt/60));
		updateWork();
	}
	if (player.sleeping) {
		sleepy(player, (amt/60));
		if (player.energy >= (player.energyx * 0.9)) {
			player.sleeping = false;
			$('#sleeper').fadeOut(100);
			switchTime('slow');
		}
	}
	tickPeopleStats(amt);
	updateHUD();
}
function to1(num) {
	num = Math.floor(num * 100);
	var tier = num.toString().length - 1;
	return (Math.floor(num / Math.pow(10, tier)) * Math.pow(10, tier) / 100);
}
function updateMoney() {
	var abs = (Math.abs(moneyticker - player.money));
	if (moneyticker > player.money) moneyticker -= to1(abs)
	if (moneyticker < player.money) moneyticker += to1(abs)

	money_display.className = (moneyticker < 0) ? 'danger2' : 'safe';
	var dollar = (moneyticker < 0) ? '-$' : '$';
	money_display.innerHTML = dollar+Math.abs(moneyticker).toFixed(2);
}
function updateHUD() {
	display_holder.className = (displayCrime(player, 'wanted') > 0) ? 'wanted' : '';
	var datclass = 'dd_night';
	if (everyman.time.hours >= 5) datclass = 'dd_dawn';
	if (everyman.time.hours >= 6) datclass = 'dd_day';
	if (everyman.time.hours >= 18) datclass = 'dd_dusk';
	if (everyman.time.hours >= 19) datclass = 'dd_night';
	date_display_hour.innerHTML = displayHour();
	date_display_date.innerHTML = displayDate(everyman.time);
	date_display.className = datclass;

	time_display.innerHTML = getPlayerStats();
}
function displayHour() {
	return zeroPad(everyman.time.hours, 2, true)+':'+zeroPad(everyman.time.minutes, 2, true);
}
function getHighestCrime(guy) {
	var highest = 0;
	var highestid = -1;
	for (var c in guy.crime) {
		var crime = guy.crime[c];
		if (crime && crime > highest) {
			highest = crime;
			highestid = c;
		}
	}
	return highestid;
}
function changeKarma(guy, amt, peek) {
	if (!guy.karma) guy.karma = 0;
	if (peek) {
		if (guy.karma < 0) return ' <span class="danger2"> Karma: '+round(guy.karma)+'</span>';
		if (guy.karma > 0) return ' <span class="safe"> Karma: '+round(guy.karma)+'</span>';
		if (guy.karma == 0) return ' <span> Karma: '+round(guy.karma)+'</span>';
	}
	guy.karma += amt;
	if (guy.karma > 10) guy.karma = 10;
	if (guy.karma < -10) guy.karma = -10;
}
function getPlayerStats() {
	var sl = '';

	sl = '<div style="float: left; width: 200px;"> '+changeKarma(player, 0, 1)+
	'<br><span class="item" style="background-position: -210px -45px"></span> <span>'+getWantedLevel()+'</span>';

	if (!sl) doc('wrapper').className = '';
	if (player.hygiene == undefined) player.hygiene = 100;
	return '<div style="float: left; width: 100px;"><span class="item" style="background-position: -120px -45px"></span><meter value="'+player.health.toFixed(0)+'" max="'+player.healthx+'"></meter><br>'+
	'<span class="item" style="background-position: -30px -45px"></span><meter value="'+player.hunger.toFixed(0)+'" max="'+player.hungerx+'"></meter></div>'+
	'<div style="float: left; width: 100px;"><span class="item" style="background-position: -150px -45px"></span><meter value="'+player.energy.toFixed(0)+'" max="'+player.energyx+'"></meter><br>'+
	'<span class="item" style="background-position: -180px -45px"></span><meter value="'+player.hygiene.toFixed(0)+'" max="'+player.hygienex+'"></meter></div>'+sl;
}
function getPopulation() {
	var npcs = everyman.peopleList.length;
	var totalinterns = 0;
	for (var s in everyman.interns) for (var i in everyman.interns[s]) {
		totalinterns += everyman.interns[s][i];
	}
	return npcs + totalinterns;
}
function displayDate(date) {
	return zeroPad(date.day, 2, true)+'/'+getMonthName(date.month)+'/'+date.year;
}
function tickPersonStats(person, peek, minutes) {
	if (minutes == undefined) minutes = 1;
	if (person.energy == undefined) person.energy = 100; if (person.hunger == undefined) person.hunger = 100; if (person.health == undefined) person.health = 100;
	var dayfraction = (minutes / (60 * 24));

	if (person != player) {
		if (person.hunger < 25) {
			var ritem = getRandomFoodItem(1);
			var it = itemList[ritem];
			var rprice = it.price;
			if (person.money >= rprice) {
				person.money -= rprice;

				if (it.health) healGuy(person, 'health', it.health);
				if (it.hunger) healGuy(person, 'hunger', it.hunger);
				if (it.energy) healGuy(person, 'energy', it.energy);
			}
		}
	}

	var maxedrain = (dayfraction * 100);
	if (person.sleeping) maxedrain *= 0;

	var maxhdrain = (dayfraction * 50);
	if (person.sleeping) maxhdrain *= 0.5;

	var maxvdrain = (dayfraction * 33);

	if (person.concentration) {
		maxedrain *= 1.5;
		maxhdrain *= 1.5;
		maxvdrain *= 1.5;
	}

	if (peek) return {'edrain': maxedrain, 'hdrain': maxhdrain, 'vdrain': maxvdrain};

	healGuy(person, 'energy', -maxedrain);
	healGuy(person, 'hunger', -maxhdrain);
	if (person.energy <= 0) {
		person.energy = 0;
		if (person == player && rand(0,1)) {
			closeNotice();

			person.energy = 100;
			person.health -= 25;
			person.hunger -= 25;
			showNotice('Welcome Back!', 'Seems that you have fainted. Don\'t work until late night or this will happen again.<br><b>Take care of yourself next time and remember to sleep well!</b>')
			enterStaticBuilding('hospital');

			saveGame();
		}
	}
	if (person.hunger <= 0) {
		person.hunger = 0;
		var maxdrain = (person.energy > 25) ? 1 : 2;
		maxvdrain *= maxdrain;
		healGuy(person, 'health', -maxvdrain);
	}
	if (person.health <= 0 && person != player) {
		person.deathStrikes += rand(0,1);
		person.health = person.healthx;
		if (rand(0,1)) {
			makeIntern(person.id);
			return;
		}
		if (person.deathStrikes >= 3) {
			killPerson(person.id, 'starved to death');
			return;
		}
	}
	if (person.health <= 0 && person == player) {
		closeNotice();
		person.deathStrikes += rand(0,1);
		if (person.deathStrikes >= 3) {
			showNotice('Welcome to the Afterlife', "Uh oh, seems like you died. But don't worry, the afterlife is half-coded, so enjoy your fresh new life again! (Just go to the exit and you will respawn where you died.)");
			enterStaticBuilding('dream');
			person.deathStrikes = 0;
			person.health = 100;
			return;
		}

		person.health = person.healthx
		person.energy = person.energyx
		person.hunger = person.hungerx
		var comma = rand(player.age, player.age*2) + 1;
		everyman.time.day += comma;
		showNotice('Welcome Back!', 'Due to your poor health condition. You entered into a comma that lasted '+comma+' days.<br><b>Take care of yourself next time and remember to eat well!</b>')
		enterStaticBuilding('hospital');

		saveGame();
	}
	if (person.hygiene <= 0 && rand(0,1) && addStatus(person, -1, peek)) {

	}

	for (var h in person.homes) {
		checkHomeRent(person.homes[h]);
	}
}
function Status(obj) {
	this.name = obj.name;
	this.minutes = obj.minutes;
	this.effect = obj.effect;
	this.condition = obj.condition;
	this.strength = 1;
}
function addStatus(guy, status, peek) {
	if (guy.status == undefined) guy.status = [];
	if (guy.status.length <= 5 && peek) return true;
}
function tickPeopleStats(mins) {
	for (var p in everyman.people) {
		var person = everyman.people[p];
		tickPersonStats(person, false, mins);
	}

	tickPersonStats(player, false, mins);
}
function buildCity(city) {
	for (var e in city.map) {
		for (var d in city.map[e]) {
			var type = city.map[e][d].type;
			if (type != 'sea' && type != 'void' && type != 'par') beautifyTile(e, d);
		}
	}
	for (var e in city.map) {
		for (var d in city.map[e]) {
			var type = city.map[e][d].type;
			if (type != 'sea' && type != 'void' && type != 'par') buildBuilding(e, d);
		}
	}
}
function getMonthName(month) {
	return ['', 'Spring', 'Summer', 'Autumn', 'Winter'][month];
}
function killPerson(id, cause) {
	var ixof = everyman.peopleList.indexOf(id);
	if (everyman.graveyard == undefined) everyman.graveyard = [];
	if (!cause) cause = 'disappeared';

	var guy = everyman.people[id];

	everyman.graveyard.push({'name': guy.name, 'causeOfDeath': cause, 'family': guy.family, 'age': guy.age, 'job': {'type': guy.job.type, 'id': guy.job.id}});

	var el = everyman.people[id].element;
	el.style.opacity = 0;
	document.body.removeChild(el);

	everyman.peopleList.splice(ixof, 1);
	delete everyman.people[id];


	getPolicemen();
}
function canAnNPCWalk(x, y, peek, carmode) {
	var lay1min = 2;
	var lay1max = 5;

	var lay2min = 17;
	var lay2max = 20;
	var turns = [];

	if (carmode) {
		var lay1min = 1; var lay1max = 1;
		var lay2min = 21; var lay1max = 21;

		if (peek) {
			turns.push([1, 1]);
			turns.push([1, 21]);
			turns.push([21, 1]);
			turns.push([21, 21]);
		}
	}
	if (peek) {
		for (var x = 0; x < MAP_WIDTH; x++) for (var y = 0; y < MAP_WIDTH; y++) {
			if (((y >= lay1min && y <= lay1max) || (x >= lay1min && x <= lay1max)) && ((y >= lay2min && y <= lay2max) || (x >= lay2min && x <= lay2max))) {
				if ((x + y) == 22) turns.push({'x': x, 'y': y});
			}
		}
		return turns;
	}
	if ((x + y == 22) && (x == lay1min || x == lay1max || x == lay2min || x == lay2max)) return 'turn';
	if ((y >= lay1min && y <= lay1max) || (x >= lay1min && x <= lay1max)) return 'walk';
	if ((y >= lay2min && y <= lay2max) || (x >= lay2min && x <= lay2max)) return 'walk';
	return false;
}
function nearestTurn(guy) {

}
function getBestMove(from, to) {
	var lowest = {'dir': 'center', 'dist': Infinity}
	var dirs = ['north', 'east', 'south', 'west'];
	dirs.push(read(dirs));

	for (var d in dirs) {
		var dir = dirs[d];
		var h = hypoToDirection(from, dir);
		if (h.status == 'thump') continue;
		var dist = distance(h, to);
		if (dist <= lowest.dist) lowest = {'dir': dir, 'dist': dist};
	}

	return lowest;
}
function hypoToDirection(from, dir) {
	var pointer = {'x': from.x, 'y': from.y, 'z': from.z, 'mapID': {'x': from.mapID.x, 'y': from.mapID.y}};
	pointer.status = moveGuy(pointer, dir);
	return pointer;
}
function sdistance(from, to) {
	var dx = Math.abs(from.x - to.x);
	var dy = Math.abs(from.y - to.y);
	return (dx + dy);
}
function distance(from, to) {
	var tmx = (to.mapID) ? to.mapID.x : from.mapID.x;
	var tmy = (to.mapID) ? to.mapID.y : from.mapID.y;
	var distancex = Math.abs(((from.mapID.x * MAP_WIDTH) + from.x) - ((tmx * MAP_WIDTH) + to.x));
	var distancey = Math.abs(((from.mapID.y * MAP_HEIGHT) + from.y) - ((tmy * MAP_HEIGHT) + to.y));

	return distancex + distancey;
}
function tickWork(guy, hours) {
	//TODO Hacer que los NPC produzcan cosas
	//TODO Al spawnear un NPC, hacer que tenga un horario de trabajo y de sueño. Aleatorio.
	//     empieza una hora aleatoria del 0 al 23. Y dura 8 horas
	//     durante ese tiempo, el npc estará durmieno o trabajando de forma obligada
	//     se dará prioridad al sueño y luego al trabajo
	guy.job.workedHours += hours;
	if (guy.job.production == undefined) guy.job.production = 0;
	var canProduce = produce(guy, true);
	if (canProduce) guy.job.production += hours;
	if (guy.job.production >= 0 && canProduce) produce(guy);
	guy.job.dueHours -= hours;
	var ch = getCheck(guy.job);
	if (ch.nextPaycheck >= 0) {
		payCheck(guy);
	}
}
function produce(guy, peek) {
	var job = guy.job;
	if (guy.job.type == 'slave') guy.job.type = 'com';
	var jobObject = jobList[job.type][job.id];
	var inputList = jobObject.input;
	var outputList = jobObject.output;
	if (peek && (inputList || outputList)) return true;

	if (job.production < 1) return;
	job.production--;

	if (jobObject == undefined) return;

	addToLog('Production by '+guy.id+' the '+getMyJobName(guy)+' inputList '+inputList.length+' outputList '+outputList.length);



	if (!inputList && !outputList) return;
	var input, output;
	if (inputList == undefined && outputList == undefined) job.production -= 10;
	if (inputList != undefined && outputList != undefined) {
		//Input + Output job, 2xinput, 1xoutput
		addToLog('Input + Output');
		var input = 1;
		var output = 2;
		var stock = 0;
		var objective = inputList.length;
		for (var it in inputList) {
			var id = inputList[it];
			var qty = everyman.warehouse[id];
			if (qty >= input) stock++;
		}
		if (stock >= objective) {
			for (var it in inputList) {
				var id = inputList[it];
				addItemToWarehouse(id, -input);
			}
			for (var it in outputList) {
				var id = outputList[it];
				addItemToWarehouse(id, output);
			}
		}
	}
	if (inputList == undefined && outputList != undefined) {
		//Output only job (2xoutput)
		addToLog('Output only');
		var output = (interns * 2);
		for (var it in outputList) {
			var id = outputList[it];
			addItemToWarehouse(id, output);
		}
	}

	drawWarehouse();
}
function getWantedLevel() {
	if (!policemenCount) getPolicemen();
	var wl = displayCrime(player, 'wanted');
	var wp = displayCrime(player, 'percent');

	var wclass = 'safe';
	if (wl > 0) wclass = 'danger1';
	if (wl > 2) wclass = 'danger2'
	if (wl > 5) wclass = 'danger3';
	if (wl > 8) wclass = 'mostwanted';
	if (wl < 0) wclass = 'c_com';
	var hc = getHighestCrime(player);
	hc = (hc >= 0) ? crimes[hc].name : '';
	var level = wantedLevels[wl];
	if (wl < 0) level = 'Heroic';
	return '<span class="'+wclass+' outlaw" title="'+hc+'"><meter value="'+wp+'" min="0" max="1"></meter> '+level+' ('+wl+')</span>';
}
function getPolicemen() {
	var c = 0;
	var polist = [];
	for (var p in everyman.people) {
		var guy = everyman.people[p];
		if (isPolice(guy)) {
			c++;
			polist.push(guy);
		}
	}
	activePolicemen = polist;
	policemenCount = c;
	return c;
}
function isPolice(guy) {
	if (guy.job && guy.job.type == 'com' && guy.job.id == 0 && guy.age >= 18 && guy.age < 55 && !guy.working && !guy.sleeping) return true;
}
function isBadGuy(guy) {
	if (guy.job && guy.job.type == 'slum' && guy.age >= 18 && guy.age < 55 && !guy.working && !guy.sleeping) return true;
}
function tickPolice() {
	var isPlayerWanted = displayCrime(player, 'wanted');
	ticker++;
	totalticker += TICK_PEOPLE_INTERVAL;
	if (ticker >= everyman.peopleList.length) {
		ticker = 0;

		$('#loader').fadeOut(200);
	}

	var purson = everyman.people[everyman.peopleList[ticker]];
	drawPerson(purson);

	var canTick = false;
	if (!purson) return;
	var relpos = getRelativePos(purson, player);
	if (purson.mapID.x >= (player.mapID.x - 1) && purson.mapID.x <= (player.mapID.x + 1) && purson.mapID.y >= (player.mapID.y - 1) && purson.mapID.y <= (player.mapID.y + 1)) canTick = true;
	if (isPlayerWanted && isPolice(purson) && rand(0,1)) canTick = true;
	var force = false;
	if (rand(1, 100) == 1) {
		canTick = true;
		force = true;
	}
	if (canTick) {
		tickPeople(everyman.peopleList[ticker], force);
	}

	info.innerHTML = '';
}
function sleepy(guy, hours) {
	var h = (hours/8) * guy.energyx;
	healGuy(guy, 'energy', h);
}
function getNearestTurn(guy) {
	if (NPCTurns.length <= 0) NPCTurns = canAnNPCWalk(0, 0, 1);
	if (CarTurns.length <= 0) CarTurns = canAnNPCWalk(0, 0, 1, 1);
	var arr = (guy.car) ? CarTurns : NPCTurns;
	var lowest = {'x': -1, 'y': -1, 'distance': Infinity};
	for (var t in arr) {
		var turn = arr[t];
		var d = distance(guy, turn);
		if (d < lowest.distance) lowest = {
			'x': turn.x, 'y': turn.y, 'mapID': {'x': guy.mapID.x, 'y': guy.mapID.y}, 'distance': d,
		}
	}
	return lowest;
}
function tickPeople(id, force) {
	if (!everyman) return;
	if (player.hold) return;

	var person = everyman.people[id];
	if (person == undefined) return;
	var d = new Date();
	
	if (person.lastMove > (totalticker * 10) || force) person.lastMove = (totalticker - 1);

	if (totalticker < person.lastMove) {
		return;
	}
	var m = 500;
	if (person.car) m = 20;
	var pcrime = displayCrime(player, 'wanted');
	if (isPolice(person) && pcrime > 0) {
		m -= (pcrime * 40);
	}
	person.lastMove = totalticker + m;

	//Move guy
	var canwalk = canAnNPCWalk(person.x, person.y, undefined, person.car);
	if (canwalk == 'turn') {
		person.facing = rand(0,3);
		if (person.car) {
			var possibleTurns = [];
			if (person.x == 1) possibleTurns.push(2);
			if (person.x == 21) possibleTurns.push(0);
			if (person.y == 1) possibleTurns.push(1);
			if (person.y == 21) possibleTurns.push(3);
		}
		person.forceTurn = false;
	}

	var dir = directionNames[person.facing];
	var lastx = person.x;
	var lasty = person.y;

	if (!canwalk || person.target || person.forceTurn) {
		var tgt = getNearestTurn(person);
		if (person.target == undefined) person.target = tgt;
		var bm = getBestMove(person, person.target);
		dir = bm.dir;
	}

	//Only for policemen
	if (isPolice(person)) {
		if (displayCrime(player, 'wanted') != 0) {
			var wanted = (displayCrime(player, 'wanted') * (MAP_WIDTH / 2));
			if (wanted < 10) wanted = 10;
			var dist = distance(person, player);
			if (wanted >= dist) {
				var bm = getBestMove(person, player);
				dir = bm.dir;
				wantedOfficers[person.id] = bm.dist;
				if (bm.dist == 1 && person.inside == player.inside && !person.working && !person.sleeping && !player.insideStatic) arrest(player, person);
			}
			else {
				if (wantedOfficers[person.id]) delete wantedOfficers[person.id];
			}
		}
	}

	moveGuy(person, dir);

	if (person.target) {
		var distotarget = distance(person, person.target);
		if (distotarget <= 1) person.target = undefined;
	}

	if (lastx == person.x && lasty == person.y) person.forceTurn = true;

	if (!person.mapID) person.mapID = {
		'x': 2,
		'y': 2,
	}
}
function randomAvailableGuy() {
	var guys = [];
	var radius = 0;
	for (var g in everyman.people) {
		var guy = everyman.people[g];
		if (guy.mapID.x >= (player.mapID.x - radius) && guy.mapID.x <= (player.mapID.x + radius) && guy.mapID.y >= (player.mapID.y - radius) && guy.mapID.y <= (player.mapID.y + radius)) guys.push(g);
	}
	return guys;
}
function whatsInFrontOf(guy) {
	var map = getActiveMap();
	var look = {'x': guy.x, 'y': guy.y};
	var fac = directionNames[guy.facing];
	if (fac == 'north') look.y--;
	if (fac == 'south') look.y++;
	if (fac == 'east') look.x++;
	if (fac == 'west') look.x--;

	var upfront = map[2][look.y][look.x];

	var guys = randomAvailableGuy();
	var guyfront;
	for (var g in guys) {
		var check = everyman.people[guys[g]];
		if (check.x == look.x && check.y == look.y) guyfront = guys[g];
	}
	var item;
	var mappy = city.map[player.mapID.x][player.mapID.y];
	for (var li in mappy.lostItems) {
		var litem = mappy.lostItems[li];
		if (litem.x == look.x && litem.y == look.y) item = litem;
	}

	return {'upfront': upfront, 'guyfront': guyfront, 'frontcoords': look, 'item': item};
}
function enterBuilding(guy) {
	var map = city.map[guy.mapID.x][guy.mapID.y];
	if (!map.inside) return;
	guy.inside = true;
    guy.outsideCoords = {'x': guy.x, 'y': guy.y};
    guy.x = 2;
    guy.y = 22;

    displayMap();
}
function isHome(player, mapx, mapy) {
	for (var h in player.homes) {
		var home = player.homes[h];
		if (home.x == mapx && home.y == mapy) return home;
	}
	return false;
}
function buyHome(x, y) {
	var home = new Home(x, y);
	if (isHome(player, x, y)) return;
	if (player.money >= home.price) {
		player.money -= home.price;
		home.bought = true;
		player.homes.push(home);
		showNotice('You have a new home!', 'Forget about the rent. It is paid!<br>You may now enter your new home by pressing SPACE in front of this door.');
	}
}
function rentHome(x, y) {
	var home = new Home(x, y);
	if (isHome(player, x, y)) return;
	if (player.money >= home.entryPrice) {
		player.money -= home.entryPrice;
		player.homes.push(home);

		showNotice('You have a new home!', 'Remember to pay the rent!<br>You may now enter your new home by pressing SPACE in front of this door.');
	}
}
function applyJob(x, y) {
	player.job = new Job(x, y);
	player.job.dueHours += player.job.workhours;

	startWorking();
}
function getDropsForJob(job, ret) {
	var j = jobList[job.type][job.id];
	var drops = [];
	if (j.output != undefined) for (var i in j.output) drops.push(j.output[i]);

	if (ret) for (var d in drops) drops[d] = itemList[drops[d]].name;

	return drops;
}
function askWork(job) {
	notice_header.innerHTML = 'Work at '+getTypeOfMap(city.map, job.x, job.y).toUpperCase()+'-'+city.map[job.x][job.y].districtName;

	notice_msg.innerHTML = '<b>Job ('+jobList[job.type][job.id].name+')</b><br>';
	if (job.type == 'slum') notice_msg.innerHTML += '<b class="illegal">This job is illegal. You may be sent to jail for working here.</b><br>';
	notice_msg.innerHTML += 'Salary (per hour): $'+job.baseSalary.toFixed(2)+'<br>';
	notice_msg.innerHTML += 'Work Hours (day): '+job.workhours+'h<br>';
	notice_msg.innerHTML += 'Pay Day every '+job.payday+' days<br>';

	var drops = getDropsForJob(job, 1);
	if (drops.length > 0) {
		notice_msg.innerHTML += 'Item drop chances: '+(100 * (1 / job.itemChances))+'% each hour.<br>';
		notice_msg.innerHTML += 'Possible drops: <b>'+drops.join('</b>, <b>')+'</b><br><br>';
	}

	notice_msg.innerHTML += '<div class="btn btn-primary" onclick="applyJob('+job.x+', '+job.y+')">Apply for this Job</div>';

	sNotice();
}
function quitJob(guy) {
	payCheck(guy.job);
	onPlayerNotification('You have been fired!');
	closeNotice();
	guy.job = undefined;
}
function askRent(home) {
	notice_header.innerHTML = 'Pay the Rent!';

	notice_msg.innerHTML = '<b>Rent</b><br>';
	notice_msg.innerHTML += 'Amount due: $'+round(home.due)+'<br>';
	notice_msg.innerHTML += 'Time left to pay the rent: '+round(getDateValue(everyman.time) - getDateValue(home.nextDueDate))+' days.<br>';
	notice_msg.innerHTML += '<div class="btn btn-success" onclick="payRent('+home.x+', '+home.y+')">Pay Now</div>';
	notice_msg.innerHTML += '<div class="btn btn-default" onclick="closeNotice()">Dismiss This Message</div>';

	sNotice();
}
function payRent(x, y) {
	for (var h in player.homes) {
		var home = player.homes[h];
		if (home.x == x && home.y == y) {
			var due = home.due;
			if (player.money <= due) due = player.money;
			player.money -= due;
			home.due -= due;
		}
	}
}
function askBuy(home) {
	var type = getTypeOfMap(city.map, home.x, home.y);
	notice_header.innerHTML = 'Rent/Buy home at '+type.toUpperCase()+'-'+city.map[home.x][home.y].districtName;


	notice_msg.innerHTML = '<b>Rent</b><br>';
	if (type != 'fir' && type != 'res') {
		notice_msg.innerHTML += 'Price (Rent): $'+home.rent+'/month<br>';
		notice_msg.innerHTML += 'Entry Price (Rent): $'+home.entryPrice+'<br>';
		notice_msg.innerHTML += 'Next due date (Rent): '+displayDate(home.nextDueDate)+'<br>';
		var bclass = (player.money >= home.entryPrice) ? 'btn-primary' : 'btn-danger';
		notice_msg.innerHTML += '<div class="btn '+bclass+'" onclick="rentHome('+home.x+', '+home.y+')">Rent Home ($'+round(home.entryPrice)+')</div><br><br>';
	}
	else {
		notice_msg.innerHTML += '<i>Unavailable</i><br><br>';
	}

	notice_msg.innerHTML += '<b>Buy</b><br>';
	if (type != 'slum') {
		notice_msg.innerHTML += 'Price (Buy): $'+home.price+'<br>';
		notice_msg.innerHTML += 'Neighborhood value: '+getHouseValue(home.x, home.y, 'neighborhood')+'<br>';
		notice_msg.innerHTML += 'Building value: '+getHouseValue(home.x, home.y, 'floormod')+'<br>';
		var bclass = (player.money >= home.price) ? 'btn-primary' : 'btn-danger';
		notice_msg.innerHTML += '<div class="btn '+bclass+'" onclick="buyHome('+home.x+', '+home.y+')">Buy Home ($'+round(home.price)+')</div><br><br>';
		notice_msg.innerHTML += '';
	}
	else {
		notice_msg.innerHTML += '<i>Unavailable</i><br><br>';
	}

	sNotice();
}
function updateWork() {
	if (player.energy < 10) {
		player.working = false;
		switchTime('slow');
		onPlayerNotification('You are too tired to work. Go to sleep.')
		closeNotice();
		return;
	}
	var ch = getCheck(player.job);
	notice_msg.innerHTML = '<b>Job Info</b><br>';
	notice_msg.innerHTML += 'Job: '+jobList[player.job.type][player.job.id].name+' ('+player.job.level+')<br>';
	notice_msg.innerHTML += 'Salary (per hour): $'+player.job.baseSalary.toFixed(2)+'<br>';
	notice_msg.innerHTML += 'Work hours/day: '+player.job.workhours+'<br>';
	notice_msg.innerHTML += 'Payday every '+player.job.payday+' days<br>';

	var drops = getDropsForJob(player.job, 1);
	if (drops.length > 0) {
		notice_msg.innerHTML += 'Item drop chances: '+(100 * (1 / player.job.itemChances))+'% each hour.<br>';
		notice_msg.innerHTML += 'Possible drops: <b>'+drops.join('</b>, <b>')+'</b><br><br>';
	}


	notice_msg.innerHTML += '<b>Salary Info</b><br>';
	if (player.job.dueHours > 0) notice_msg.innerHTML += 'Hours left today: '+ch.worked.toFixed(1)+'/'+ch.objective+' ('+(100 * ch.efficiency).toFixed(2)+'% Efficiency)<br>';
	if (player.job.dueHours <= 0) {
		var min = getHourObjective(player);
		var max = 1;
		notice_msg.innerHTML += '<b>Next Raise</b><br>';
		if (min >= max) {
			notice_msg.innerHTML += '<bar><filled class="boldy" style="background: black; width: 100%"><b>RAISE IMMINENT</b></filled></bar><br>';
		}
		else {
			notice_msg.innerHTML += '<bar><filled style="width: '+((min/max)*100)+'%"><iii class="boldy">'+((min/max)*100).toFixed(3)+'%</iii></filled></bar><br>';
		}
	}
	if (ch.extra) notice_msg.innerHTML += 'Worked extra hours: '+ch.extra.toFixed(1)+'<br>';

	if (player.job.payday > 0) {
		var pd = player.job.payday;
		var p = ch.nextPaycheck + pd;
		var per = ((p / pd) * 100);
		notice_msg.innerHTML += '<b>Next Paycheck ($'+(ch.baseSalary).toFixed(2)+')</b><br>';
		notice_msg.innerHTML += '<bar><filled style="background: linear-gradient(rgb(0, 128, 255), rgb(0, 255, 255)); width: '+per+'%"><iii class="boldy">'+per.toFixed(3)+'%</iii></filled></bar><br>';

		if (!player.concentration) notice_msg.innerHTML += '<div class="btn btn-warning" onclick="activateConMode()">Concentration Mode</div> Warning: Unexpected results!';
	}

	if (lastDrops.length > 0) notice_msg.innerHTML += displayDrops();


	if (ch.nextPaycheck >= 0 && player.job.payday > 0) {
		var ef = ch.efficiency;
		if (ef >= 0.8) payCheck(player);
		if (ef < 0.8) quitJob(player);
	}
}
function activateConMode() {
	player.concentration = true;
}
function payCheck(guy) {
	var job = guy.job;

	var ch = getCheck(job);

	var check = round(ch.baseSalary);
	guy.money += check;
	var g = (job.workedHours > job.workhours);

	if (guy.job.type == 'slum') addCrime(player, 3, check);

	guy.job.workedHours = 0;
	guy.job.nextPaycheck = new EMDate(guy.job.payday, 0, 0);

	
	var eg = (g) ? 'Good Job! ': '';

	if (guy == player) notification(eg+'You have been paid $'+check+' for your work.');

	var level = job.level;
	var c = 0;

	var objective = getHourObjective(guy);


	if (objective >= 1) {
		job.dueHours += getHourObjective(guy, 1);
		var oldsalary = job.baseSalary;
		upgradeJob(job);
		if (guy == player) notification('You have been raised! $/hour: '+oldsalary.toFixed(2)+'->'+job.baseSalary.toFixed(2));
	}
}
function getHourObjective(guy, peek) {
	var level = guy.job.level;
	var obj = (level * 9.4);
	if (peek) return obj;
	var extra = guy.job.dueHours;
	if (extra > 0) return 0;
	if (extra < 0) extra = Math.abs(extra);

	return extra / obj;
}
function doWork() {
	notice_header.innerHTML = 'You are working';
	notice_msg.innerHTML = 'Worked hours: ';


	sNotice();
}
function sNotice() {
	notice.style.display = 'inline-block';
	notice_closer.style.display = 'inline-block';
}
function closeNotice() {
	$('#notice').fadeOut(200);
	$('#notice_closer').fadeOut(200);
	switchTime('slow');
	player.working = false;
	player.hold = false;
	player.concentration = false;
}
function startWorking() {
	switchTime('fast');
	player.working = true;
	doWork();
}
function getJobById(sector, id) {
	return jobList[sector][id];
}
function getJobShop(job) {
	if (!job) return [];
	var job = jobList[job.type][job.id];
	var shop = job.shop;

	var shoppy = [];
	if (shop == undefined) return shoppy;
	for (var s in shop) {
		var shopid = shop[s];
		if (everyman.warehouse[shopid] == undefined) everyman.warehouse[shopid] = 0;
		shoppy[shopid] = everyman.warehouse[shopid];
	}
	return shoppy;
}
function getShop(mapx, mapy, npcmode) {
	var map = city.map[mapx][mapy];
	if (map.jobID == undefined) getJobId(mapx, mapy);
	var id = map.jobID;
	var sec = getJobSalary(mapx, mapy, 'type');
	var job = getJobById(sec, id);
	var shop = job.shop;
	var shoppy = [];
	if (shop == undefined) return shoppy;
	for (var s in shop) {
		var shopid = shop[s];
		if (everyman.warehouse[shopid] == undefined) everyman.warehouse[shopid] = 0;
		shoppy[shopid] = everyman.warehouse[shopid];
	}
	return shoppy;
}
function whatJobHere(mapx, mapy) {
	var id = getJobId(mapx, mapy);
	return getJobById(getJobSalary(mapx, mapy, 'type'), city.map[mapx][mapy].jobID);
}
function checkDrugs() {
	//4 = drugs, 5 = illegal items
	var drugValue = 0;
	var illegalValue = 0;
	for (var i in player.inventory) {
		var amt = player.inventory[i];
		var item = itemList[i];
		if (item.drug) drugValue += (item.price * amt);
		if (item.illegal) illegalValue += (item.price * amt);
	}
	addCrime(player, 4, drugValue, true);
	addCrime(player, 5, illegalValue, true);
}
function showInventory(variation, guyid) {
	//TODO - Añadir al lado de cada objeto, un botón que diga tirar 1, tirar 10, tirar la mitad, tirar todo (en basuras)
	//TODO - Añadir nuevas formas de almacenamiento, tal vez un objeto en cada mapa de la ciudad, que diga 'tile_bin': [objetos dentro], 'tile_fridge': [objetos dentro] etc
	//TODO - Mejorar inventario. Mostrar una lista de objetos con su respectivo icono, y su cantidad arriba (al hacer hover, mostrar el nombre) y poder acceder a ellos para más opciones (tirar etc)
	//TODO - Que las opciones aparezcan como un menú contextual
	if (player.inventory == undefined) player.inventory = [];
	var itory = '';
	var inventoryObj = player.inventory;
	if (variation == 'shop') {
		inventoryObj = getShop(player.mapID.x, player.mapID.y);
	}

	if (variation == 'npcshop') {
		var guyObject = everyman.people[guyid];
		var job = guyObject.job;
		inventoryObj = getJobShop(job);
	}

	for (var i in inventoryObj) if (inventoryObj[i] > 0 || variation == 'shop' || variation == 'npcshop') itory += displayItem(i, inventoryObj[i], variation, guyid)+'<br>';
	notice_header.innerHTML = 'Inventory';
	var vendor = '';
	if (variation == 'shop') vendor = whatJobHere(player.mapID.x, player.mapID.y).name;
	if (variation == 'shop') notice_header.innerHTML = 'Shop ('+vendor+')';
	if (variation == 'npcshop') {
		vendor = jobList[job.type][job.id];
		notice_header.innerHTML = guyObject.name+"'s shop ("+vendor.name+")";
	}
	var bef = '';
	if (variation == 'throw') {
		notice_header.innerHTML = 'Trash Bin';
		bef = '<i>Click any item to delete it permanently.</i><br>';
	}
	notice_msg.innerHTML = bef+itory;

	if (variation == 'throw') {
		notice_msg.innerHTML += '<hr>Click any item to retrieve it.<br>'+getTrashItems(player.mapID.x, player.mapID.y)+'<br><br><br><br><br>';
	}
	if (variation == 'shop') {
		notice_msg.innerHTML += '<hr><div class="btn btn-danger" onclick="stealShop()">Rob the '+vendor+'</div>';
	}

	sNotice();
}
function getRandomJob() {
	var types = [];
	for (var t in jobList) types.push(t);
	var type = read(types);
	var id = rand(1, jobList[type].length) - 1;
	return {'type': type, 'id': id}
}
function getRandomShopItem(x, y) {
	var shop = getShop(x, y);
	var items = [];
	for (var s in shop) if (shop[s] != undefined) items.push(s);
	var id = read(items);
	var amt = everyman.warehouse[id];
	if (amt > 0) amt = rand(0, amt);
	return {'id': id, 'amt': amt};
}
function stealShop() {
	var stealChances = getStealChance(player);
	var r = rand(0, 100);
	if (r < stealChances) {
		var ritem = getRandomShopItem(player.mapID.x, player.mapID.y);
		addItemToInventory(ritem.id, ritem.amt);
		addItemToWarehouse(ritem.id, -ritem.amt);

		if (ritem.amt > 0) showNotice('Success', 'You stole '+ritem.amt+' '+itemList[ritem.id].name+' from the vendor without being caught. Good job!');
		if (ritem.amt <= 0) showNotice('Well...', 'You failed at stealing anything, but at least the vendor did not notice. Better luck next time.');
		var iprice = itemList[ritem.id].price;
		var ivalue = iprice * ritem.amt;
		addCrime(player, 1, ivalue);
	}
	else {
		showNotice('Fail', 'What? Get out of here before I call the police! <br><br><small><i>Note from the programmer: Haha, there is no police you jerkass I\'m going to steal everything I want.</i></small>')
		addCrime(player, 2, stealChances);
	}
}
function getTrashItems(mapx, mapy) {
	var map = city.map[mapx][mapy];
	if (map.trash == undefined) map.trash = [];
	var gti = '';
	for (var t in map.trash) {
		var amt = map.trash[t];
		var id = t;
		if (amt > 0) gti += displayItem(id, amt, 'get')+'<br>';
	}
	if (!gti) gti = 'There are no items inside this trash bin.';

	return gti;
}
function addRandomItemToTrash() {
	var rx = rand(1, city.map.length) - 1;
	var ry = rand(1, city.map[0].length) - 1;

	var ri = rand(1, itemList.length) - 1;

	addItemToTrash(rx, ry, ri);
}
function addItemToTrash(mapx, mapy, id) {
	var map = city.map[mapx][mapy];
	if (map.trash == undefined) map.trash = [];
	if (map.trash[id] == undefined) map.trash[id] = 0;
	map.trash[id]++;
}
function showNotice(title, text, exit) {
	notice_header.innerHTML = title;
	notice_msg.innerHTML = text;

	var exitext = 'Dismiss This Message';
	if (exit) exitext = exit;

	notice_msg.innerHTML += '<br><hr><br><div class="btn btn-default" onclick="closeNotice()">'+exitext+'</div>';

	sNotice();
}
function arrest(guy, officer) {
	checkDrugs();
	player.hold = true;
	var crime = guy.crime;
	var fee = displayCrime(guy, 'fee');
	if (fee < 0) showNotice('Wait a minute!', "Althought we do not like your methods, the city's Police Department wants to compensate you for your hard work chasing criminals.<br>But remember, that is the Police's duty, not yours!");
	if (fee == 0) showNotice('Wait a minute!', 'Oh, sorry, seems like I mistook you as another person, but you are clean.');
	if (fee > 0) showNotice('You are under arrest!', 'Here are the crimes you have done: <hr>'+displayCrime(guy));
	enterStaticBuilding('jail');
	if (everyman.jail == undefined) everyman.jail = {
		'fee': fee,
		'time': displayCrime(guy, 'time'),
	}
	guy.money -= fee;
	for (var i in guy.inventory) {
		if (itemList[i].drug || itemList[i].illegal) guy.inventory[i] = 0;
	}
	guy.crime = [];
	wantedOfficers = {};
}
function addItemToInventory(id, amt) {
	var item = itemList[id];
	if (player.inventory == undefined || !player.inventory) player.inventory = [];
	if (player.inventory[id] == undefined || !player.inventory[id]) player.inventory[id] = 0;

	player.inventory[id] += amt;

	if (isAPolicemanOnSight() && (item.drug || item.illegal)) checkDrugs();
}
function isAPolicemanOnSight() {
	for (var p in activePolicemen) {
		var pp = activePolicemen[p];
		var dist = sdistance(player.mapID, pp.mapID);
		var r = rand(0, dist);
		if (r == 0) return pp;
	}
	return false;
}
function throwItem(id) {
	var amt = player.inventory[id];
	if (amt > 0) var used = true;
	if (used) player.inventory[id]--;
	decreaseHygiene(player, 2);
	//addItemToTrash(player.mapID.x, player.mapID.y, id);
	changeKarma(player, 0.01);
	if (itemList[id].drug || itemList[id].illegal) {
		changeKarma(player, 0.02);
	}
	showInventory('throw');
}
function useItem(id, who, peek, all) {
	if (!who) {
		who = player;
		var amt = 1;
	}
	if (who == player || !who) {
		var amt = who.inventory[id];
	}
	var amtouse = 1;
	if (player.allmode) amtouse = amt;
	
	if (amt > 0) {
		//Can use item
		var item = itemList[id];
		var used = false;

		var willheal = healWithItem(who, item, 1);
		if (peek) return willheal;

		healWithItem(who, item, 0, amtouse);
		used = true;
		if (item.byproduct && who == player) addItemToInventory(item.byproduct, amtouse);
	}
	if (peek) return false;
	if (used && who == player) addItemToInventory(id, -amtouse);
	if (who == player) {
		showInventory();
		updateHUD();
	}
}
function healWithItem(guy, item, peek, amtouse) {
	var stats = ['health', 'hunger', 'energy', 'hygiene'];
	if (!amtouse) amtouse = 1;
	var totalhealed = 0;
	var willheal = false;
	for (var s in stats) {
		var stat = stats[s];
		if (!item[stat]) continue;
		var hg = healGuy(guy, stat, (item[stat] * amtouse), peek);
		if (hg) willheal = true;
	}
	return willheal;
}
function healGuy(guy, what, amt, peek) {
	var max = what+'x';
	var maxx = max;
	if (!guy[max]) guy[max] = 100;
	max = guy[max];
	if (peek) {
		var g = Math.ceil(guy[what]);
		g = Math.ceil(g + amt);
		if (g >= max) {
			g = max;
		}
		if (g <= 0) g = 0;
		return (Math.ceil(g) - Math.ceil(guy[what]));
	}
	guy[what] += amt;
	if (guy[what] >= max) {
		guy[what] = max;
		guy[maxx] += Math.ceil(amt / 10);
	}
	if (guy[what] <= 0) guy[what] = 0;

	return 0;
}
function decorationMode() {
	var flist = '';
	var mode = isHome(player, player.mapID.x, player.mapID.y);
	var buildmode = (mode && mode.bought) ? true : false;
	for (var f in furniturePrices) {
		var p = furniturePrices[f];
		if (p > player.money) continue;
		if (!buildmode && furnitureStatus[p] == 'build') continue;
		flist += displayFurniture(f)+'<br>';
	}
	if (!flist) flist = '<i>There are no pieces of furniture you can buy right now.</i>';
	showNotice('Decoration Mode', 'Click any piece of furniture to buy it.<br>'+flist);
}
function displayFurniture(id) {
	return '<div class="itemButton" style="height: 80px" onclick="buyFurniture(\''+id+'\')"><i class="tile '+id+'"></i><span style="position: relative; left: 60px"><b>'+furnitureNames[id]+'</b> $'+furniturePrices[id]+'</span></div>';
}
function buyFurniture(id) {
	if (everyman.held) return;
	var price = furniturePrices[id];
	if (player.money < price) return;
	player.money -= price;
	everyman.held = id;

	if (furtuto) closeNotice();
	if (furtuto == undefined) {
		showNotice('Decoration Mode', 'To place this new piece of furniture, get in front of an empty spot and press the P key.');
		furtuto = true;
	}
}
function getTrashItem(id, amt) {
	addItemToInventory(id, amt);
	var thisTrash = getCurrentMap().trash;
	thisTrash[id]--;
	decreaseHygiene(player, 5);
	showInventory('throw');
}
function decreaseHygiene(who, amt) {
	who.hygiene -= amt;
	if (who.hygiene < 0) who.hygiene = 0;
}
function buyItem(id, amt, fromshop) {
	if (amt == undefined) amt = 1;
	var available = everyman.warehouse[id];
	var maxamt = Math.floor(player.money / itemList[id].price);
	if (maxamt > available) maxamt = available;
	if (player.allmode) amt = maxamt;
	if (available <= 0) return;
	var price = (itemList[id].price * amt);
	if (player.money < price) return;
	player.money -= price;
	addItemToWarehouse(id, -amt);
	addItemToInventory(id, amt);

	if (fromshop) showInventory('npcshop', fromshop);
	if (!fromshop) showInventory('shop');
}
function displayItem(id, amt, variation, exparam) {
	var item = itemList[id];
	var itemclass = '';
	if (item.illegal) itemclass = 'illegal';
	if (item.test) itemclass = 'mostwanted';
	var act = 'useItem';
	if (variation == 'throw') act = 'throwItem';
	if (variation == 'get') act = 'getTrashItem';
	if (variation == 'shop' || variation == 'npcshop') act = 'buyItem';
	var test = healWithItem(player, item, true);
	if (!test && item.food) itemclass += ' unavailable';
	var act2 = '';
	var desc = item.desc;
	if (amt <= 0 && variation == 'shop') desc = '<b class="illegal">Out of stock!</b>';
	var param = (act == 'useItem') ? 0 : 1;
	if (exparam) exparam = '\''+exparam+'\'';
	var act3 = (act == 'useItem') ? 'useItem('+id+', '+param+', '+exparam+', 1)' : '';
	return '<div class="'+variation+' itemButton" onclick="'+act+'('+id+', '+param+', '+exparam+')" onkeypress="'+act3+'">'+amt+' x <b class="'+itemclass+'">'+item.name+'</b> ($'+item.price+')<br>'+
	'<i>'+desc+'</i><br>'+

	'</div>';
}
function getLostItem(map, id) {
	drawLostItems();
	var item = map.lostItems[id];
	item = itemList[item.id];
	addItemToInventory(item.id, 1);

	onPlayerNotification('<tho>Found '+item.name+' in the ground.</tho>');
	map.lostItems.splice(id, 1);

	drawLostItems();
}
function getCurrentMap() {
	return city.map[player.mapID.x][player.mapID.y];
}
function talkTo(id, act) {
	player.hold = true;
	var guy = everyman.people[id];
	var tt = '';
	if (act == undefined) tt += speech(guy, 'greet')+"<br>";
	if (act == 'talk') {
		tt += speech(guy, 'talk')+'<br>';
		guy.friendship++;
		changeKarma(player, 0.02);
	}
	if (guy.friendship < 0 && rand(0,1)) setTimeout(closeNotice, 500);
	if (act == 'steal' || act == 'attack') if (guy.friendship > 0) guy.friendship = Math.floor(guy.friendship / 2);
	if (act == 'steal') {
		var chances = getStealChance(guy);
		var r = rand(0, 100);
		var success = (r < chances) ? true : false;
		var karmamt = (isBadGuy(guy)) ? 0.05 : -0.05

		if (success) {
			var m = round(Math.random()*guy.money);
			tt += 'You stole $'+m.toFixed(2)+' from '+guy.name+'<br>';
			if (m <= 0) tt += 'Better luck next time!';
			if (m > 0) {
				player.money += m;
				guy.money -= m;
				onPlayerNotification('+$'+m.toFixed(2));
			}
			addCrime(player, 0, m);
		}
		if (!success) {
			tt += speech(guy, 'steal')+'<br>';
			guy.friendship -= 5;
			changeKarma(player, karmamt);
			setTimeout(closeNotice, 500);
		}
		guy.friendship -= 5;
		changeKarma(player, karmamt);
		addCrime(player, 2, chances);
	}
	if (act == 'attack') {
		var strength = (player.age + 1);
		var dmg = rand(strength, (strength * 2));

		healGuy(guy, 'health', -dmg);
		if (dmg == 0 && !isBadGuy(guy)) addCrime(player, 7, (getNPCValue(guy) / 1000));
		if (dmg > 0) {
			if (isPolice(guy) && guy.age >= 18) addCrime(player, 10, (dmg * (getNPCValue(guy) / 100)));
			if (!isPolice(guy) && guy.age >= 18 && !isBadGuy(guy)) addCrime(player, 8, (dmg * (getNPCValue(guy) / 100)));
			if (guy.age < 18 && !isBadGuy(guy)) addCrime(player, 12, (dmg * (getNPCValue(guy) / 100)));
			if (isBadGuy(guy)) addCrime(player, 15, (dmg * getNPCValue(guy)));
		}

		if (guy.health <= 0) {
			if (!isPolice(guy) && guy.age >= 18 && !isBadGuy(guy)) addCrime(player, 9, getNPCValue(guy));
			if (isPolice(guy) && guy.age >= 18) addCrime(player, 11, getNPCValue(guy));
			if (guy.age < 18 && !isBadGuy(guy)) addCrime(player, 13, getNPCValue(guy));
			if (guy.age >= 18 && isBadGuy(guy)) addCrime(player, 14, getNPCValue(guy));

			killPerson(guy.id, 'was killed by '+player.name+' '+player.family);
			onPlayerNotification('You killed '+guy.name+' '+guy.family);
			closeNotice();
			return;
		}

		guy.friendship -= 25;
		var karmamount = (isBadGuy(guy)) ? 0.25 : -0.25
		changeKarma(player, karmamount);

		tt += '<br><b>You deal '+dmg+' damage to '+guy.name+' '+guy.family+' (Health: '+guy.health+'/'+guy.healthx+')</b><br>';
		tt += speech(guy, 'talk')+'<br>';
	}

	tt += '<br><br><div class="btn btn-primary guybtn" onclick="talkTo(\''+id+'\', \'talk\')">Talk</div><br>';
	tt += '<div class="btn btn-warning guybtn" onclick="talkTo(\''+id+'\', \'steal\')">Steal</div><br>';
	tt += '<div class="btn btn-danger guybtn" onclick="talkTo(\''+id+'\', \'attack\')">Attack</div><br>';
	//TODO SLUM SHOP
	if (guy.job.type == 'slum') tt += '<div class="btn btn-success guybtn" onclick="showInventory(\'npcshop\', \''+guy.id+'\')">Buy Items</div><br>';
	if (guy.friendship >= 50) tt += '<div class="btn btn-default guybtn" onclick="seeStats(\''+id+'\')">Info</div><br>';

	showNotice(guy.name, tt, 'Say Goodbye');
}
function seeStats(id) {
	showNPCInfo(everyman.people[id]);
}
function getNPCValue(guy, numode) {
	if (numode) guy = {'age': guy};
	var youngMod = Math.pow(1.08, (8 - guy.age));

	var base = 62000 * youngMod;

	base += guy.age;
	return base;
}
function showNPCStats(guy) {
	var sns = 'Value: '+getNPCValue(guy)+'<br>';

	if (typeof guy != 'object') return guy;

	for (var e in guy) {
		var param = guy[e];
		if (typeof param == 'object' && e != 'element') {
			sns += '<b>'+e+'</b><br>';
			if (!par) continue;
			var par = param[ee];
			if (typeof par == 'number') par = round(par);
			for (var ee in param) sns += '<ind><i>'+ee+'</i> '+par+'</ind><br>';
			continue;
		}
		var par = guy[e];
		if (typeof par == 'number') par = round(par);
		sns += '<b>'+e+'</b> '+par+'<br>';
	}
	return sns;
}
function canUseTile(tileObject) {
	var d = new Date();
	d = d.valueOf();
	if (tileObject.lastUsed < d) {
		tileObject.lastUsed = d + 10000;
		return true;
	}
}
function useTile(tile) {
	if (!everyman.tileStatus) everyman.tileStatus = {};
	if (!everyman.tileStatus[tile]) everyman.tileStatus[tile] = {'lastUsed': 0};

	var actions = {
		'tile_sink': "tileHealPlayer('hygiene', 10, 'Hygiene')",
		'tile_sink2': "tileHealPlayer('hygiene', 10, 'Hygiene')",
	}
	if (canUseTile(everyman.tileStatus[tile])) {
		eval(actions[tile]);
	}
}
function tileHealPlayer(stat, amt, name) {
	var willheal = healGuy(player, stat, amt, true);
	if (!willheal) onPlayerNotification(name+' max.');
	healGuy(player, stat, amt);
	onPlayerNotification('+'+amt+' '+name);
}
function showNPCInfo(guy) {
	var title = guy.name+' '+guy.family+"'s Stats";
	var message = '';
	message += '<statd><b>Age</b>: '+guy.age+'</statd>';
	var g = (guy.gender == 0) ? 'Man' : 'Woman';
	message += '<statd><b>Gender</b>: '+g+'</statd>';
	message += '<statd><b>Job</b>: '+getMyJobName(guy)+'</statd>';
	
	message += '<statd><b>Karma</b>: '+guy.karma+'</statd>';
	message += '<statd><b>Money</b>: $'+guy.money+'</statd>';
	message += '<statd><br></statd>';
	message += '<statd style="width: 100%"><br></statd>';

	message += '<statd>'+round(guy.health / guy.healthx * 100)+'% Health ('+guy.healthx+' max)</statd>';
	message += '<statd>'+round(guy.hunger / guy.hungerx * 100)+'% Food ('+guy.hungerx+' max)</statd>';
	message += '<statd><br></statd>';

	message += '<statd>'+round(guy.energy / guy.energyx * 100)+'% Energy ('+guy.energyx+' max)</statd>';
	message += '<statd>'+round(guy.hygiene / guy.hygienex * 100)+'% Hygiene ('+guy.hygienex+' max)</statd>';
	message += '<statd><br></statd>';

	message += '<statd style="width: 100%"><br></statd>';

	message += '<statd><b>Physical Stats</b>:</statd>';
	message += '<statd>'+getStat(guy, 'strength')+' Strength</statd>';
	message += '<statd>'+getStat(guy, 'endurance')+' Endurance</statd>';

	message += '<statd><b>Psychological Stats</b>:</statd>';
	message += '<statd>'+getStat(guy, 'intelligence')+' Intelligence</statd>';
	message += '<statd>'+getStat(guy, 'luck')+' Luck</statd>';

	message += '<statd><b>Social Stats</b>:</statd>';
	message += '<statd>'+getStat(guy, 'charisma')+' Charisma</statd>';
	message += '<statd>'+getStat(guy, 'frugality')+' Frugality</statd>';




	//Homes
	//Job

	showNotice(title, message);
}
function showTutorial() {
	var msg = '<h3>Controls</h3>';
	msg += '<b>WASD</b> Moves the player in the desired direction. W is north (Top right) S is south, A and E are west and east respectively.<br>';
	msg += '<b>E</b> Shows your character info, like stats, name and age.<br>';
	msg += '<b>B/V</b> Enters Decoration Mode. That lets you purchase furniture for your home and place them.<br>';
	msg += '<b>F</b> Shows your current family, and the status of all of its members. That is, every NPC that shares your family name.<br>';
	msg += '<b>N/M</b> Shows a list of all NPC that are registered in the city. Including alive, and deceased ones. The list also includes you.<br>';
	msg += '<b>P</b> Picks a piece of furniture at home, you can place it somewhere else by pressing the P key again.<br>';
	msg += '<b>$</b> Sells the current piece of furniture you are holding with key P. It gives 1/4 of its sell price.<br>';
	msg += '<b>I</b> Opens the Inventory Window, where you can manage and use all the items you have, as well as displaying their amount and stats.<br>';
	msg += '<b>Z/Space bar</b> Interacts with characters, items, furniture, doors, etc.<br>';

	showNotice('Welcome to Everyman '+changes().latestVersion, msg);
}

$('body').on('keypress', function(evt) {
    var key = String.fromCharCode(evt.charCode).toLowerCase();

    if (key == 'w') movePlayer('north');
    if (key == 'a') movePlayer('west');
    if (key == 'd') movePlayer('east');
    if (key == 's') movePlayer('south');
    if (key == 'e') showNPCInfo(player);
    if (key == 'b' || key == 'v') {
    	decorationMode();
    }
    if (key == 'f') showNotice('Family', getFamilyOf(player));
    if (key == 'n' || key == 'm') showNotice('Citizen List', getFamilyOf(player, 'all'));
    if (key == 'p') {
    	pickFurniture();
    }
    if (key == 'q') {
    	player.allmode = (player.allmode) ? false : true;
    }
    if (key == '$') {
    	if (everyman.held) {
    		var price = furniturePrices[everyman.held];
    		price = round(price / 4);
    		if (!price) price = 0;
    		player.money += price;
    		notification('You sold that piece of furniture for $'+price.toFixed(2));
    		everyman.held = undefined;
    	}
    }

    if (key == 'i') showInventory();
    if (key == ' ' || key == 'z') {
    	//Press space
    	var infront = whatsInFrontOf(player);
	    if (infront.guyfront) {
	    	var guy = everyman.people[infront.guyfront];
	    	if (player.inside && !guy.inside) return;
	    	var f = guy.friendship;
	    	if (f < 0 && rand(0,1)) {
	    		onCoordinateNotification(guy.x, guy.y, speech(guy, 'talk'));
	    		return;
	    	}
	    	talkTo(infront.guyfront);
	    	return;
	    }
    	if (infront.upfront != undefined) {
    		if (infront.upfront.match('deco_8')) {
	    		enterBuilding(player);
	    		recheckGuys();
	    		displayMap();
	    	}
	    	if (infront.upfront == 'tile_bin') {
	    		showInventory('throw');
	    		decreaseHygiene(player, 1);
	    	}
	    	if (infront.upfront == 'tile_shop_desk_machine' || infront.upfront == 'tile_shop_desk' || infront.upfront == 'tile_shop_work_door') {
	    		showInventory('shop');
	    	}
	    	if (infront.upfront == 'tile_bed1' || infront.upfront == 'tile_bed2') {
	    		player.sleeping = true;
	    		$('#sleeper').fadeIn(100);
	    		switchTime('fast');
	    		saveGame();
	    	}
	    	if (infront.upfront) useTile(infront.upfront);

	    	if (infront.upfront == 'tile_fence_door' || infront.upfront == 'tile_door') {
	    		var home = isHome(player, player.mapID.x, player.mapID.y);
	    		if (home) {
	    			if (home.due > 0) {
	    				askRent(home);
	    			}
	    			var dir = directionNames[player.facing];
		    		moveGuy(player, dir, true, true);
		    		moveGuy(player, dir, true, true);
	    		}
	    		else {
	    			var home = new Home(player.mapID.x, player.mapID.y);
	    			askBuy(home);
	    		}
	    	}
	    	if (infront.upfront == 'tile_work_door') {
	    		if (player.job && player.job.x == player.mapID.x && player.job.y == player.mapID.y) {
	    			startWorking();
	    		}
	    		else {
	    			var job = new Job(player.mapID.x, player.mapID.y);
	    			askWork(job);
	    		}
	    	}
    	}
    }
});

var gameInfo = {
	'name': 'Everyman',
	'version': changes(changelog).latestVersion,
	'changelog': changes(changelog).changelog,
}
loadGame();
resetVariables();
afterLoad();
update();

displayMap();
getPolicemen();

showTutorial();

setInterval(tickPolice, TICK_PEOPLE_INTERVAL);
var timer_tp = setInterval(timePass, 1000);
window.onbeforeunload = function() {
	$('#loader').slideDown('100');
}
setInterval(updateMoney, 250);