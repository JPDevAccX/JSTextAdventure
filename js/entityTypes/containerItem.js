import Contents from "./contents.js";
import Item from "./item.js" ;

export default class ContainerItem extends Item {
	constructor(name, description, weight = null, maxItems = null, isOpen = false, isLocked = false) {
		super(name, description, weight) ;
		this._contents = new Contents(maxItems) ; // No contents initially
		this._isOpen = isOpen ;
		this._isLocked = isLocked ;
		this._lockingItem = null ; // No locking item initially
	}

	get contents() { return this._contents ; }

	get isOpen() { return this._isOpen ; }

	setLockingItem(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		this._lockingItem = item ;
	}

	open() {
		if (this._isOpen) return "already_opened" ;
		else if (this._isLocked) return "locked" ;
		else {
			this._isOpen = true ;
			return "ok" ;
		}
	}

	close() {
		if (!this._isOpen) return "already_closed" ;
		else {
			this._isOpen = false ; // (allow closing of locked containers)
			return "ok" ;
		}
	}

	getContentsDescription() {
		return this._contents.getDescription(this) ;
	}

	getFullDescription() {
		let description = super.getFullDescription() ;
		const contentsDescription = this.getContentsDescription() ;
		if (contentsDescription) description += "\nInside you see " + contentsDescription ;
		return description ;
	}
}