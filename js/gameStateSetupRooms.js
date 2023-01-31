// Type: Module

import Room from './entityTypes/room.js' ;

export default class GameStateSetupRooms {
	static setup(gameData, itemsById) {
		const noRoomId = '|'.repeat(gameData.gameMap.idLength) ; // The room id denoting an empty space
		gameData.gameMap.data = GameStateSetupRooms.preProcessGameMapData(gameData.gameMap.data, gameData.gameMap.idLength, noRoomId) ;
		const roomsById = GameStateSetupRooms.createRoomObjects(gameData.gameMap, gameData.roomDefs, noRoomId) ;
		GameStateSetupRooms.linkRoomObjectsByExits(roomsById, gameData.gameMap, noRoomId) ;
		GameStateSetupRooms.addItems(gameData.roomDefs, roomsById, itemsById) ;
		return roomsById ;
	}

	// Convert the whitespace representation of an empty map-position to a run of vertical bars and then strip remaining whitespace
	static preProcessGameMapData(gameMapData, idLength, noRoomId) {
		// 1. Repace |<spaces>| with |<bars>| (denoting position with no room)
		const noRoomMarkerSearchStr = '|' + ' '.repeat(idLength + 2) + '|' ;
		const noRoomMarkerReplaceStr = '||' + noRoomId + '||' ;
		gameMapData = gameMapData.replaceAll(noRoomMarkerSearchStr, noRoomMarkerReplaceStr) ;
		
		// 2. Strip all other whitespace and return the new string
		gameMapData = gameMapData.replaceAll(/\s*/g, '') ;
		return gameMapData ;
	}

	// Create the room objects
	static createRoomObjects(gameMap, roomDefs, noRoomId) {
		const idStrLength = gameMap.idLength + 2 ;

		// Iterate over string representation of map and generate Room objects keyed by their id and initialised from the room definition data
		const roomsById = {} ;
		for (let charIndex = 0; charIndex < gameMap.data.length; charIndex += idStrLength) {
			const mapRoomId = GameStateSetupRooms.readMapRoomId(gameMap.data, charIndex, idStrLength) ;
			if (mapRoomId !== noRoomId) roomsById[mapRoomId] = new Room(roomDefs[mapRoomId] || {}) ;
		}
		return roomsById ;
	}

	// Link the rooms together
	static linkRoomObjectsByExits(roomsById, gameMap, noRoomId) {
		const idStrLength = gameMap.idLength + 2 ;

		// Iterate over string representation of map and link adjacent rooms
		for (let charIndex = 0; charIndex < gameMap.data.length; charIndex += idStrLength) {
			const mapRoomId = GameStateSetupRooms.readMapRoomId(gameMap.data, charIndex, idStrLength) ;
			// (ignore map positions with no room)
			if (mapRoomId !== noRoomId) {
				console.log("From", mapRoomId) ;
				// Get room (x,y,z) position
				const {x, y, z} = GameStateSetupRooms.calcAbsCoordsFromMapCharIndex(gameMap.dims, idStrLength, charIndex) ;
				// Get adjacent room ids
				const adjacentRoomIdsByDirection = GameStateSetupRooms.getAdjacentAccessibleRoomIds(gameMap.data, gameMap.dims, idStrLength, noRoomId, x, y, z) ;
				// Link the rooms
				for (const [dir, adjacentRoomId] of Object.entries(adjacentRoomIdsByDirection)) {
					roomsById[mapRoomId].linkRoom(dir, roomsById[adjacentRoomId]) ;
				}
			}
		}
	}

	// Calculate the absolute coords for a position on the map given the character index of its identifier
	static calcAbsCoordsFromMapCharIndex(gameMapDims, idStrLength, charIndex) {
		const idIndex = charIndex / idStrLength ;
		const x = Math.floor(idIndex % gameMapDims.x) ;
		const y = (gameMapDims.y - 1) - Math.floor((idIndex / gameMapDims.x) % gameMapDims.y) ; // (invert y so north is up in the map)
		const z = Math.floor(idIndex / (gameMapDims.x * gameMapDims.y)) ;
		return { x, y, z } ;
	}

	// Get adjacent room ids (keyed by direction)
	static getAdjacentAccessibleRoomIds(gameMapData, gameMapDims, idStrLength, noRoomId, x, y, z) {
		const adjacentAccessibleRoomIdsByDirection = {} ;
		console.log("@", x, y, z) ;
 		const adjacentRoomOffsets = {n: [0, 1, 0], e: [1, 0, 0], s: [0, -1, 0], w: [-1, 0, 0], u: [0, 0, 1], d: [0, 0, -1]} ;
		for (const [dir, offset] of Object.entries(adjacentRoomOffsets)) {
			const [adjX, adjY, adjZ] = [x + offset[0], y + offset[1], z + offset[2]] ;
			const adjacentRoomId = GameStateSetupRooms.getRoomIdAtXYZPosition(gameMapData, gameMapDims, idStrLength, adjX, adjY, adjZ) ;
			if (adjacentRoomId !== null && adjacentRoomId !== noRoomId) {
				console.log("exists '" + dir + "' exit to " + adjacentRoomId) ;
				adjacentAccessibleRoomIdsByDirection[dir] = adjacentRoomId ;
			}
		}
		return adjacentAccessibleRoomIdsByDirection ;
	}

	// Get the room id at the given (x,y,z) location
	static getRoomIdAtXYZPosition(gameMapData, gameMapDims, idStrLength, x, y, z) {
		if (x < 0 || x >= gameMapDims.x || y < 0 || y >= gameMapDims.y || z < 0 || z >= gameMapDims.z) return null ;
		y = (gameMapDims.y - 1) - y ; // (invert y so north is up in the map)
		const charIndex = (x + y * gameMapDims.x + z * gameMapDims.y) *  idStrLength ;
		return GameStateSetupRooms.readMapRoomId(gameMapData, charIndex, idStrLength) ;
	}

	// Get the map room id at the specified character index
	static readMapRoomId(mapData, charIndex, idStrLength) {
		return mapData.substring(charIndex + 1, charIndex + idStrLength - 1) ;
	}

	// Add items to rooms
	static addItems(roomDefs, roomsById, itemsById) {
		for (const [roomId, room] of Object.entries(roomsById)) {
			for (const itemId of roomDefs[roomId].contents || []) {
				room.addItem(itemsById[itemId]) ;
			}
		}
	}
}