//Funciones comunes de usar y tirar. Por Kulivszk v0.6
//0.6 - Added function last()
//0.7 - Added function changes()

var commonDebug = false;
var commonLang = 'es';
var splitty = document.URL.split('?');
if (splitty[1] == 'en') {
	commonLang = 'en';
}
swapLang(commonLang);
var BASE_62_CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

function swapLang(newLang) {
	document.body.lang = newLang;
	commonLang = newLang;
}
function collisionCheck(from, to) {
	var c1 = from.x < to.x + to.width;
	var c2 = from.x + from.width > to.x;
	var c3 = from.y < to.y + to.height;
	var c4 = from.y + from.height > to.y;
	if (c1 && c2 && c3 && c4) return 1;
}
function b62e(num) {
	if (!num) return 0;
    var str = '';
    while (num > 0) {
        str = BASE_62_CHARSET[num % 62] + str;
        num = Math.floor(num/62);
    }
    return str;
}
function b62d(string) {
	var v = 0;
	var str = string.split('').reverse();

	for (var i in str) {
		var chara = str[i];
		v += BASE_62_CHARSET.indexOf(chara) * Math.pow(62, i);
	}

    return v;
}
function read(array) {
	var max = array.length-1;
	var min = rand(0,max);
	return array[min];
}
function debug(text) {
	if (commonDebug) console.log("[DEBUG] "+text);
}
function percent(min, max) {
	var calc = (min/max*100);
	calc = Math.round(calc*100)/100;

	return calc+'%';
}
function acd() {
	commonDebug = !commonDebug;
}
function maxNum(num) {
	if (num >= Number.MAX_SAFE_INTEGER) return true;
}
function compress(vari) {
	vari = JSON.stringify(vari);


	vari = LZW.compress(vari);

	var maxl = 0;
	for (var e in vari) {
		var b62 = b62e(vari[e]);
		if (b62.length > maxl) maxl = b62.length;
	}

	for (var e in vari) {
		var ta = b62e(vari[e]);
		while (ta.length < maxl) ta = '$'+ta;
		vari[e] = ta;
	}

	vari = vari.join('');

	vari = maxl+'_'+vari;


	return vari;
}
function decompress(vari) {
	vari = vari.split('_');
	var ilength = vari[0];
	var reg = '.{'+ilength+'}';
	var array = vari[1].match(new RegExp(reg, 'g'));

	for (var e in array) {
		var el = array[e];
		array[e] = b62d(el.replace('$', ''));
	}

	array = LZW.decompress(array);

	return JSON.parse(array);
}
function tcompress(data) {
	return JSON.stringify(LZW.compress(JSON.stringify(data)));
}
function tdecompress(data) {
	return JSON.parse(LZW.decompress(JSON.parse(data)));
}
//Test shit

//LZW Compression/Decompression for Strings
var LZW = {
    compress: function (uncompressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = {},
            c,
            wc,
            w = "",
            result = [],
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i;
        }
 
        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            //Do not use dictionary[wc] because javascript arrays 
            //will return values for array['pop'], array['push'] etc
           // if (dictionary[wc]) {
            if (dictionary.hasOwnProperty(wc)) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }
 
        // Output the code for w.
        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
    },
 
 
    decompress: function (compressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = [],
            w,
            result,
            k,
            entry = "",
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[i] = String.fromCharCode(i);
        }
 
        w = String.fromCharCode(compressed[0]);
        result = w;
        for (i = 1; i < compressed.length; i += 1) {
            k = compressed[i];
            if (dictionary[k]) {
                entry = dictionary[k];
            } else {
                if (k === dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }
 
            result += entry;
 
            // Add w+entry[0] to the dictionary.
            dictionary[dictSize++] = w + entry.charAt(0);
 
            w = entry;
        }
        return result;
    }
};

//Test shit



function numPoints(num) {
	var n = String(num);
	var decs = "";
	if (n.match(/\./) != null) {
		var decs = n.split('.');
		decs = decs[decs.length-1];
		decs = '.'+decs;
	}
	n = Math.floor(Number(n));
	n = String(n);
	if (n.length > 3) {
		var zeros = 0;
		while (n.length % 3 != 0) {
			n = '0'+n;
			zeros++;
		}
		n = n.split("");
		var l = "";
		for (i = 0; i < n.length; i++) {
			l+=n[i];
			if ((i+1) % 3 == 0 && (i+1) != n.length) l+=' ';
		}
		n = l.substring(zeros);
	}
	return n+decs;
}
function shortNum(num) {
	//if (maxNum(num)) return 'Over 9000';
	if (num > 1e120) return "OVER 9000";

	var shortLevels = [
	undefined, translate("millones|million"), translate("billones|billion"),
	translate("trillones|trillion"), translate("cuadrillones|quadrillion"),
	translate("quintillones|quintillion"), translate("sextillones|sextillion"),
	translate("septillion|septillion"), translate("octillion|octillion"),
	translate("nonillion|nonillion"), translate("decillion|decillion"),
	translate("duodecillion|duodecillion"), translate("tredecillion|tredecillion"),
	translate("quattuordecillion|quattuordecillion"), translate("quindecillion|quindecillion"),
	translate("sexdecillion|sexdecillion"), translate("septendecillion|septendecillion"),
	translate("octodecillion|octodecillion"), translate("novemdecillion|novemdecillion"),
	translate("vigintillion|vigintillion")
	];
	var n = num;
	var shortLevel = 0;
	while (num >= 1e6) {
		num /= 1e6;
		n /= 1e6;
		shortLevel++;
	}
	n = Math.floor(n*100)/100;
	var tail = shortLevels[shortLevel];
	if (tail == undefined) {
		tail = "";
	}
	else {
		tail = " "+tail;
	}
	return numPoints(n)+tail;
}

