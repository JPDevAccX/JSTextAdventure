// Type: Module

import GameStateSetupItems from "./gameStateSetupItems.js" ;
import GameStateSetupRooms from "./gameStateSetupRooms.js" ;

export default class GameStateSetup {
	static setup(gameData) {
		const gameState = {} ;
		// Misc
		gameState.introText = gameData.introText ;
		gameState.startRoomId = gameData.gameMap.startRoomId ;
		// Items
		gameState.itemsById = GameStateSetupItems.setup(gameData) ;
		// Rooms
		gameState.roomsById = GameStateSetupRooms.setup(gameData, gameState.itemsById) ;

		console.log("GameStateSetup() : Initial game state:", gameState) ;

		return gameState ;
	}
}