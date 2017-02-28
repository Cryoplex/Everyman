function speech(guy, type) {
	if (guy == undefined) var guy = everyman.people[everyman.peopleList[0]];
	if (type == undefined) type = 'talk';
	if (guy.friendship == undefined) guy.friendship = 0;
	var friendship = guy.friendship;

	console.log('Guy', guy);

	var gm = getMessages(guy, type);
	console.log('Possible messages: ', gm);
	

	return read(gm);
}
var speech_messages = [
	//[type, text, min_friendship, max_friendship],
	['greet', "Hello, I'm %_guy.name nice to meet you!", 0, 0],
	['greet', "Hello!", 1, ], //Default positive greeting
	['greet', "(...) What do you want?", , -1], //Default negative greeting
	['greet', "Hello, how are you?", 1, 9],
	['greet', "Hey! What's up?", 10, 49],
	['greet', "Good to see you! What's up?", 50, ],
	['greet', "What do you want now?", , -1],
	['greet', "Get lost, please.", , -1],
	['greet', "You again?", , -5],
	['greet', "Oh, is this piece of shit again.", , -10],
	['greet', "Hey, motherfucker. What do you want?", , -15],
	['greet', "Fuck you, %_player.name", , -20],
	['greet', "Hello jerk-ass. Did a truck hit you already?", , -25],
	['greet', "How come are you still alive? Shit like you don't deserve to live.", , -30],
	['greet', "Need help in commiting suicide?", , -30],

	['talk', "I don't have time right now.", , -1], //Default negative talk.
	['talk', "Everything is OK.", 0, , 'guy.health >= 25'], //Default neutral/possitive talk.
	['talk', "My ID card number is %_guy.id what a long number right? Am I a robot?", 20, ],
	['talk', "I love walking my dog at nights. Too bad I don't have a dog. Haha.", 5, , 'everyman.time.hours > 18'],
	['talk', "Stealing other people is bad. And you should feel bad.", 0, ],
	['talk', "If you annoy other people, they wont want to talk with you anymore. What? Sorry! I did not mean that...", 0, ],
	['talk', "Being rude to people makes them ignore you, and say they don't have time.", 0, ],
	['talk', "You know, if you are up to that stuff, stealing is more effective at night. Keep that in mind. But hey! Don't rob me!", 25, ],
	['talk', "I don't feel good...", 0, , 'guy.health < 25'],
	['talk', "I think I'm dying, I don't want to die!", 0, , 'guy.health < 10'],
	['talk', "I'm perfectly! And today, is a perfect day!", 0, , 'guy.health > 80'],
	['talk', "I'm starving... Please give me some food...", 0, , 'guy.hunger < 10'],
	['talk', "Uh oh, did you hear that? It's my stomach, haha.", 0, , 'guy.hunger < 50'],
	['talk', "Well, I ate a lot of %_getRandomFoodItem() today, they taste good!", 0, , 'guy.hunger > 80'],
	['talk', "Time to have some dinner! What will I make? Hmm, maybe some... %_getRandomFoodItem() ?", 0, , '(guy.hunger < 50 && everyman.time.hours >= 20 && everyman.time.hours <= 22)'],
	['talk', "It's lunch time. I want %_getRandomFoodItem() a lot. Don't you?", 0, , '(guy.hunger < 50 && everyman.time.hours >= 13 && everyman.time.hours <= 15)'],
	['talk', "Ah... What a perfect day today. I feel full of energy.", 0, , 'guy.energy > 80'],
	['talk', "I'm a bit tired, sorry if I don't pay a lot of attention, okay?", 0, , 'guy.energy < 50'],
	['talk', "Uh... Let's get some sleep. I look like a <i class='illegal'>zombie</i>.", 0, , 'guy.energy < 10'],
	['talk', "Dude, stop with this already. I don't have time for you.", , -1],
	['talk', "We could have been good friends, but you screwed it, go somewhere else.", , -5],
	['talk', "What do you want? Steal me? Hit me? Do it, I don't care about you anymore.", , -10],
	['talk', "Maybe if you stopped hitting and stealing everyone, this city could be a better place to live.", , -15],
	['talk', "Fuck you, you don't have anything better to do, than to waste my time? I said: GET LOST!", , -20],
	['talk', "I hate people like you, really. How persistent. Don't you listen? GET THE FUCK OUT.", , -25],
	['talk', "Do you think I'm happy with being harassed this way? I'm a HUMAN, like everyone else here, including you. Start acting like one, and stop being an animal.", , -30],
	['talk', "I wish some bad guy at your shitty job as a %_getMyJobName() robs you tonight.", , -1, 'player.job && player.job.type == "slum"'],
	['talk', "I wish you get hit by a truck, that would be awesome.", , -10],


	['steal', "Hey, you. What are you doing?!", , 10],
	['steal', "Dude, stop! Why do you do this to me?", 10, ],
	['steal', "And I thought we were friends... I, hate you!", 30, ],
];
function getMessages(guy, type) {
	console.log('getMessages', guy, type);
	var f = guy.friendship;
	var mess = [];
	console.log('getMessages', f, mess);
	for (var s in speech_messages) {
		var sm = speech_messages[s];
		console.log('getMessages', s, speech_messages.length, sm);
		if (sm[0] != type) continue;
		var minf = sm[2];
		if (minf == undefined) minf = -Infinity;
		var maxf = sm[3];
		if (maxf == undefined) maxf = Infinity;

		var condition = sm[4];
		var cantalk = true;
		if (condition && !eval(condition)) cantalk = false;

		if (sm[0] == type && f >= minf && f <= maxf && cantalk) mess.push(parseMessage(guy, sm[1]));
	}

	return mess;
}
function parseMessage(guy, message) {
	var sp = message.split(' ');
	for (var spp in sp) {
		var wo = sp[spp];
		if (wo.match('%_')) {
			wo = wo.split('%_')[1];
			wo = eval(wo);
			sp[spp] = wo;
		}
	}
	return sp.join(' ');
}