//Algoritmo de comprensión de datos
var layer = {
"one": {
	"index": [
	"000", "001", "010", "011", "100", "101", "110", "111"
	],
	"000": "q",
	"001": "Q",
	"010": "w",
	"011": "W",
	"100": "e",
	"101": "E",
	"110": "r",
	"111": "R",
},
"two": {
"index": [
"qq", "qQ", "qw", "qW", "qe", "qE", "qr", "qR", "Qq", "QQ", "Qw", "QW", "Qe", "QE", "Qr", "QR",
"wq", "wQ", "ww", "wW", "we", "wE", "wr", "wR", "Wq", "WQ", "Ww", "WW", "We", "WE", "Wr", "WR",
"eq", "eQ", "ew", "eW", "ee", "eE", "er", "eR", "Eq", "EQ", "Ew", "EW", "Ee", "EE", "Er", "ER",
"rq", "rQ", "rw", "rW", "re", "rE", "rr", "rR", "Rq", "RQ", "Rw", "RW", "Re", "RE", "Rr", "RR" 
],
"qq": "t", "qQ": "o", "qw": "d", "qW": "h", "qe": "l", "qE": "n", "qr": "0", "qR": "5",
"Qq": "T", "QQ": "O", "Qw": "D", "QW": "H", "Qe": "L", "QE": "m", "Qr": "1", "QR": "6",
"wq": "y", "wQ": "p", "ww": "e", "wW": "i", "we": "z", "wE": "X", "wr": "2", "wR": "7",
"Wq": "Y", "WQ": "P", "Ww": "E", "WW": "I", "We": "Z", "WE": "C", "Wr": "3", "WR": "8",
"eq": "u", "eQ": "a", "ew": "f", "eW": "j", "ee": "x", "eE": "V", "er": "4", "eR": "9",
"Eq": "U", "EQ": "A", "Ew": "F", "EW": "J", "Ee": "c", "EE": "B", "Er": "%", "ER": "í",
"rq": "i", "rQ": "s", "rw": "g", "rW": "k", "re": "v", "rE": "N", "rr": "ñ", "rR": "ú",
"Rq": "I", "RQ": "S", "Rw": "G", "RW": "K", "Re": "b", "RE": "M", "Rr": "á", "RR": "ó"
},
};
function binReverse(string, lay) {
	var check = layer[lay];
	for (z = 0; z < check['index'].length; z++) {
		var ct = check['index'][z];
		var ccc = check[ct];
		if (ccc == string) var l = ct;
	}
	return l;
}
function binDecode(string) {
	string = string.split("");
	//Second layer
	var lz = "";
	for (i = 0; i < string.length; i++) {
		var c = string[i];
		var rev = binReverse(c, 'two');
		lz+=rev;
	}
	//First layer
	var lcc = "";
	lz = lz.split("");
	for (i = 0; i < lz.length; i++) {
		var c = lz[i];
		var rev = binReverse(c, 'one');
		lcc+=rev;
	}
	return lcc;
}
function binCrypt(number) {
	while (!divisibleBy(number.length, 6)) number = "0"+number;

	//First layer
	number = number.match(/.{3}/g);
	var l = "";
	for (i = 0; i < number.length; i++) l+=layer['one'][number[i]];
	//End of first layer.

	//Second layer
	number = l;
	number = number.match(/.{2}/g);
	l = "";
	for (i = 0; i < number.length; i++) l+=layer['two'][number[i]];
	return l;
}

function crypt(string) {
	var ccc = "";
	var cccc = "";
	for (ni = 0; ni<string.length; ni++) {
		var c = nthPos(string, ni);
		var cc = c.charCodeAt();
		//cc = cc.toString(36);
		//
		var extra = "";
		cc = cc-32;

		var ccc = ccc+cc;
		var tos = Number(cc).toString(2);
		var cry = tos;
		cccc += cry;
	}
	cccc = binCrypt(cccc);
	
	return cccc;
}
function deCrypt(code) {
	var zz = code.split(".");


	console.log(zz);
	var b10 = parseInt(code, 36);
	console.log(b10);
}


function divisibleBy(number, test) {
	var div = (number % test) == 0;
	return div;
}
function softRandom(min, max) {
	var initMax = max;
	var max = Math.round(max/10);
	while (rand(0,1) == 1) max = max*2;
	if (max >= initMax) max = initMax;
	console.log('Soft maximum: '+max);
	return rand(min, max);
}
function simil(os, cs) {
	var osl = os.length;
	var csl = cs.length;
	var max = osl;
	if (csl > osl) max = csl;
	var min = csl;
	if (osl < csl) min = osl;
	/* Igualdad.
	La igualdad entre dos cadenas se calcula mediante el número de letras
	iguales en su misma posición comparado con la longitud de la cadena más larga */
	var eq = 0;
	for (i = 0; i < osl; i++) {
		if (nthPos(os, i) == nthPos(cs, i)) eq++;
	}
	var eq = eq / max;

	/* Longitud.
	La longitud es el número de letras que hay en cada cadena. */
	var lon = min/max;

	/* Similitud.
	La similitud calcula el número de letras iguales en ambas cadenas frente a la longitud total */
	var str = uniqueChars(os+cs);
	var ll = 0;
	for (i = 0; i < str.length; i++) {
		var c = nthPos(str, i);
		var c1 = count(os, c);
		var c2 = count(cs, c);
		ll += Math.abs(c1-c2);
	}
	var tl = osl+csl;
	var sim = tl-ll;
	sim = sim/tl;

	var jaro = eq+lon+sim;
	jaro = jaro/3;
	return jaro;

}
function nthPos(string, chara) {
	return string.substring(chara, chara+1);
}
function count(string, match) {
	return string.split(match).length-1;
}
function uniqueChars(string) {
	var l = "";
	for (i = 0; i < string.length; i++) {
		var thisC = nthPos(string, i);
		var C = count(l, thisC);
		if (C == 0) l = l + thisC;
	}
	return l;
}

