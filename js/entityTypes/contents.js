import Item from "./item.js" ;

export default class Contents {
	constructor(maxItems = null) {
		this._maxItems = maxItems ; // (currently unused)
		this._items = [] ; // No items initially
	}
	
	get maxItems() { return this._maxItems ; }
	
	get items() { return this._items ; }

	addItem(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		this._items.push(item) ;
	}

	removeItem(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		const oldLen = this._items.length ;
		this._items = this._items.filter(itemEntry => itemEntry !== item) ;
		if (this._items.length !== oldLen - 1) return consoleErrAndReturnNull("Count not find item to remove") ;
	}

	moveItem(rootObj, item, destContents, recurse = true) {
		if (!rootObj.contents) return consoleErrAndReturnNull("Argument 1 does not have a Contents") ;
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 2 is not an Item") ;
		if (!instanceCheck(destContents, Contents)) return consoleErrAndReturnNull("Argument 3 is not a Contents") ;
		destContents.addItem(item) ;

		const sourceContainer = this.getContainerForAccessibleItem(rootObj, item, recurse) ;
		sourceContainer.contents.removeItem(item) ;
	}

	moveAllItems(rootObj, destContents, recurse = true) {
		if (!rootObj.contents) return consoleErrAndReturnNull("Argument 1 does not have a Contents") ;
		if (!instanceCheck(destContents, Contents)) return consoleErrAndReturnNull("Argument 2 is not a Contents") ;

		const accessibleItems = this.getAccessibleItems(rootObj, recurse) ;
		for (const {item} of accessibleItems) {
			this.moveItem(rootObj, item, destContents, recurse) ;
		}
	}

	getContainerForAccessibleItem(rootObj, searchItem, recurse = true) {
		const accessibleItems = this.getAccessibleItems(rootObj, recurse) ;
		const matchingItemWithContainer = accessibleItems.filter(({item}) => item === searchItem)[0] ;
		if (!matchingItemWithContainer) return consoleErrAndReturnNull("Item does not exist in container or is not accessible") ;
		return matchingItemWithContainer.container ;
	}

	retrieveItemWithName(rootObj, name, recurse = true) {
		if ((typeof name) !== 'string') return consoleErrAndReturnNull("Argument 1 is not a string") ;

		const accessibleItems = this.getAccessibleItems(rootObj, recurse) ;
		
		name = name.toLowerCase() ;
		for (const {item, container} of accessibleItems) {
			if (item.rawName.toLowerCase() === name) return {item, container} ;
		}
		return null ;
	}

	getAccessibleItems(rootObj, recurse = true) {
		let accessibleItems = [] ;
		// (if the root object is openable then it must be open to access the items inside)
		if (rootObj.isOpen === undefined || rootObj.isOpen) {
			for (const item of this._items) {
				accessibleItems.push({item, container : rootObj})
				if (item.contents && recurse) {
					accessibleItems = accessibleItems.concat(this.getAccessibleItemsRecursive(item)) ;
				}
			}
		}
		console.log("Contents > getAccessibleItems() :", {accessibleItems}) ;
		return accessibleItems ;
	}
	
	getAccessibleItemsRecursive(containerItem) {
		const containerItemQueue = [containerItem] ;
		const containerNameAndItemList = [] ;
		while (containerItemQueue.length > 0) {
			const containerItem = containerItemQueue.shift() ;
			if (containerItem.isOpen) {
				for (const item of containerItem.contents.items) {
					if (item.contents) containerItemQueue.push(item) ;
					containerNameAndItemList.push({item, container: containerItem}) ;
				}
			}
		}
		return containerNameAndItemList ;
	}

	isItemAccessible(rootObj, item, recurse = true) {
		const accessibleItems = this.getAccessibleItems(rootObj, recurse) ;
		const itemsOnly = accessibleItems.map(entry => entry.item) ;
		console.log("isItemAccessible", {itemsOnly, item} )
		return (itemsOnly.includes(item)) ;
	}

	getDescription(rootObj, recurse = true) {
		const accessibleItems = this.getAccessibleItems(rootObj, recurse) ;
		const itemsOnly = accessibleItems.map(entry => entry.item) ;
		const itemNames = itemsOnly.map(item => item.getCompleteNameIdentifier()) ;
		return createEntityListDescription(itemNames, "[b]", "[/b]") ;
	}
}