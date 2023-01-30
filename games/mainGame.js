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
		}
	}
} ;