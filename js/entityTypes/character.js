import Contents from "./contents.js";
import Entity from "./entity.js";

export default class Character extends Entity {
	constructor(name, description) {
		super(name, description) ;
		this._inventory = new Contents() ;
	}

	get inventory() { return this._inventory ; }
}