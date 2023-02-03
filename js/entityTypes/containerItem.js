import Contents from "./contents.js";
import Item from "./item.js" ;

export default class ContainerItem extends Item {
	constructor(name, description, isOpen = false, isLocked = false, weight = null, maxItems = null) {
		super(name, description, weight) ;
		this._contents = new Contents(maxItems) ; // No contents initially
		this._isOpen = isOpen ;
		this._isLocked = isLocked ;
		this._lockingItem = null ; // No locking item initially
	}

	get contents() { return this._contents ; }

	get lockingItem() { return this._lockingItem ; }

	set lockingItem(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		this._lockingItem = item ;
	}

	get isOpen() { return this._isOpen ; }

	open() {
		if (this._isOpen) return "already_opened" ;
		else if (this._isLocked) return "locked" ;

		this._isOpen = true ;
		return "ok" ;
	}

	close() {
		if (!this._isOpen) return "already_closed" ;

		this._isOpen = false ; // (allow closing of locked containers)
		return "ok" ;
	}

	unlock(withItem = null) {
		if (!instanceOrNullCheck(withItem, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		if (!this._lockingItem) return "no_lock" ;
		if (!this._isLocked) return "already_unlocked" ;
		else if (withItem !== this._lockingItem) return "wrong_locking_item" ;
		
		this._isLocked = false ;
		return "ok" ;
	}

	lock(withItem = null) {
		if (!instanceOrNullCheck(withItem, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		if (!this._lockingItem) return "no_lock" ;
		if (this._isLocked) return "already_locked" ;
		else if (withItem !== this._lockingItem) return "wrong_locking_item" ;
		this._isLocked = true ;
		return "ok" ;
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