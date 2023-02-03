// Type: Module

export default {
	settings: {
	},
	introText: "This is a daring adventure through a dungeon dark and...damp. Probably cold as well so I'd wrap up warm. Also there might be monsters and treasure. Definitely no guarantee on the treasure though.",
	gameMap: {
		idLength: 4,
		dims: {
			x: 7,
			y: 7,
			z: 1
		},
		startRoomId: 'ENTR',
		data: `
			|    ||RPCH||    ||ENTR||    ||    ||    |
			|    ||CHMO||    ||HAL1||    ||STR2||OFFI|
			|    ||BARR||    ||HAL2||    ||STR1||    |
			|HEAL||MARB||WEST||CRO1||EAST||CRO2||    |
			|    ||    ||    ||DARK||    ||JANI||EMO1|
			|    ||    ||    ||    ||    ||    ||EMO2|
			|    ||    ||    ||    ||    ||    ||EXIT|
		`,
	},
	roomDefs: {
		'ENTR' : {
			name: "Entrance",
			description: "The entrance to the dungeon. Are you sure you want to go in here? You could just stay outside and admire the rockfall that just now blocked your path back home if you think that's a better idea.",
		},
		'HAL1' : {
			name: "Dark Hallway",
			description: "It's a dark hallway. It's too dark to be much more descriptive than that. An image would probably help but this is a traditional hardcore adventure game so we'll have to make do without."
		},
		'HAL2' : {
			name: "Darker Hallway",
			description: "It's a slightly darker hallway. You really can't see anything down here. You feel that a map would be comforting at this point but there doesn't seem to be one. You have a suspicion that the developer actually just ran out of time and is making excuses for all these missing features."
		},
		'CRO1' : {
			name: "Crossroads",
			description: "It's still really dark but you can hear the sound of dripping water from a few directions which hints that there are other exits out of this room."
		},
		'DARK' : {
			name: "Dark Room",
			description: "You thought it was dark before! This is blacker than black and also seems to be a dead end! You really better get out of here before a Grue finds you."
		},
		'WEST' : {
			name: "Passageway leading up",
			description: "You're in another passageway, with a slight inclination going up towards the West. At the top you can dimly make out a door, outlined by flickering light from the other side."
		},
		'MARB': {
			name: "Marble room",
			description: "The gloomy brick and stone that make up the walls of the lower parts of the dungeon give way to stunning black marble. There are lit torches on the wall and, while they give a comforting glow, you do wonder to yourself who tends to this place and how friendly they'd be if you ran into them.",
			contents: ['MARBLES']
		},
		'EAST': {
			name: "Eastwards Passageway",
			description: "This passageway goes East. You can easily tell because it's called the 'Eastwards Passageway'. No compass needed here."
		},
		'EXIT': {
			name: "Dungeon Exit",
			description: "The exit! You found it! You can now escape with all the treasure you found! Hang on. I didn't find any treasure. I don't even know why I came down here to this cold dark dungeon! For the next adventure I'm going somewhere warm and sunny instead. Maybe Florida.",
		},
		'CRO2': {
			name: "Intersection",
			description: "This looks like another crossroads but it isn't. It's an intersection. Don't let the ID name in the game's data-file mislead you. It looks like you have three directions you can go in from here. Don't get too excited though - one of those only leads back to wherever you just came from.",
			contents: ["MUSHROOM"]
		},
		'JANI': {
			name: "Janitor's Closet",
			description: "There are buckets, mops, and other cleaning supplies here. You didn't know that Dungeons had Janitors but who knows, maybe it's some new health&safety regulation. Hang on a sec, there's also a sign here indicating that the exit is to the east! Let's get out of here already!",
			contents: ["BUCKET"]
		},
		'EMO1': {
			name: "Exit Corridor",
			description: "The exit is up ahead. I hope there aren't any monsters around. I've played enough video games to be wary.",
			contents: ["EXITMON1"]
		},
		'EMO2': {
			name: "Exit Corridor",
			description: "I should have guessed there'd be monsters guarding the way out. At least they're gone now. At least I can't see any in front of me.",
			contents: ["EXITMON2"]
		},
		'STR1': {
			name: "Strange Corridor",
			description: "This corridor is littered with computer printouts and strange notes scribbled on the walls. Since when do dungeons even have computers?",
		},
		'STR2': {
			name: "More Strange Corridor",
			description: "The corridor becomes more and more untidy towards the North. It looks like there's an office door at the end.",
		},
		'OFFI': {
			name: "Dungeon Administration",
			description: "Aah bureaucracy, you can't escape it how ever far underground you go. The office you now find yourself in looks modern and is well-lit. Your eyes struggle to adjust to the sudden change in brightness but as they do, you make out a strange looking man muttering in the corner of the room.",
			contents: ["OFFICEGUY"]
		},
		'BARR': {
			name: "Barricaded Room",
			description: "It looks like the occupants of this room left in a rush. The exit to the North is barracaded but it was clearly done with little time to spare and you think you can squeeze through if you're silly enough to go in that direction.",
		},
		'CHMO': {
			name: "Chest Guardian Lair",
			description: "Uh oh! There's definite monster signs around here!",
			contents: ["CHESTMON"]
		},
		'RPCH': {
			name: "Chest Room",
			description: "Either this is a room for chest examinations or for chests! You hope the latter and you especially hope that the chests in question have treasure in them. You expect to be dissapointed however.",
			contents: ["REDCHEST"]
		},
		'HEAL': {
			name: "Potion Room",
			description: "According to the sign on the wall, this is a 'Potion Room' - whether for making or storing them you're not sure. Either way, there's not much here. Mostly just cracked glassware.",
			contents: ["POTION"]
		}
	},
	itemDefs: {
		'MARBLES' : {
			name: "bag-of-marbles",
			description: "a small bag of Marbles found in the Marble Room. They're very pretty although that doesn't mean much around this dimly lit place.",
			contents: ['REDMARBLE', 'GREENMARBLE', 'BLUEMARBLE']
		},
		'REDMARBLE' : {
			name: "red-marble",
			description: "a red marble. It seems to be identical in every detail to the other marbles from the bag except for its colour.",
		},
		'GREENMARBLE' : {
			name: "green-marble",
			description: "a green marble. It seems to be identical in every detail to the other marbles from the bag except for its colour.",
		},
		'BLUEMARBLE': {
			name: "blue-marble",
			description: "a blue marble. It seems to be identical in every detail to the other marbles from the bag except for its colour.",
		},
		'MUSHROOM': {
			name: "mushroom",
			description: "a delicious-looking mushroom. Smells great too! Nothing more nutritious and vitality-boosting than some fresh dungeon fungi.",
			health: -999
		},
		'BUCKET': {
			name: "bucket",
			description: "a delicious-looking mushroo...sorry, that was the last item. Copy and paste be damned. Well, what do you want me to say? A bucket is a bucket...and this is a bucket! Could be useful for holding stuff. Or not.",
			attackStrength: 50
		},
		'REDPAINT': {
			name: "red-paint",
			namingFlags: 'p',
			description: "a bucket of red paint - there are a lot of buckets in this game",
			attackStrength: 100
		},
		'BLUEPAINT': {
			name: "blue-paint",
			namingFlags: 'p',
			description: "a bucket of blue paint - there are many buckets around here for some reason",
			attackStrength: 100
		},
		'REDKEY': {
			name: "red-key",
			description: "an ornate red key",
		},
		'TENTACLE': {
			name: "tentacle",
			description: "tentacle",
			attackStrength: 50 /* 2 hits to kill player with default health */
		},
		'STICK': {
			name: "stick",
			description: "a stick for hitting adventurers with - they seem to be popular around here although this one looks really worn out",
			attackStrength: 10
		},
		'POTION': {
			name: "potion",
			description: "a suspicious-looking potion - I really wouldn't drink it if I were you",
			health: 30 /* player has to take 10*2 + 50*2 = 120 damage as a minimum so this is required (and there is no room for error) */
		},
		'REDCHEST': {
			name: "red-chest",
			description: "a red chest! Because you really want your chests to stand out.",
			contents: ['REDPAINT'],
			lockingItem: 'REDKEY',
		}
	},
	npcDefs: {
		'CHESTMON': {
			name: "Chesty",
			description: "a particular type of monster with a penchant for hanging out near chests - the motive is always the same though - catch / kill / eat hapless adventurers",
			greetingMessages: [
				"GROOOOOOOOOOOO!",
				"GROOO!",
				"No, I told you, I don't need insurance...hey, don't creep up on me like that! GROOOOOOOOOOOOOO! DIE PUNY ADVENTURER!"
			],
			attackItem: "STICK",
			vulnerabiltyItemList: ["BUCKET"]
		},
		'EXITMON1': {
			name: "Blue-Larry",
			description: "a typical lazy monster, guarding an exit to catch naive and unsuspecting adventurers",
			greetingMessages: [
				"Grug Ugh Glug!",
				"Ugh Glug Grug!",
				"Gloog Og Oog!",
				"Hey? Has anyone seen my Dungeoneer hitting-at-a-long-distance stick?",
				"I swear I left my Dungeoneer hitting-at-a-long-distance stick right by the door"
			],
			attackItem: "TENTACLE",
			vulnerabiltyItemList: ["REDPAINT"]
		},
		'EXITMON2': {
			name: "Red-Harry",
			description: "another typical lazy monster - they really should get out more and see the world",
			greetingMessages: [
				"Grug Ugh Glug Glug!",
				"Ugh Glug Grug Grug!",
				"Gloog Og Oog Oog!",
				"Don't tell Larry I broke his stick or I'll eat you. Hey, why don't I just eat you anyway? ",
				"Have you met Larry? He's my brother. If he doesn't want you for dinner, that's fine by me!"
			],
			attackItem: "TENTACLE",
			vulnerabiltyItemList: ["BLUEPAINT"]
		},
		'OFFICEGUY': {
			name: "OfficeGuy-the-Immortal",
			description: "a regular (albeit immortal) office worker. He seems agitated - but then wouldn't you be if you worked in a dungeon office? You also notice that he has the brightest green eyes that you have ever seen, sparkling even in the bright light of the office.",
			greetingMessages: [
				"Hey? You wanna get out of here? I have some things you might want if you have something interesting for me in return...",
				"I don't like most colours that much. But green. I love green! Maybe we could make a trade?"],
			inventory: ["BLUEPAINT", "REDKEY"],
			tradeInventoryForItemList: ["GREENMARBLE"]
		}
	},
	winCondition: {
		type: 'ENTER_ROOM', /* currently ignored as is only type supported */
		targetId: 'EXIT' /* room id */
	}
} ;