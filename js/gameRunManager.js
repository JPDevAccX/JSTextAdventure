// Type: Module
import GameStateSetup from "./gameStateSetup.js" ;
import CommandParser from "./commandParser.js" ;

const VALID_TRAVEL_DIRECTIONS = ['n', 'e', 's', 'w', 'u', 'd']

export default class GameRunManager {
	newRun(gameData) {
		this.commandParser = new CommandParser() ;
		this.gameState = GameStateSetup.setup(gameData) ; // Setup intitial state from game data
		this.gameState = { // Merge in player state, etc
			...this.gameState,
			...{
				player : {},
				score: 0,
				lastErrorMsg: null
			}
		} ;

		// Retrieve start room and set it as player's current location
		this.gameState.player.currentRoom = GameRunManager.findStartRoom(this.gameState.roomsById, this.gameState.startRoomId) ;

		// Return current game state
		return ['g', this.gameState] ;
	}
	
	static findStartRoom(roomsById, startRoomId) {
		for (const [roomId, room] of Object.entries(roomsById)) {
			if (roomId === startRoomId) return room ;
		}
		console.error("Could not find start room") ;
		return null ;
	}

	runCommand(command) {
		this.gameState.lastErrorMsg = null ;
		const commandData = this.commandParser.parseCommand(command) ;

		// Basic verb-noun commands
		if (commandData.commandType === 'VN') {
			// Travel
			const dest = commandData.object ;
			if (VALID_TRAVEL_DIRECTIONS.includes(dest)) {
				const linkedRoom = this.gameState.player.currentRoom.getLinkedRoom(dest) ; ;
				if (linkedRoom)	this.gameState.player.currentRoom = linkedRoom ;
				else {
					this.gameState.lastErrorMsg = 'You cannot go in that direction' ;
					alert(this.gameState.lastErrorMsg) ;
				} 
			}
			else {
				this.gameState.lastErrorMsg = 'Unknown direction' ;
				alert(this.gameState.lastErrorMsg) ;
			}
		}
		else {
			this.gameState.lastErrorMsg = 'Unknown command' ;
				alert(this.gameState.lastErrorMsg) ;
		}

		// Return current game state
		return ['g', this.gameState] ;
	}
}