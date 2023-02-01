import Contents from "./contents.js";
import Item from "./item.js" ;

export default class ContainerItem extends Item {
	constructor(name, description, weight = null, maxItems = null) {
		super(name, description, weight) ;
		this._contents = new Contents(maxItems) ; // No contents initially
	}
}