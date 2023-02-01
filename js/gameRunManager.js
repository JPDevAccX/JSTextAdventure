// Type: Module
import GameStateSetup from "./gameStateSetup.js" ;
import CommandParser from "./commandParser.js" ;
import OutputBuffer from "./outputBuffer.js";
import Player from "./entityTypes/player.js";

const VALID_TRAVEL_DIRECTIONS = ['n', 'e', 's', 'w', 'u', 'd']

export default class GameRunManager {
	newRun(gameData) {
		this.commandParser = new CommandParser() ;
		this.gameState = GameStateSetup.setup(gameData) ; // Set up initial state from game data
		this.gameState = { // Merge in player state, etc
			...this.gameState,
			...{
				player : new Player(),
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

		// Basic commands
		if (commandData.commandType === 'COM') {
			// Inventory
			if (commandData.command === 'inventory') {
				this.outInfo("You are carrying " + (this.gameState.player.inventory.getContentsDescription() || 'nothing')) ;
			}
		}
		// Basic verb-noun commands
		else if (commandData.commandType === 'VN') {
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
				const matchingItem = this.gameState.player.currentRoom.contents.retrieveItemWithName(commandData.object) ;
				if (matchingItem) this.outInfo("The " + matchingItem.name +" is " + matchingItem.description) ;
				else this.outErr("I cannot see any '"+ commandData.object +"' here")
			}
			// Get
			else if (commandData.verb === 'get') {
				const matchingItem = this.gameState.player.currentRoom.contents.retrieveItemWithName(commandData.object) ;
				if (matchingItem) {
					// TODO: Any extra checks that item can actually be picked up by player
					this.gameState.player.currentRoom.contents.moveItem(matchingItem, this.gameState.player.inventory) ;
					this.outInfo("Picked up the [b]" + matchingItem.name + "[/b]") ;
				}
				else this.outErr("I cannot see any '"+ commandData.object +"' here")
			}
			// Drop
			else if (commandData.verb === 'drop') {
				const matchingItem = this.gameState.player.inventory.retrieveItemWithName(commandData.object) ;
				if (matchingItem) {
					// TODO: Any extra checks that item can actually be dropped by player
					this.gameState.player.inventory.moveItem(matchingItem, this.gameState.player.currentRoom.contents) ;
					this.outInfo("Dropped the [b]" + matchingItem.name + "[/b]") ;
				}
				else this.outErr("I don't have any '"+ commandData.object +"' in my inventory")
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