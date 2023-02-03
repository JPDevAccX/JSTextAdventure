import Contents from "./contents.js";
import Entity from "./entity.js";
import Item from "./item.js";

export default class Character extends Entity {
	constructor(name, description, health = 100) {
		super(name, description) ;
		this._health = parseInt(health) ;
		this._contents = new Contents() ; // (inventory)
	}

	get inventory() { return this._contents ; } // (alias for readability outside of class)
	get contents() { return this._contents ; }
	
	get health() { return this._health ; }

	// Returns true if character alive, false otherwise
	isAlive() {
		return (this._health > 0) ;
	} ;

	// Get text string describing inventory
	getInventoryDescription() {
		return this._contents.getDescription(this) ;
	}

	// Retrieve item by its name
	retrieveItemWithName(name) {
		if ((typeof name) !== 'string') return consoleErrAndReturnNull("Argument 1 is not a string") ;
		return this._contents.retrieveItemWithName(this, name) ;
	}

	// Move an item to the specified contents object
	moveItem(item, destContents) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		if (!instanceCheck(destContents, Contents)) return consoleErrAndReturnNull("Argument 2 is not a Contents") ;
		this._contents.moveItem(this, item, destContents) ;
	}

	// Move all items to the specified contents object
	moveAllItems(destContents) {
		if (!instanceCheck(destContents, Contents)) return consoleErrAndReturnNull("Argument 1 is not a Contents") ;
		this._contents.moveAllItems(this, destContents) ;
	}

	// Returns true if item is accessible (e.g. in opened box), false otherwise
	isItemAccessible(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		return this._contents.isItemAccessible(this, item) ;
	}

	// Modify health value by the specified amount
	changeHealthBy(delta) {
		this._health = Math.max(this._health + delta, 0) ;
		return this.isAlive() ;
	}

	// Attack this character with the specified item (modifies health points)
	attackWithItem(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		this.changeHealthBy(item.attackStrength) ;
	}

	get name() {
		return this.rawName ;
	}
}