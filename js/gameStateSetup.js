// Type: Module

import GameStateSetupItems from "./gameStateSetupItems.js" ;
import GameStateSetupNPCs from "./gameStateSetupNPCs.js";
import GameStateSetupRooms from "./gameStateSetupRooms.js" ;

export default class GameStateSetup {
	static setup(gameData) {
		const gameState = {} ;
		// Misc
		gameState.introText = gameData.introText ;
		gameState.startRoomId = gameData.gameMap.startRoomId ;
		// Items
		gameState.itemsById = GameStateSetupItems.setup(gameData) ;
		// NPCs
		gameState.nonPlayerCharactersById = GameStateSetupNPCs.setup(gameData, gameState.itemsById) ;
		// Rooms
		gameState.roomsById = GameStateSetupRooms.setup(gameData, gameState.itemsById, gameState.nonPlayerCharactersById) ;

		console.log("GameStateSetup() : Initial game state:", gameState) ;

		return gameState ;
	}
}