// Type: Module
import GameStateSetup from "./gameStateSetup.js" ;

export default class GameRunManager {
	newRun(gameData) {
		this.gameState = GameStateSetup.setup(gameData) ; // Setup intitial state from game data
		this.gameState = { // Merge in player state
			...this.gameState,
			...{
				player : {},
				score: 0
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
		console.log("Command:", command)
		// TODO
		
		// Return current game state
		return ['g', this.gameState] ;
	}
}