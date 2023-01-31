// Type: Module

export default {
	settings: {
	},
	introText: "This is a daring adventure through a dungeon dark and...damp. Probably pretty cold as well so I'd wrap up warm. Also there might be monsters and treasure.",
	gameMap: {
		idLength: 4,
		dims: {
			x: 3,
			y: 3,
			z: 1
		},
		startRoomId: 'HOME',
		data: `
			|TRE1|      |TRA1|
			|PUZ1||HOME||DEN1|
			|MON1||CRO1||PUZ2|
		`,
	},
	roomDefs: {
		'HOME' : {
			name: "Home",
			description: "It's home! It's where you start!"
		},
		'TRE1' : {
			name: "Treasure Room 1",
			description: "It's a treasure room! Treasure be here!"
		},
		'TRA1' : {
			name: "Trap Room",
			description: "It's a trap! Run away!"
		},
		'PUZ1' : {
			name: "Puzzle Room",
			description: "It's a puzzle room. Very puzzling."
		},
		'DEN1' : {
			name: "Dead End",
			description: "This is just a dead end. How boring."
		},
		'MON1' : {
			name: "Monster Room",
			description: "There could be a monster in here. I would watch out."
		},
		'CRO1' : {
			name: "Crossroads",
			description: "Which way? East or West?"
		},
		'PUZ2' : {
			name: "Another Puzzle Room",
			description: "More puzzling than the last."
		}
	}
} ;