import Contents from "./contents.js";
import Entity from "./entity.js";

const EXITS = { 'n' : 'North', 'e' : 'East', 's' : 'South', 'w' : 'West', 'u' : 'Up', 'd' : 'Down' } ;

export default class Room extends Entity {
	constructor(roomDef) {
		super(roomDef.name, roomDef.description) ;
		this._linkedRooms = {} ; // No linked rooms initially
		this._contents = new Contents() ; // No contents initially
	}

	get contents() { return this._contents ; }

	linkRoom(dir, room) {
		if (!instanceCheck(room, Room)) return consoleErrAndReturnNull("Argument 2 is not an Item") ;
		if (!Object.keys(EXITS).includes(dir)) return consoleErrAndReturnNull("Argument 1 is not a valid exit direction") ;
		this._linkedRooms[dir] = room ;
	}

	getLinkedRoom(dir) {
		return this._linkedRooms[dir] ;
	}

	getExitsDescription() {
		const exitNames = Object.keys(this._linkedRooms).map(dir => EXITS[dir]) ;
		const exitsStr = createEntityListDescription(exitNames, '[b]', '[/b]') ;
		
		if (exitNames.length === 1) return "The only exit is to the " + exitsStr ;
		else if (exitNames.length > 1) return "Exits are to the " + exitsStr ;
		else return "There doesn't appear to be any exits. This shouldn't happen!" ;
	}

	getContentsDescription() {
		const contentsDesc = this._contents.getContentsDescription() ;
		return (contentsDesc) ? "There is " + contentsDesc + " here.\n" : '' ;
	}

	getFullDescription() {
		return this.description + "\n" + this.getExitsDescription() + "\n" + this.getContentsDescription() ;
	}
}