import Entity from "./entity.js";

export default class Item extends Entity {
	constructor(name, description, weight = 0) {
		super(name, description) ;
		this._weight = weight ; // (currently unused)
	}

	get weight() { return this._weight ; }
}