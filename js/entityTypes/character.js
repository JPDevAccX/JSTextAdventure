import Contents from "./contents.js";
import Entity from "./entity.js";

export default class Character extends Entity {
	constructor(name, description) {
		super(name, description) ;
		this._contents = new Contents() ; // (inventory)
	}

	get inventory() { return this._contents ; } // (alias for readability outside of class)
	get contents() { return this._contents ; }

	getInventoryDescription() {
		return this._contents.getDescription(this) ;
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
}