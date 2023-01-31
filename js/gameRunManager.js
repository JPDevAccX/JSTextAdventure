// Type: Module
import GameStateSetup from "./gameStateSetup.js" ;
import CommandParser from "./commandParser.js" ;
import OutputBuffer from "./outputBuffer.js";

const VALID_TRAVEL_DIRECTIONS = ['n', 'e', 's', 'w', 'u', 'd']

export default class GameRunManager {
	newRun(gameData) {
		this.commandParser = new CommandParser() ;
		this.gameState = GameStateSetup.setup(gameData) ; // Set up initial state from game data
		this.gameState = { // Merge in player state, etc
			...this.gameState,
			...{
				player : {},
				score: 0,
				outputBuffer: new OutputBuffer()
			}
		} ;

		// Retrieve start room and set it as player's current location
		this.gameState.player.currentRoom = GameRunManager.findStartRoom(this.gameState.roomsById, this.gameState.startRoomId) ;

		// Initial room description
		this.gameState.outputBuffer.add(this.gameState.player.currentRoom.getFullDescription()) ;

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
		if (command === '') return ['g', this.gameState] ; // Ignore blank commands
		
		this.outCommand(command) ;
		const commandData = this.commandParser.parseCommand(command) ;

		// Basic verb-noun commands
		if (commandData.commandType === 'VN') {
			// Travel
			if (commandData.verb === 'go') {
				const dest = commandData.object ;
				if (VALID_TRAVEL_DIRECTIONS.includes(dest)) {
					const linkedRoom = this.gameState.player.currentRoom.getLinkedRoom(dest) ; ;
					if (linkedRoom)	{
						this.gameState.player.currentRoom = linkedRoom ; // Move player
						this.gameState.outputBuffer.clear() ;
						this.outInfo(linkedRoom.getFullDescription()) ;
					}
					else {
						this.outErr('You cannot go in that direction') ;
					} 
				}
				else {
					this.outErr('Unknown direction') ;
				}
			}
			// Examine
			else if (commandData.verb === 'examine') {
				const matchingItem = this.gameState.player.currentRoom.retrieveItemWithName(commandData.object) ;
				if (matchingItem) this.outInfo("The " + matchingItem.name +" is " + matchingItem.description) ;
				else this.outErr("I cannot see any '"+ commandData.object +"' here")
			}
		}
		else {
			this.outErr('Unknown command "'+ command + '"') ;
		}

		// Return current game state
		return ['g', this.gameState] ;
	}

	outCommand(msg) {
		this.gameState.outputBuffer.add('> ' + msg) ;
	}
	outInfo(msg) {
		this.gameState.outputBuffer.add(msg) ;
	}
	outErr(msg) {
		this.gameState.outputBuffer.add('> [err]' + msg + '[/err]') ;
	}
}