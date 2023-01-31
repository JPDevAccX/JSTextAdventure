import Container from "./container.js";
import DescribedEntity from "./describedEntity.js";

export default class Character extends DescribedEntity {
	constructor(name, description) {
		super(name, description) ;
		this._inventory = new Container('inventory', 'inventory') ;
	}

	get inventory() { return this._inventory ; }
}