import DescribedEntity from "./describedEntity.js"

const EXITS = { 'n' : 'North', 'e' : 'East', 's' : 'South', 'w' : 'West', 'u' : 'Up', 'd' : 'Down' } ;

export default class Room extends DescribedEntity {
	constructor(roomDef) {
		super(roomDef.name || '', roomDef.description || '') ;
		this._linkedRooms = {} ; // No linked rooms initially
	}

	linkRoom(dir, room) {
		this._linkedRooms[dir] = room ;
	}

	getLinkedRoom(dir) {
		return this._linkedRooms[dir] ;
	}

	getExitsDescription() {
		let exitsStr = '' ;
		let exitDirs = Object.keys(this._linkedRooms) ;
		const numExits = exitDirs.length ;
		for (const [i, exitDir] of exitDirs.entries()) {
			exitsStr += '[b]' + EXITS[exitDir] + '[/b]' ;
			if (numExits < 3 && i < numExits - 1) exitsStr += ' and ' ;
			else if (numExits >= 3 && i < numExits - 2) exitsStr += ', ' ;
			else if (numExits >= 3 && i < numExits - 1) exitsStr += ', and ' ;
		}
		
		if (numExits === 1) return "The only exit is to the " + exitsStr ;
		else if (numExits > 1) return "Exits are to the " + exitsStr ;
		else return "There doesn't appear to be any exits. This shouldn't happen!"
	}
}