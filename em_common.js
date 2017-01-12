function addToLog(text) {
	lastlog.push(text);
	if (lastlog.length > 10) lastlog.splice(0, 1);

	debug_interns.innerHTML = lastlog.join('<br>');
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
function sdistance(from, to) {
	var dx = Math.abs(from.x - to.x);
	var dy = Math.abs(from.y - to.y);
	return (dx + dy);
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