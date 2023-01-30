import DescribedEntity from "./describedEntity.js"

export default class Room extends DescribedEntity {
	constructor(roomDef) {
		super(roomDef.name || '', roomDef.description || '') ;
		this._linkedRooms = {} ; // No linked rooms initially
	}

	linkRoom(dir, room) {
		this._linkedRooms[dir] = room ;
	}
}