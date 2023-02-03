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
			|TRE1|      |DEN1|
			|PUZ1||HOME||TRA1|
			|MON1||CRO1||PUZ2|
		`,
	},
	roomDefs: {
		'HOME' : {
			name: "Home",
			description: "It's home! It's where you start!",
			contents: [
				'TESTITEM', 'TESTCONTAINER', 'LOCKABLETESTCONTAINER', 'TESTKEY', 'TESTNPC', 
				'TESTPLAYERATTACKITEM', 'TESTPLAYERATTACKITEM2','TESTCONSUMABLEITEM1','TESTCONSUMABLEITEM2'
			]
		},
		'TRE1' : {
			name: "Treasure Room 1",
			description: "It's a treasure room! Treasure be here!"
		},
		'DEN1' : {
			name: "Dead End",
			description: "This is just a dead end. How boring."
		},
		'PUZ1' : {
			name: "Puzzle Room",
			description: "It's a puzzle room. Very puzzling."
		},
		'TRA1' : {
			name: "Trap Room",
			description: "It's a trap! Run away!"
		},
		'MON1' : {
			name: "Monster Room",
			description: "There could be a monster in here. I would watch out."
		},
		'CRO1' : {
			name: "Crossroads",
			description: "Which way? East or West?",
			contents: ['TESTENEMYNPC']
		},
		'PUZ2' : {
			name: "Another Puzzle Room",
			description: "More puzzling than the last."
		}
	},
	itemDefs: {
		'TESTITEM' : {
			name: "TestItem",
			description: "a test item for testing! That's all.",
		},
		'TESTITEM2' : {
			name: "TestItem2",
			description: "a test item in a container for testing.",
		},
		'TESTCONTAINER' : {
			name: "TestContainer",
			description: "a test container for testing!",
			contents: ['TESTITEM2'],
		},
		'LOCKABLETESTCONTAINER' : {
			name: "LockableTestContainer",
			description: "a lockable test container for testing!",
			contents: [],
			lockingItem: 'TESTKEY',
		},
		'TESTKEY' : {
			name: "TestKey",
			description: "a test key (which is just another item)",
		},
		'TESTUSEFULITEM1': {
			name: "TestUsefulItem1",
			description: "a test useful item (1)",
		},
		'TESTUSEFULITEM2': {
			name: "TestUsefulItem2",
			description: "a test useful item (2)",
		},
		'TESTENEMYATTACKITEM': {
			name: "TestEnemyAttackItem",
			description: "a test enemy attack item",
			attackStrength: 20
		},
		'TESTPLAYERATTACKITEM': {
			name: "TestPlayerAttackItem",
			description: "a test player attack item",
			attackStrength: 100
		},
		'TESTPLAYERATTACKITEM2': {
			name: "TestPlayerAttackItem2",
			description: "a test player attack item (2)",
			attackStrength: 100
		},
		'TESTCONSUMABLEITEM1': {
			name: "TestConsumableItem1",
			description: "a test consumable item (1)",
			health: 10
		},
		'TESTCONSUMABLEITEM2': {
			name: "TestConsumableItem2",
			description: "a test consumable item (2)",
			health: -100
		}
	},
	npcDefs: {
		'TESTNPC': {
			name: "TestNPC",
			description: "a friendly test NPC for testing!",
			greetingMessages: ["Test greeting message (1)!", "Test greeting message (2)!"],
			inventory: ["TESTUSEFULITEM1"],
			tradeInventoryForItemList: ["TESTUSEFULITEM2"]
		},
		'TESTENEMYNPC': {
			name: "TestEnemyNPC",
			description: "an enemy test NPC for testing!",
			greetingMessages: ["Angry test greeting message (1)!", "Angry test greeting message (2)!"],
			inventory: ["TESTENEMYATTACKITEM"],
			attackItem: "TESTENEMYATTACKITEM",
			vulnerabiltyItemList: ["TESTPLAYERATTACKITEM"],
			health: 300
		}
	},
	winCondition: {
		type: 'ENTER_ROOM', /* currently ignored as is only type supported */
		targetId: 'DEN1' /* room id */
	}
} ;