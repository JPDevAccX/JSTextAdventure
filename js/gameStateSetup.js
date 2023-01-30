// Type: Module

import GameStateSetupRooms from "./gameStateSetupRooms.js" ;

export default class GameStateSetup {
	static setup(gameData) {
		const gameState = {} ;
		// Misc
		gameState.introText = gameData.introText ;
		gameState.startRoomId = gameData.gameMap.startRoomId ;
		// Rooms
		gameState.roomsById = GameStateSetupRooms.setup(gameData) ;

		return gameState ;
	}
}