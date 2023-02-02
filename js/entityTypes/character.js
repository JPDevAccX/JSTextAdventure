import Contents from "./contents.js";
import Entity from "./entity.js";

export default class Character extends Entity {
	constructor(name, description) {
		super(name, description) ;
		this._inventory = new Contents() ;
	}

	get inventory() { return this._inventory ; }
	get contents() { return this._inventory ; }

	getInventoryDescription() {
		return this._inventory.getDescription(this) ;
	}

	retrieveItemWithName(name) {
		return this._inventory.retrieveItemWithName(this, name) ;
	}

	moveItem(item, destContents) {
		this._inventory.moveItem(this, item, destContents) ;
	}
}