function rand(minimum,maximum) {
	var randie = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
	if (randie < minimum) randie = minimum;
	if (randie > maximum) randie = maximum;
	return randie;
}
function eloCalc(matchesWon, matchesLost, eloWon, eloLost) {
	var matches = matchesWon+matchesLost;
	var wonQuo = eloWon+(matchesWon*400);
	var lostQuo = eloLost-(matchesLost*400);
	var formula = (wonQuo+lostQuo)/matches;
	return Math.round(formula);
}
function checkCollision(from, to) {
	var c1 = from.x < to.x + to.size;
	var c2 = from.x + from.size > to.x;
	var c3 = from.y < to.y + to.size;
	var c4 = from.y + from.size > to.y;
	if (c1 && c2 && c3 && c4) return 1;
}
var randomColorz = rand(0,360);
function randomColor(lum) {
	/*
	var max = parseInt('ffffff', 16);
	var num = rand(0,max).toString(16);
	*/
	randomColorz += 2;
	if (randomColorz >= 360) randomColorz = 0;
	num = randomColorz;

	var luminosity = 50;
	if (lum != undefined) luminosity = lum;
	luminosity += '%'

	return 'hsl('+num+', '+luminosity+', 50%)';
	return '#'+num;
}
function rainBow(text, lum) {
	text = text.split("");
	var l = "";
	for (i = 0; i < text.length; i++) {
		l+='<span style="text-shadow: 0 0 2px #000; color: '+randomColor(lum)+'">'+text[i]+'</span>';
	}
	return l;
}
function echo(loc, text) {
	document.getElementById(loc).innerHTML = text;
}
function randChar() { return String.fromCharCode(red(rand(65,90),rand(97,122),rand(48,57))); }
function isChar(chara) {
	var num = chara.charCodeAt(0);
	if (num >= 48 && num <= 57) return true;
	if (num >= 97 && num <= 122) return true;
	if (num >= 65 && num <= 90) return true;
	return false;
}
function animCrypt(text, lastTry) {
	//48..57 (Numbers)
	//97..122 (Lowercase letters)
	//65..90 (Uppercase letters)
	if (lastTry == undefined) lastTry = "";

	var t1 = text.split("");
	var t2 = lastTry.split("");
	var l = "";
	for (i = 0; i < t1.length; i++) {
		if (t2[i] == undefined) t2[i] = randChar();

		if (isChar(t1[i]) == false) t2[i] = t1[i];
		if (t1[i] == t2[i] || rand(1,50) == true || t1[i] == 'b') t2[i] = t1[i]
		if (t2[i] != t1[i]) t2[i] = randChar();
		
		l+=t2[i];
	}
	return l;
}
function red(esto, eso, aquello) {
	if (!eso) eso = esto;
	if (!aquello) aquello = esto;
	var selection = rand(1,3);
	if (selection == 1) return esto;
	if (selection == 2) return eso;
	if (selection == 3) return aquello;
}
function isin(array, search) {
	for (i = 0; i < array.length; i++) {
		if (search == array[i]) return i;
	}
	return false;
}
function pos(id, noid) {
	//Returns top, left, bottom and right
	if (!noid) var position = document.getElementById(id).getBoundingClientRect();
	if (noid) var position = id.getBoundingClientRect();
	return [ position.top, position.left, position.bottom, position.right];
}
function getFemaleName() {
	var first = [
	"Emily", "Emma", "Madison", "Abigail", "Olivia", "Isabella", "Hannah", "Samantha", "Ava", "Ashley", "Sophia", "Elizabeth", "Alexis", "Grace", "Sarah", "Alyssa", "Mia", "Natalie", "Chloe", "Brianna", "Lauren", "Ella", "Anna", "Taylor", "Kayla", "Hailey", "Jessica", "Victoria", "Jasmine", "Sydney", "Julia", "Destiny", "Morgan", "Kaitlyn", "Savannah", "Katherine", "Alexandra", "Rachel", "Lily", "Megan", "Kaylee", "Jennifer", "Angelina", "Makayla", "Allison", "Brooke", "Maria", "Trinity", "Lillian", "Mackenzie", "Faith", "Sofia", "Riley", "Haley", "Gabrielle", "Nicole", "Kylie", "Katelyn", "Zoe", "Paige", "Gabriella", "Jenna", "Kimberly", "Stephanie", "Alexa", "Avery", "Andrea", "Leah", "Madeline", "Nevaeh", "Evelyn", "Maya", "Mary", "Michelle", "Jada", "Sara", "Audrey", "Brooklyn", "Vanessa", "Amanda", "Ariana", "Rebecca", "Caroline", "Amelia", "Mariah", "Jordan", "Jocelyn", "Arianna", "Isabel", "Marissa", "Autumn", "Melanie", "Aaliyah", "Gracie", "Claire", "Isabelle", "Molly", "Mya", "Diana", "Katie", "Leslie", "Amber", "Danielle", "Melissa", "Sierra", "Madelyn", "Addison", "Bailey", "Catherine", "Gianna", "Amy", "Erin", "Jade", "Angela", "Gabriela", "Jacqueline", "Shelby", "Kennedy", "Lydia", "Alondra", "Adriana", "Daniela", "Natalia", "Breanna", "Kathryn", "Briana", "Ashlyn", "Rylee", "Eva", "Kendall", "Peyton", "Ruby", "Alexandria", "Sophie", "Charlotte", "Reagan", "Valeria", "Christina", "Summer", "Kate", "Mikayla", "Naomi", "Layla", "Miranda", "Laura", "Ana", "Angel", "Alicia", "Daisy", "Ciara", "Margaret", "Aubrey", "Zoey", "Skylar", "Genesis", "Payton", "Courtney", "Kylee", "Kiara", "Alexia", "Jillian", "Lindsey", "Mckenzie", "Karen", "Giselle", "Mariana", "Valerie", "Sabrina", "Alana", "Serenity", "Kelsey", "Cheyenne", "Juliana", "Lucy", "Kelly", "Sadie", "Bianca", "Kyra", "Nadia", "Lilly", "Caitlyn", "Jasmin", "Ellie", "Hope", "Cassandra", "Jazmin", "Crystal", "Jordyn", "Cassidy", "Delaney", "Liliana", "Angelica", "Caitlin", "Kyla", "Jayla", "Adrianna", "Tiffany", "Abby", "Carly", "Chelsea", "Camila", "Erica", "Makenzie", "Karla", "Cadence", "Paris", "Veronica", "Mckenna", "Brenda", "Bella", "Maggie", "Karina", "Esmeralda", "Erika", "Makenna", "Julianna", "Elena", "Mallory", "Jamie", "Alejandra", "Cynthia", "Ariel", "Vivian", "Jayden", "Amaya", "Dakota", "Elise", "Haylee", "Josephine", "Aniyah", "Bethany", "Keira", "Aliyah", "Laila", "Camryn", "Fatima", "Reese", "Annabelle", "Monica", "Lindsay", "Kira", "Selena", "Macy", "Hanna", "Heaven", "Clara", "Katrina", "Jazmine", "Jadyn", "Stella"

	];
	var last = getMaleName().split(" ")[1];
	return read(first)+" "+last;
}
function getMaleName() {
var first = [
	"Jacob", "Michael", "Joshua", "Matthew", "Ethan", "Andrew", "Daniel", "Anthony", "Christopher", "Joseph", "William", "Alexander", "Ryan", "David", "Nicholas", "Tyler", "James", "John", "Jonathan", "Nathan", "Samuel", "Christian", "Noah", "Dylan", "Benjamin", "Logan", "Brandon", "Gabriel", "Zachary", "Jose", "Elijah", "Angel", "Kevin", "Jack", "Caleb", "Justin", "Austin", "Evan", "Robert", "Thomas", "Luke", "Mason", "Aidan", "Jackson", "Isaiah", "Jordan", "Gavin", "Connor", "Aiden", "Isaac", "Jason", "Cameron", "Hunter", "Jayden", "Juan", "Charles", "Aaron", "Lucas", "Luis", "Owen", "Landon", "Diego", "Brian", "Adam", "Adrian", "Kyle", "Eric", "Ian", "Nathaniel", "Carlos", "Alex", "Bryan", "Jesus", "Julian", "Sean", "Carter", "Hayden", "Jeremiah", "Cole", "Brayden", "Wyatt", "Chase", "Steven", "Timothy", "Dominic", "Sebastian", "Xavier", "Jaden", "Jesse", "Devin", "Seth", "Antonio", "Richard", "Miguel", "Colin", "Cody", "Alejandro", "Caden", "Blake", "Carson", "Kaden", "Jake", "Henry", "Liam", "Victor", "Riley", "Ashton", "Patrick", "Bryce", "Brady", "Vincent", "Trevor", "Tristan", "Mark", "Jeremy", "Oscar", "Marcus", "Jorge", "Parker", "Kaleb", "Cooper", "Kenneth", "Garrett", "Ivan", "Josiah", "Alan", "Conner", "Eduardo", "Paul", "Tanner", "Braden", "Alexis", "Edward", "Omar", "Nicolas", "Jared", "Peyton", "George", "Maxwell", "Cristian", "Francisco", "Collin", "Nolan", "Preston", "Stephen", "Ayden", "Gage", "Levi", "Dakota", "Micah", "Eli", "Manuel", "Grant", "Colton", "Damian", "Ricardo", "Giovanni", "Andres", "Emmanuel", "Peter", "Malachi", "Cesar", "Javier", "Max", "Hector", "Edgar", "Shane", "Fernando", "Ty", "Jeffrey", "Bradley", "Derek", "Travis", "Brendan", "Shawn", "Edwin", "Spencer", "Mario", "Dalton", "Erick", "Johnathan", "Erik", "Jonah", "Donovan", "Leonardo", "Wesley", "Elias", "Marco", "Trenton", "Devon", "Brody", "Abraham", "Jaylen", "Bryson", "Josue", "Sergio", "Drew", "Damien", "Raymond", "Andy", "Dillon", "Gregory", "Roberto", "Roman", "Martin", "Andre", "Jace", "Oliver", "Miles", "Harrison", "Jalen", "Corey", "Dominick", "Avery", "Clayton", "Pedro", "Israel", "Calvin", "Colby", "Dawson", "Cayden", "Jaiden", "Taylor", "Landen", "Troy", "Julio", "Trey", "Jaxon", "Rafael", "Dustin", "Ruben", "Camden", "Frank", "Scott", "Mitchell", "Zane", "Payton", "Kai", "Keegan", "Skyler", "Brett", "Johnny", "Griffin", "Marcos", "Derrick", "Drake", "Raul", "Kaiden", "Gerardo", "Tucker"
];
var last = [
	"Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes", "Myers", "Ford", "Hamilton", "Graham", "Sullivan", "Wallace", "Woods", "Cole", "West", "Jordan", "Owens", "Reynolds", "Fisher", "Ellis", "Harrison", "Gibson", "Mcdonald", "Cruz", "Marshall", "Ortiz", "Gomez", "Murray", "Freeman", "Wells", "Webb", "Simpson", "Stevens", "Tucker", "Porter", "Hunter", "Hicks", "Crawford", "Henry", "Boyd", "Mason", "Morales", "Kennedy", "Warren", "Dixon", "Ramos", "Reyes", "Burns", "Gordon", "Shaw", "Holmes", "Rice", "Robertson", "Hunt", "Black", "Daniels", "Palmer", "Mills", "Nichols", "Grant", "Knight", "Ferguson", "Rose", "Stone", "Hawkins", "Dunn", "Perkins", "Hudson", "Spencer", "Gardner", "Stephens", "Payne", "Pierce", "Berry", "Matthews", "Arnold", "Wagner", "Willis", "Ray", "Watkins", "Olson", "Carroll", "Duncan", "Snyder", "Hart", "Cunningham", "Bradley", "Lane", "Andrews", "Ruiz", "Harper", "Fox", "Riley", "Armstrong", "Carpenter", "Weaver", "Greene", "Lawrence", "Elliott", "Chavez", "Sims", "Austin", "Peters", "Kelley", "Franklin", "Lawson", "Fields", "Gutierrez", "Ryan", "Schmidt", "Carr", "Vasquez", "Castillo", "Wheeler", "Chapman", "Oliver", "Montgomery", "Richards", "Williamson", "Johnston", "Banks", "Meyer", "Bishop", "Mccoy", "Howell", "Alvarez", "Morrison", "Hansen", "Fernandez", "Garza", "Harvey", "Little", "Burton", "Stanley", "Nguyen", "George", "Jacobs", "Reid", "Kim", "Fuller", "Lynch", "Dean", "Gilbert", "Garrett", "Romero", "Welch", "Larson", "Frazier", "Burke", "Hanson", "Day", "Mendoza", "Moreno", "Bowman", "Medina", "Fowler", "Brewer", "Hoffman", "Carlson", "Silva", "Pearson", "Holland", "Douglas", "Fleming", "Jensen", "Vargas", "Byrd", "Davidson", "Hopkins", "May", "Terry", "Herrera", "Wade", "Soto", "Walters", "Curtis", "Neal", "Caldwell", "Lowe", "Jennings", "Barnett", "Graves", "Jimenez", "Horton", "Shelton", "Barrett", "O'brien", "Castro", "Sutton", "Gregory", "Mckinney", "Lucas", "Miles", "Craig", "Rodriquez", "Chambers", "Holt", "Lambert", "Fletcher", "Watts", "Bates", "Hale", "Rhodes", "Pena", "Beck", "Newman", "Haynes", "Mcdaniel", "Mendez", "Bush", "Vaughn", "Parks", "Dawson", "Santiago", "Norris", "Hardy", "Love", "Steele", "Curry", "Powers", "Schultz", "Barker", "Guzman", "Page", "Munoz", "Ball", "Keller", "Chandler", "Weber", "Leonard", "Walsh", "Lyons", "Ramsey", "Wolfe", "Schneider", "Mullins", "Benson", "Sharp", "Bowen", "Daniel", "Barber", "Cummings", "Hines", "Baldwin", "Griffith", "Valdez", "Hubbard", "Salazar", "Reeves", "Warner", "Stevenson", "Burgess", "Santos", "Tate", "Cross", "Garner", "Mann", "Mack", "Moss", "Thornton", "Dennis", "Mcgee", "Farmer", "Delgado", "Aguilar", "Vega", "Glover", "Manning", "Cohen", "Harmon", "Rodgers", "Robbins", "Newton", "Todd", "Blair", "Higgins", "Ingram", "Reese", "Cannon", "Strickland", "Townsend", "Potter", "Goodwin", "Walton", "Rowe", "Hampton", "Ortega", "Patton", "Swanson", "Joseph", "Francis", "Goodman", "Maldonado", "Yates", "Becker", "Erickson", "Hodges", "Rios", "Conner", "Adkins", "Webster", "Norman", "Malone", "Hammond", "Flowers", "Cobb", "Moody", "Quinn", "Blake", "Maxwell", "Pope", "Floyd", "Osborne", "Paul", "Mccarthy", "Guerrero", "Lindsey", "Estrada", "Sandoval", "Gibbs", "Tyler", "Gross", "Fitzgerald", "Stokes", "Doyle", "Sherman", "Saunders", "Wise", "Colon", "Gill", "Alvarado", "Greer", "Padilla", "Simon", "Waters", "Nunez", "Ballard", "Schwartz", "Mcbride", "Houston", "Christensen", "Klein", "Pratt", "Briggs", "Parsons", "Mclaughlin", "Zimmerman", "French", "Buchanan", "Moran", "Copeland", "Roy", "Pittman", "Brady", "Mccormick", "Holloway", "Brock", "Poole", "Frank", "Logan", "Owen", "Bass", "Marsh", "Drake", "Wong", "Jefferson", "Park", "Morton", "Abbott", "Sparks", "Patrick", "Norton", "Huff", "Clayton", "Massey", "Lloyd", "Figueroa", "Carson", "Bowers", "Roberson", "Barton", "Tran", "Lamb", "Harrington", "Casey", "Boone", "Cortez", "Clarke", "Mathis", "Singleton", "Wilkins", "Cain", "Bryan", "Underwood", "Hogan", "Mckenzie", "Collier", "Luna", "Phelps", "Mcguire", "Allison", "Bridges", "Wilkerson", "Nash", "Summers", "Atkins", "Wilcox", "Pitts", "Conley", "Marquez", "Burnett", "Richard", "Cochran", "Chase", "Davenport", "Hood", "Gates", "Clay", "Ayala", "Sawyer", "Roman", "Vazquez", "Dickerson", "Hodge", "Acosta", "Flynn", "Espinoza", "Nicholson", "Monroe", "Wolf", "Morrow", "Kirk", "Randall", "Anthony", "Whitaker", "O'connor", "Skinner", "Ware", "Molina", "Kirby", "Huffman", "Bradford", "Charles", "Gilmore", "Dominguez", "O'neal", "Bruce", "Lang", "Combs", "Kramer", "Heath", "Hancock", "Gallagher", "Gaines", "Shaffer", "Short", "Wiggins", "Mathews", "Mcclain", "Fischer", "Wall", "Small", "Melton", "Hensley", "Bond", "Dyer", "Cameron", "Grimes", "Contreras", "Christian", "Wyatt", "Baxter", "Snow", "Mosley", "Shepherd", "Larsen", "Hoover", "Beasley", "Glenn", "Petersen", "Whitehead", "Meyers", "Keith", "Garrison", "Vincent", "Shields", "Horn", "Savage", "Olsen", "Schroeder", "Hartman", "Woodard", "Mueller", "Kemp", "Deleon", "Booth", "Patel", "Calhoun", "Wiley", "Eaton", "Cline", "Navarro", "Harrell", "Lester", "Humphrey", "Parrish", "Duran", "Hutchinson", "Hess", "Dorsey", "Bullock", "Robles", "Beard", "Dalton", "Avila", "Vance", "Rich", "Blackwell", "York", "Johns", "Blankenship", "Trevino", "Salinas", "Campos", "Pruitt", "Moses", "Callahan", "Golden", "Montoya", "Hardin", "Guerra", "Mcdowell", "Carey", "Stafford", "Gallegos", "Henson", "Wilkinson", "Booker", "Merritt", "Miranda", "Atkinson", "Orr", "Decker", "Hobbs", "Preston", "Tanner", "Knox", "Pacheco", "Stephenson", "Glass", "Rojas", "Serrano", "Marks", "Hickman", "English", "Sweeney", "Strong", "Prince", "Mcclure", "Conway", "Walter", "Roth", "Maynard", "Farrell", "Lowery", "Hurst", "Nixon", "Weiss", "Trujillo", "Ellison", "Sloan", "Juarez", "Winters", "Mclean", "Randolph", "Leon", "Boyer", "Villarreal", "Mccall", "Gentry", "Carrillo", "Kent", "Ayers", "Lara", "Shannon", "Sexton", "Pace", "Hull", "Leblanc", "Browning", "Velasquez", "Leach", "Chang", "House", "Sellers", "Herring", "Noble", "Foley", "Bartlett", "Mercado", "Landry", "Durham", "Walls", "Barr", "Mckee", "Bauer", "Rivers", "Everett", "Bradshaw", "Pugh", "Velez", "Rush", "Estes", "Dodson", "Morse", "Sheppard", "Weeks", "Camacho", "Bean", "Barron", "Livingston", "Middleton", "Spears", "Branch", "Blevins", "Chen", "Kerr", "Mcconnell", "Hatfield", "Harding", "Ashley", "Solis", "Herman", "Frost", "Giles", "Blackburn", "William", "Pennington", "Woodward", "Finley", "Mcintosh", "Koch", "Best", "Solomon", "Mccullough", "Dudley", "Nolan", "Blanchard", "Rivas", "Brennan", "Mejia", "Kane", "Benton", "Joyce", "Buckley", "Haley", "Valentine", "Maddox", "Russo", "Mcknight", "Buck", "Moon", "Mcmillan", "Crosby", "Berg", "Dotson", "Mays", "Roach", "Church", "Chan", "Richmond", "Meadows", "Faulkner", "O'neill", "Knapp", "Kline", "Barry", "Ochoa", "Jacobson", "Gay", "Avery", "Hendricks", "Horne", "Shepard", "Hebert", "Cherry", "Cardenas", "Mcintyre", "Whitney", "Waller", "Holman", "Donaldson", "Cantu", "Terrell", "Morin", "Gillespie", "Fuentes", "Tillman", "Sanford", "Bentley", "Peck", "Key", "Salas", "Rollins", "Gamble", "Dickson", "Battle", "Santana", "Cabrera", "Cervantes", "Howe", "Hinton", "Hurley", "Spence", "Zamora", "Yang", "Mcneil", "Suarez", "Case", "Petty", "Gould", "Mcfarland", "Sampson", "Carver", "Bray", "Rosario", "Macdonald", "Stout", "Hester", "Melendez", "Dillon", "Farley", "Hopper", "Galloway", "Potts", "Bernard", "Joyner", "Stein", "Aguirre", "Osborn", "Mercer", "Bender", "Franco", "Rowland", "Sykes", "Benjamin", "Travis", "Pickett", "Crane", "Sears", "Mayo", "Dunlap", "Hayden", "Wilder", "Mckay", "Coffey", "Mccarty", "Ewing", "Cooley", "Vaughan", "Bonner", "Cotton", "Holder", "Stark", "Ferrell", "Cantrell", "Fulton", "Lynn", "Lott", "Calderon", "Rosa", "Pollard", "Hooper", "Burch", "Mullen", "Fry", "Riddle", "Levy", "David", "Duke", "O'donnell", "Guy", "Michael", "Britt", "Frederick", "Daugherty", "Berger", "Dillard", "Alston", "Jarvis", "Frye", "Riggs", "Chaney", "Odom", "Duffy", "Fitzpatrick", "Valenzuela", "Merrill", "Mayer", "Alford", "Mcpherson", "Acevedo", "Donovan", "Barrera", "Albert", "Cote", "Reilly", "Compton", "Raymond", "Mooney", "Mcgowan", "Craft", "Cleveland", "Clemons", "Wynn", "Nielsen", "Baird", "Stanton", "Snider", "Rosales", "Bright", "Witt", "Stuart", "Hays", "Holden", "Rutledge", "Kinney", "Clements", "Castaneda", "Slater", "Hahn", "Emerson", "Conrad", "Burks", "Delaney", "Pate", "Lancaster", "Sweet", "Justice", "Tyson", "Sharpe", "Whitfield", "Talley", "Macias", "Irwin", "Burris", "Ratliff", "Mccray", "Madden", "Kaufman", "Beach", "Goff", "Cash", "Bolton", "Mcfadden", "Levine", "Good", "Byers", "Kirkland", "Kidd", "Workman", "Carney", "Dale", "Mcleod", "Holcomb", "England", "Finch", "Head", "Burt", "Hendrix", "Sosa", "Haney", "Franks", "Sargent", "Nieves", "Downs", "Rasmussen", "Bird", "Hewitt", "Lindsay", "Le", "Foreman", "Valencia", "O'neil", "Delacruz", "Vinson", "Dejesus", "Hyde", "Forbes", "Gilliam", "Guthrie", "Wooten", "Huber", "Barlow", "Boyle", "Mcmahon", "Buckner", "Rocha", "Puckett", "Esparrago", "Langley", "Knowles", "Cooke", "Velazquez", "Whitley", "Noel", "Vang"
];
return read(first)+" "+read(last);
}
function doc(id) {
	//Returns object by id.
	return document.getElementById(id);
}
function translate(string) {
	var string = string.split('|');
	if (commonLang == 'es') return string[0];
	if (commonLang == 'en') return string[1];
}
function softRound(number) {
	var number = Math.round(number);
	var len = String(number).length-2;
	var pow = Math.pow(10,len);
	var number = Math.round(number / pow) * pow;
	return number;
}
function duration(ms, ret) {
    var seconds = parseInt( (ms/1000) % 60);
    var minutes = parseInt( ( ms / (1000*60) ) % 60);
    var hours = parseInt( ( ms / (1000*3600) ) % 24);
    var days = parseInt( ( ms / (1000*86400) ) );

    var seconds = (seconds < 10) ? '0'+seconds : seconds;
    var minutes = (minutes < 10) ? '0'+minutes : minutes;
    var hours   = (hours < 10)   ? '0'+hours   : hours;

    if (ret == 'points') return days+':'+hours+':'+minutes+':'+seconds;
    return days+'d '+hours+'h '+minutes+'m '+seconds+'s';
}
function getID() {
	return rand(1,Number.MAX_SAFE_INTEGER).toString(36);
}
function screw(text) {
	var text = text.replace('&', '&amp');
	text = text.replace('<', '&lt');
	text = text.replace('>', '&gt');
	text = text.replace('"', '&quot');
	text = text.replace("'", "&#x27");
	text = text.replace('/', '&#x2F');

	var text2 = "";
	for (x in text) {
		if (!text[x]) continue;
		text2 += "%"+text[x].charCodeAt(0).toString(16);
	}
	return text2;
}
function drawBar(minValue,maxValue,returnValue) {
	var filledValue = Math.round(20*(minValue/maxValue));
	if (filledValue <= 0) {
	if (minValue > 0) {
	filledValue = 1;
	}
	}
	var pointArray = [];
	pointArray[0] = "";
	pointArray[1] = ".";
	var i = 2;
	var i2 = 1;
	while ( i <= 20 ) {
	pointArray[i] = pointArray[1]+pointArray[i2];
	i = i+1;
	i2 = i2+1;
	}
	var depletedValue = 20-filledValue;
	if (returnValue !== undefined) {
	return pointArray[filledValue];
	} else {
	return pointArray[depletedValue];
	}
}
function realDrawBar(min, max, alternate, colors) {
	var filled = drawBar(min, max, true);
	var depleted = drawBar(min, max);

	if (colors == undefined) colors = {};
	if (colors.filled == undefined) colors.filled = 'rgba(64, 255, 32, 0.8)';
	if (colors.quarter == undefined) colors.quarter = 'rgba(255, 16, 96, 0.8)';
	if (colors.half == undefined) colors.half = 'rgba(255, 192, 32, 0.8)';
	if (colors.full == undefined) colors.full = 'rgba(32, 200, 255, 0.8)';

	if (colors.depleted == undefined) colors.depleted = 'rgba(128, 128, 128, 0.5)';

	if (alternate) {
		filled = Math.ceil((min/max)*200);
		depleted = Math.floor((1 - (min/max))*200);
		if (min >= max) {
			filled = 200;
			depleted = 0;
		}
		var color = colors.filled;
		var percent = (min / max);
		if (percent >= 0.9) color = colors.full;
		if (percent > 0.25 && percent <= 0.5) color = colors.half;
		if (percent <= 0.25) color = colors.quarter;

		return '<span class="commonBlack">[</span><span class="commonFilled" style="display: inline-block; width: '+filled+'px; background-color: '+color+'">&gt</span><span class="commonDepleted" style="display: inline-block; width: '+depleted+'px;"></span><span class="commonBlack">]</span>';
	}
	return '<span class="commonBlack">[</span><span class="commonFilled">'+filled+'</span><span class="commonDepleted">'+depleted+'</span><span class="commonBlack">]</span>';
}
var notifObj = {
	'text': '',
	'moving': false,
	'opacity': 1,
}
function notify(textie, thees) {
	if (textie == 'hide') {
		notifObj.moving = true;
		return;
	}
	var maxW = thees.offsetWidth;
	var maxH = thees.offsetHeight;
	notifObj.text = textie;
	cursorX += 10;
	cursorY += 10;
	showNotif(cursorX, cursorY)
}
function showNotif(xx, yy) {
	notifObj.moving = false;
	notifObj.opacity = 0.9;
	doc('tooltipwr').style.left = xx+'px';
	doc('tooltipwr').style.top = yy+'px';
	doc('tooltipwr').style.opacity = 0.9;
}
function moveNotif() {
	if (!doc('tooltipwr')) return;
	if (notifObj.moving) {
		notifObj.opacity -= 0.1;
		if (notifObj.opacity <= 0) {
			notifObj.opacity = 0;
			notifObj.moving = false;
		}
	}
	doc('tooltipwr').style.opacity = notifObj.opacity;
	echo('tooltipwr', notifObj.text);
}
//var commonMoveNotif = setInterval(moveNotif, 10);
function round(num) {
	return Math.round(num*100)/100;
}

