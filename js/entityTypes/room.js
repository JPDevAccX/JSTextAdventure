import Contents from "./contents.js";
import Entity from "./entity.js";

const EXITS = { 'n' : 'North', 'e' : 'East', 's' : 'South', 'w' : 'West', 'u' : 'Up', 'd' : 'Down' } ;

export default class Room extends Entity {
	constructor(roomDef) {
		super(roomDef.name, roomDef.description) ;
		this._linkedRooms = {} ; // No linked rooms initially
		this._contents = new Contents() ; // No contents initially
		this._presentNPCs = [] ; // No NPCs initially
	}

	get contents() { return this._contents ; }

	linkRoom(dir, room) {
		if (!Object.keys(EXITS).includes(dir)) return consoleErrAndReturnNull("Argument 1 is not a valid exit direction") ;
		if (!instanceCheck(room, Room)) return consoleErrAndReturnNull("Argument 2 is not an Item") ;
		this._linkedRooms[dir] = room ;
	}

	get presentNPCs() {
		return this._presentNPCs ;
	}

	addNPC(npc) {
		this._presentNPCs.push(npc) ;
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
		const contentsDesc = this._contents.getDescription(this) ;
		return (contentsDesc) ? "There is " + contentsDesc + " here.\n" : '' ;
	}

	getNonPlayerCharactersDescriptions() {
		let npcsStr = '' ;
		const npcNames = this._presentNPCs.map(npc => npc.name) ;
		npcsStr = createEntityListDescription(npcNames, '[b]', '[/b]') ;
		if (npcsStr) {
			if (npcNames.length === 1) npcsStr += " is here."
			else npcsStr += " are here."
		}
		return npcsStr ;
	}

	getFullDescription() {
		return this.description + "\n" + this.getExitsDescription() + "\n" + this.getContentsDescription() + this.getNonPlayerCharactersDescriptions() ;
	}

	retrieveItemWithName(name) {
		return this._contents.retrieveItemWithName(this, name) ;
	}

	moveItem(item, destContents) {
		this._contents.moveItem(this, item, destContents) ;
	}

	isItemAccessible(item) {
		return this._contents.isItemAccessible(this, item) ;
	}

	retrieveNPCWithName(name) {
		name = name.toLowerCase() ;
		const matchingNPC = this._presentNPCs.filter(npc => npc.name.toLowerCase() === name)[0] || null ;
		return matchingNPC ;
	}
}