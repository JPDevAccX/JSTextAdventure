import Item from "./item.js" ;

export default class Contents {
	constructor(maxItems = null) {
		this._maxItems = maxItems ; // (currently unused)
		this._items = [] ; // No items initially
	}
	
	get maxItems() { return this._maxItems ; }
	
	addItem(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		this._items.push(item) ;
	}

	removeItem(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		this._items = this._items.filter(itemEntry => itemEntry !== item) ;
	}

	moveItem(item, destContents) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		if (!instanceCheck(destContents, Contents)) return consoleErrAndReturnNull("Argument 2 is not a Contents") ;
		destContents.addItem(item) ;
		this.removeItem(item) ;
	}

	getContentsDescription() {
		const itemNames = this._items.map(item => item.getCompleteNameIdentifier('[b]', '[/b]')) ;
		return createEntityListDescription(itemNames) ;
	}

	retrieveItemWithName(name) {
		if ((typeof name) !== 'string') return consoleErrAndReturnNull("Argument 1 is not a string") ;

		name = name.toLowerCase() ;
		for (const item of this._items) {
			if (item.name.toLowerCase() === name) return item ;
		}
		return null ;
	}
}