function isInside(what, array) {
	for (var ii in array) {
		if (array[ii] == what) return 1;
	}
}

function notification(notext) {
	if ($('#notifHolder')) $('body').append('<div id="notifHolder" style="position: fixed; bottom: 0; right: 0"></div>');
	var nots = $('.notification').length;
	var $obj = '<div class="notification" style="float: bottom; background-color: #111; color: #eee; border-radius: 8px; padding: 8px; margin: 8px">'+notext+'</div>'
	$('#notifHolder').prepend($obj);
	$('.notification').effect('highlight', 100).effect('highlight', 100);

	$('.notification').delay(5000).fadeOut(1000, function() {
		$(this).remove();
	});
}

function swapArray(array, index_a, index_b) {
	var placeholder = array[index_a];
	array[index_a] = array[index_b];
	array[index_b] = placeholder
	return array;
}


function romanNumber(num) {
	var values = [
	1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1
	];
	var replaceWith = [
	'M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'
	];

	var result = '';

	while (num > 0) {
		for (var v in values) {
			if (num >= values[v]) {
				result += replaceWith[v];
				num -= values[v];
				break;
			}
		}
	}
	return result;
}
function last(array) {
	return array[array.length-1];
}
function rchance(float) {
	if (Math.random() < float) return 1;
	return 0;
}
function lchance(hits, attempts) {
	return (hits + 1) / (attempts + 2);
}
function changes(changelogArray) {
	var newChangeLog = [];
	var clog = changelog;
	var version = [0, 0, 0, 0, 0];
	for (var c in clog) {
		var item = clog[c];
		var spl = item.split(' ');
		var i = spl[0];
		var index = i.length;
		var update_name = '';
		var flags = {
			//Alpha Flags
			'a': {'name': 'alpha', 'index': 1},
			'af': {'name': 'add', 'index': 1},
			'ax': {'name': 'fix', 'index': 2},
			'ab': {'name': 'bug', 'index': 3},

			//Beta Flags
			'b': {'name': 'beta', 'index': 0},
			'bf': {'name': 'add', 'index': 1},
			'bx': {'name': 'fix', 'index': 2},
			'bb': {'name': 'bug', 'index': 3},

			//Release Flags
			'r': {'name': 'release', 'index': 0},

			//Update Flags
			'uf': {'name': 'update', 'index': 0},
			'ux': {'name': 'patch', 'index': 1},
			'ub': {'name': 'hotfix', 'index': 2},
		}
		if (flags[i] != undefined) {
			index = flags[i].index;
			update_name = '-'+flags[i].name;
		}
		version.splice((index + 1));

		for (var vc = 0; vc <= index; vc++)  if (!version[vc]) version[vc] = 0;
		version[index] += 1;
		newChangeLog.push(version.join('.')+update_name+' '+spl.slice(1).join(' '));
	}
	newChangeLog = newChangeLog.reverse().join('<br>');
	return {
		'latestVersion': version.join('.'),
		'changelog': newChangeLog,
	}
}
function showChangeLog() {
	var l = '';
	var oc = "this.style.display = 'none'";
	l += '<div style="padding: 8px; position: fixed; display: block; top: 0; left: 0; z-index: 9999999; width: 100%; height: 100%; background-color: black; color: white; font-size: 1.5em; overflow-y: scroll" onclick="'+oc+'">';
	l += gameInfo.changelog;
	l += '<div>';

	document.body.innerHTML += l;
}
function marketPrice(value = 1, base = 1, trend = 0) {
	var min = base * 0.5;
	var max = base * 2;

	var upchances = min / value;
	var downchances = value / max;

	var maxchance = upchances + downchances;
	var rng = Math.random() * maxchance;

	var variation = (base * 0.1) * Math.random();
	var mod = (rng <= upchances) ? 1 : -1;
	if (trend != 0) mod = (trend < 0) ? -1 : 1;
	value = value + (variation * mod);
	if (value < 0.01) value = 0.01;

	return value;
}
function flashText(where, text, color, elmode) {
	var flasher = 'flasher-'+getID();
	var flashel = document.createElement('flasher');
	flashel.id = flasher;

	where = $(where).offset();
	flashel.style.top = (where.top + rand(-10, 10))+'px';
	flashel.style.left = ((where.left - 10) + rand(-10, 10))+'px';

	if (!color) color = '';

	flashel.className = color;

	flashel.innerHTML = text;

	document.body.appendChild(flashel);

	$(flashel).animate({top: '-=5'}, 2000).fadeOut(2000);
	setTimeout(function() {
		$(flashel).remove();
	}, 4000);
}
function marketGraph(array = [0, 0], cwidth = 600, cheight = 100, customin, customax) {
	var c = document.createElement('canvas');
	c.style.width = cwidth+'px';
	c.style.height = cheight+'px';
	c.width = cwidth
	c.height = cheight;
	var ctx = c.getContext('2d');

	var amin = Infinity;
	var amax = -Infinity
	for (var a in array) {
		var aa = array[a];
		if (aa > amax) amax = aa;
		if (aa < amin) amin = aa;
	}
	if (customin != undefined) amin = customin;
	if (customax != undefined) amax = customax;

	var pointer;
	for (var a in array) {
		var value = array[a];
		var rvalue = value - amin;

		var posy = (1 - (rvalue / (amax - amin))) * cheight;
		if (amin == amax) posy = 0;
		var posx = (parseInt(a) / array.length) * cwidth;

		if (!pointer) pointer = {'x': posx, 'y': posy};
		canvasLine(ctx, pointer, {'x': posx, 'y': posy});
		pointer = {'x': posx, 'y': posy};
	}

	return c;
}
function canvasLine(ctx, from, to) {
	ctx.beginPath();
	ctx.moveTo(from.x, from.y);
	ctx.lineTo(to.x, to.y);
	ctx.stroke();
}
function alsoTry() {
	var moreStuff = [
		{'name': 'artillery', 'url': '../artillery/index.html'},
		{'name': 'Quimera Cards', 'url': '../cards/index.html'},
		{'name': 'Lemontastic! Casino', 'url': '../casino/home.html'},
		{'name': 'cell', 'url': '../cell/index.html'},
		{'name': 'Combine!', 'url': '../combine/index.html'},
		{'name': 'Lemontactics!', 'url': '../coonwars/index.html'},
		{'name': 'Crypt', 'url': '../crypt/home.html'},
		{'name': 'god', 'url': '../god/index.html'},
		{'name': 'home', 'url': '../home/index.html'},
		{'name': 'ldls', 'url': '../ldls/index.html'},
		{'name': 'Lemontastic!', 'url': '../lemontastic/home.html'},
		{'name': 'Lemontastic! BETA', 'url': '../lemontastic/beta/home.html'},
		{'name': 'LODO', 'url': '../lodo/index.html'},
		{'name': 'Catch the Mice', 'url': '../mice/index.html'},
		{'name': 'RiPPER', 'url': '../ripper/index.html'},
		{'name': 'Random World', 'url': '../rw/home.html'},
		{'name': 'Space Survival', 'url': '../spaces/index.html'},
		{'name': 'Stalk Market', 'url': '../stalk/index.html'},
		{'name': 'td', 'url': '../td/index.html'},
		{'name': 'Diogenesis', 'url': '../test/flohmarkt/index.html'},
		{'name': 'Ship WIP', 'url': '../test/ship/index.html'},
		{'name': 'Painter', 'url': '../test/painter.html'},
		{'name': 'Prng', 'url': '../test/prng.html'},
		{'name': 'zoonbie killa', 'url': '../test/zk.html'},
		{'name': 'waitQuest', 'url': '../waitquest/index.html'},
	];
	var sel = read(moreStuff);
	return translate('Prueba también <a href="'+sel.url+'" target="_blank">'+sel.name+'</a>|Also try <a href="'+sel.url+'" target="_blank">'+sel.name+'</a>');
}


romanNumber(1);

//Copyright 2014-2015 (c) Kulivszk - Arch Lemon Studios

/*

//Google Analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58277244-1', 'auto');
  ga('send', 'pageview');

  */


//Get cursor coordinates
var cursorX;
var cursorY;
var maxX;
var maxY;
document.onmousemove = function(position){
    cursorX = position.pageX;
    cursorY = position.pageY;

    maxX = Math.floor(window.innerWidth/2);
	maxY = Math.floor(window.innerHeight/2);
}