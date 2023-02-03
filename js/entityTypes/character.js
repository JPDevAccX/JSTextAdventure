import Contents from "./contents.js";
import Entity from "./entity.js";

export default class Character extends Entity {
	constructor(name, description, health = 100) {
		super(name, description) ;
		this._health = parseInt(health) ;
		this._contents = new Contents() ; // (inventory)
	}

	get inventory() { return this._contents ; } // (alias for readability outside of class)
	get contents() { return this._contents ; }
	
	get health() { return this._health ; }

	isAlive() {
		return (this._health > 0) ;
	} ;

	getInventoryDescription() {
		return this._contents.getDescription(this) ;
	}

	retrieveItemWithName(name) {
		return this._contents.retrieveItemWithName(this, name) ;
	}

	moveItem(item, destContents) {
		this._contents.moveItem(this, item, destContents) ;
	}

	moveAllItems(destContents) {
		this._contents.moveAllItems(this, destContents) ;
	}

	isItemAccessible(item) {
		return this._contents.isItemAccessible(this, item) ;
	}

	changeHealthBy(delta) {
		this._health = Math.max(this._health + delta, 0) ;
		return this.isAlive() ;
	}

	attackWithItem(item) {
		this.changeHealthBy(item.attackStrength) ;
	}

	get name() {
		return this.rawName ;
	}
}