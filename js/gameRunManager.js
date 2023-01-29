// Type: Module

export default class GameRunManager {
	newRun(gameData) {
		this.gameData = gameData ;
		this.gameState = {
			player : {},
			currentRoom: {},
			score: 0
		} ;

		// Retrieve start room absolute coords and move player there
		this.playerHomeCoords = this.getAbsCoordsForRoomId(gameData.gameMap.startRoomId) ;
		this.movePlayerToRoomWithAbsCoords(gameData.gameMap.startRoomId, this.playerHomeCoords) ;
		
		// Return current game state
		return ['g', this.gameState] ;
	}
	
	getAbsCoordsForRoomId(targetRoomId) {
		const gameMap = this.gameData.gameMap ;
		// Scan the map and try to locate the start room
		let mapRoomId ;
		let charIndex = -this.gameData.gameMap.idLength ;
		do {
			charIndex += gameMap.idLength ;
			mapRoomId = gameMap.data.substring(charIndex, charIndex + gameMap.idLength) ;
		}
		while (charIndex <= gameMap.data.length && mapRoomId !== targetRoomId) ;

		if (mapRoomId === targetRoomId) return GameRunManager.calcAbsCoordsFromMapCharIndex(gameMap.dims, gameMap.idLength, charIndex)	;
		else console.error("Could not find start room") ;
	}

	// Calculate the absolute coords for a position on the map given the character index of its identifier
	static calcAbsCoordsFromMapCharIndex(gameMapDims, gameMapIdLength, charIndex) {
		const idIndex = charIndex / gameMapIdLength ;
		const x = Math.floor(idIndex % gameMapDims.x) ;
		const y = Math.floor((idIndex / gameMapDims.x) % gameMapDims.y) ;
		const z = Math.floor(idIndex / (gameMapDims.x * gameMapDims.y)) ;
		return { x, y, z } ;
	}

	// Move the player (set the room id and absolute coords)
	movePlayerToRoomWithAbsCoords(roomId, playerAbsCoords) {
		this.gameState.player.currentRoomId = roomId ;
		this.gameState.player.absCoords = playerAbsCoords ;
		this.gameState.currentRoom.roomDef = this.gameData.roomDefs[roomId] ;
	}

	runCommand(command) {
		console.log("Command:", command)
		// TODO
		
		// Return current game state
		return ['g', this.gameState] ;
	}
}