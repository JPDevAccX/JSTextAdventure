import Entity from "./entity.js";

export default class Item extends Entity {
	constructor(name, description, attackStrength = 0, weight = 0) {
		super(name, description) ;
		this._attackStrength = attackStrength ;
		this._weight = weight ; // (currently unused)
	}

	get attackStrength() { return this._attackStrength ; }
	get weight() { return this._weight ; }
}