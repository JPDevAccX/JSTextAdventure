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
				this.outInfo("You are carrying " + (this.gameState.player.getInventoryDescription() || 'nothing')) ;
			}
			// Look
			else if (commandData.command === 'look') {
				this.outInfo(this.gameState.player.currentRoom.getFullDescription()) ;
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
				let description = null ;
				const { matchingItemWithContainer } = this.retrieveObject(commandData.object, true, true, true) ;
				if (matchingItemWithContainer) description = matchingItemWithContainer.item.getFullDescription() ;
				else {
					const matchingNPC = this.gameState.player.currentRoom.retrieveNPCWithName(commandData.object) ;
					if (matchingNPC) description = "[b]" + matchingNPC.name + "[/b] is " + matchingNPC.description ;
				}
				if (description) this.outInfo(description) ;
				else this.outErr("I cannot see any '"+ commandData.object +"' here") ;
			}
			// Get
			else if (commandData.verb === 'get') {
				const { matchingItemWithContainer } = this.retrieveObject(commandData.object, true, false) ;
				if (matchingItemWithContainer) {
					// TODO: Any extra checks that item can actually be picked up by player
					this.gameState.player.currentRoom.moveItem(matchingItemWithContainer.item, this.gameState.player.inventory) ;
					this.outInfo("Picked up the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ;
				}
			}
			// Drop
			else if (commandData.verb === 'drop') {
				const { matchingItemWithContainer } = this.retrieveObject(commandData.object, false, true) ;
				if (matchingItemWithContainer) {
					// TODO: Any extra checks that item can actually be dropped by player
					this.gameState.player.moveItem(matchingItemWithContainer.item, this.gameState.player.currentRoom.contents) ;
					this.outInfo("Dropped the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ;
				}
			}
			// Open
			else if (commandData.verb === 'open') {
				const { matchingItemWithContainer } = this.retrieveObject(commandData.object) ;
				if (matchingItemWithContainer) {
					if (matchingItemWithContainer.item.open) {
						const result = matchingItemWithContainer.item.open() ;
						if (result === 'already_opened') this.outErr("The [b]" + matchingItemWithContainer.item.rawName + "[/b] is already open") ;
						else if (result === 'locked') this.outErr("The [b]" + matchingItemWithContainer.item.rawName + "[/b] is locked") ;
						else {
							this.outInfo("You opened the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ;
							const contentsDescription = matchingItemWithContainer.item.getContentsDescription() ;
							if (contentsDescription) this.outInfo("Inside you see " + contentsDescription) ;
						}
					}
					else this.outErr("I can't open the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ; // (not a container)
				}
			}
			// Close
			else if (commandData.verb === 'close') {
				const { matchingItemWithContainer } = this.retrieveObject(commandData.object) ;
				if (matchingItemWithContainer) {
					if (matchingItemWithContainer.item.close) {
						const result = matchingItemWithContainer.item.close() ;
						if (result === 'already_closed') this.outErr("The [b]" + matchingItemWithContainer.item.rawName + "[/b] is already closed") ;
						else this.outInfo("You closed the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ;
					}
					else this.outErr("I can't close the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ; // (not a container)
				}
			}
			// Unlock
			else if (commandData.verb === 'unlock') {
				const { matchingItemWithContainer } = this.retrieveObject(commandData.object) ;
				if (matchingItemWithContainer) {
					if (matchingItemWithContainer.item.unlock) {
						const lockingItem = matchingItemWithContainer.item.lockingItem ;
						let lockAttemptItem = null ;
						if (lockingItem && this.gameState.player.isItemAccessible(lockingItem)) {
							lockAttemptItem = lockingItem ;
						}
						const result = matchingItemWithContainer.item.unlock(lockAttemptItem) ;
						if (result === 'no_lock') this.outErr("There is no lock on the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ;
						else if (result === 'already_unlocked') this.outErr("The [b]" + matchingItemWithContainer.item.rawName + "[/b] is already unlocked") ;
						else if (result === 'wrong_locking_item') {
							this.outErr("You don't have the key to the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ;
						}
						else this.outInfo("You unlocked the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ;
					}
					else this.outErr("There is no lock on the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ; // (not a container)
				}
			}
			// Lock
			else if (commandData.verb === 'lock') {
				const { matchingItemWithContainer } = this.retrieveObject(commandData.object) ;
				if (matchingItemWithContainer) {
					if (matchingItemWithContainer.item.lock) {
						const lockingItem = matchingItemWithContainer.item.lockingItem ;
						let lockAttemptItem = null ;
						if (lockingItem && this.gameState.player.isItemAccessible(lockingItem)) {
							lockAttemptItem = lockingItem ;
						}
						const result = matchingItemWithContainer.item.lock(lockAttemptItem) ;
						if (result === 'no_lock') this.outErr("There is no lock on the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ;
						else if (result === 'already_locked') this.outErr("The [b]" + matchingItemWithContainer.item.rawName + "[/b] is already locked") ;
						else if (result === 'wrong_locking_item') {
							this.outErr("You don't have the key to the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ;
						}
						else this.outInfo("You locked the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ;
					}
					else this.outErr("There is no lock on the [b]" + matchingItemWithContainer.item.rawName + "[/b]") ; // (not a container)
				}
			}
		}
		else {
			this.outErr('Unknown command "'+ command + '"') ;
		}

		// Return current game state
		return ['g', this.gameState] ;
	}

	retrieveObject(itemName, includeRoom = true, includeInventory = true, noError = false) {
		let matchingItemWithContainer = null ;
		let srcLoc = null ;
		// (order shouldn't matter here - if there are two items with the same name then it's going to be a big problem in any case)
		if (includeRoom) {
			matchingItemWithContainer = this.gameState.player.currentRoom.retrieveItemWithName(itemName) ;
			srcLoc = 'r' ;
		}
		if (!matchingItemWithContainer && includeInventory) {
			matchingItemWithContainer = this.gameState.player.retrieveItemWithName(itemName) ;
			srcLoc = 'i'
		}
		if (!noError) {
			if (!matchingItemWithContainer && includeRoom) this.outErr("I cannot see any '"+ itemName +"' here") ;
			else if (!matchingItemWithContainer) this.outErr("I don't have any '"+ itemName +"' in my inventory")
		}
		return {matchingItemWithContainer, srcLoc} ;
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