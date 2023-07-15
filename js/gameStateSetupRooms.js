// Type: Module

import Room from './entityTypes/room.js' ;

export default class GameStateSetupRooms {
	static setup(gameData, itemsById, nonPlayerCharactersById) {
		const noRoomId = '|'.repeat(gameData.gameMap.idLength) ; // The room id denoting an empty space
		gameData.gameMap.data = GameStateSetupRooms.preProcessGameMapData(gameData.gameMap.data, gameData.gameMap.idLength, noRoomId) ;
		const mapArray = GameStateSetupRooms.convertTextMapToArray(gameData.gameMap.data, gameData.gameMap.dims, gameData.gameMap.idLength, noRoomId) ;
		const roomsById = GameStateSetupRooms.createRoomObjects(mapArray, gameData.gameMap.dims, gameData.roomDefs) ;
		GameStateSetupRooms.linkRoomObjectsByExits(roomsById, mapArray, gameData.gameMap.dims) ;
		GameStateSetupRooms.addContents(gameData.roomDefs, roomsById, itemsById, nonPlayerCharactersById) ;
		return roomsById ;
	}

	// Convert the whitespace representation of an empty map-position to a run of vertical bars and then strip remaining whitespace
	static preProcessGameMapData(gameMapData, idLength, noRoomId) {
		// 1. Repace |<spaces>| with |<bars>| (denoting position with no room)
		const noRoomMarkerSearchStr = '|' + ' '.repeat(idLength) + '|' ;
		const noRoomMarkerReplaceStr = '|' + noRoomId + '|' ;
		gameMapData = gameMapData.replaceAll(noRoomMarkerSearchStr, noRoomMarkerReplaceStr) ;
		
		// 2. Strip all other whitespace and return the new string
		gameMapData = gameMapData.replaceAll(/\s*/g, '') ;
		return gameMapData ;
	}

	static convertTextMapToArray(gameMapData, gameMapDims, idLength, noRoomId) {
		const mapArray = [] ;
		for (let z = 0; z < gameMapDims.z; z++) {
			for (let y = 0; y < gameMapDims.y; y++) {
				for (let x = 0; x < gameMapDims.x; x++) {
					let roomId = GameStateSetupRooms.getTextRoomIdAtXYZPosition(gameMapData, gameMapDims, idLength, x, y, z) ;
					if (roomId === noRoomId) roomId = null ;
					mapArray.push(roomId) ;
				}
			}
		}
		return mapArray ;
	}

	// Create the room objects
	static createRoomObjects(mapArray, gameMapDims, roomDefs) {
		const roomsById = {} ;
		for (let z = 0; z < gameMapDims.z; z++) {
			for (let y = 0; y < gameMapDims.y; y++) {
				for (let x = 0; x < gameMapDims.x; x++) {
					const mapRoomId = readFlattened3DArrayEntry(mapArray, gameMapDims, x, y, z) ;
					if (mapRoomId) roomsById[mapRoomId] = new Room(roomDefs[mapRoomId], [x, y, z]) ;
				}
			}
		}
		return roomsById ;
	}

	// Link the rooms together
	static linkRoomObjectsByExits(roomsById, mapArray, gameMapDims) {
		for (let z = 0; z < gameMapDims.z; z++) {
			for (let y = 0; y < gameMapDims.y; y++) {
				for (let x = 0; x < gameMapDims.x; x++) {
					const mapRoomId = readFlattened3DArrayEntry(mapArray, gameMapDims, x, y, z) ;
					// (ignore map positions with no room)
					if (mapRoomId) {
						// Get adjacent room ids
						const adjacentRoomIdsByDirection = GameStateSetupRooms.getAdjacentAccessibleRoomIds(mapArray, gameMapDims, x, y, z) ;
						// Link the rooms
						for (const [dir, adjacentRoomId] of Object.entries(adjacentRoomIdsByDirection)) {
							roomsById[mapRoomId].linkRoom(dir, roomsById[adjacentRoomId]) ;
						}
					}
				}
			}
		}
	}

	// Get adjacent room ids (keyed by direction)
	static getAdjacentAccessibleRoomIds(mapArray, gameMapDims, x, y, z) {
		const adjacentAccessibleRoomIdsByDirection = {} ;
 		const adjacentRoomOffsets = {n: [0, 1, 0], e: [1, 0, 0], s: [0, -1, 0], w: [-1, 0, 0], u: [0, 0, 1], d: [0, 0, -1]} ;
		for (const [dir, offset] of Object.entries(adjacentRoomOffsets)) {
			const [adjX, adjY, adjZ] = [x + offset[0], y + offset[1], z + offset[2]] ;
			const adjacentRoomId = readFlattened3DArrayEntry(mapArray, gameMapDims, adjX, adjY, adjZ) ;
			if (adjacentRoomId) adjacentAccessibleRoomIdsByDirection[dir] = adjacentRoomId ;
		}
		return adjacentAccessibleRoomIdsByDirection ;
	}

	// Add contents (items / NPCs) to rooms
	static addContents(roomDefs, roomsById, itemsById, nonPlayerCharactersById) {
		for (const [roomId, room] of Object.entries(roomsById)) {
			for (const globalId of roomDefs[roomId].contents || []) {
				if (itemsById[globalId]) room.contents.addItem(itemsById[globalId]) ;
				else if (nonPlayerCharactersById[globalId]) room.addNPC(nonPlayerCharactersById[globalId]) ;
				else console.error("Could not find item or NPC with id '" + globalId + "'") ;
			}
		}
	}

	// Get the room id from the textual-representation at the given (x,y,z) location
	static getTextRoomIdAtXYZPosition(gameMapData, gameMapDims, idLength, x, y, z) {
		if (x < 0 || x >= gameMapDims.x || y < 0 || y >= gameMapDims.y || z < 0 || z >= gameMapDims.z) return null ;
		y = (gameMapDims.y - 1) - y ; // (invert y so north is positive-y in the map)
		const charIndex = (x + y * gameMapDims.x + z * gameMapDims.x * gameMapDims.y) * (idLength + 2) ;
		return GameStateSetupRooms.readTextRoomIdAtCharIndex(gameMapData, charIndex, idLength) ;
	}

	// Get the map room id from the textual-representation at the given character index
	static readTextRoomIdAtCharIndex(mapData, charIndex, idLength) {
		return mapData.substring(charIndex + 1, charIndex + idLength + 1) ;
	}
}