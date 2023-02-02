// Type: Module

import ContainerItem from './entityTypes/containerItem.js';
import Item from './entityTypes/item.js';

export default class GameStateSetupItems {
	static setup(gameData) {
		const itemsById = GameStateSetupItems.createItemObjects(gameData.itemDefs) ;
		GameStateSetupItems.placeItemsInItemContainers(gameData.itemDefs, itemsById) ;
		GameStateSetupItems.linkItemContainersToKeyItems(gameData.itemDefs, itemsById) ;
		return itemsById ;
	}

	// Create the item objects
	static createItemObjects(itemDefs) {
		const itemsById = {} ;
		for (let [itemId, { name, description, contents, isOpen, isLocked, lockingItem}] of Object.entries(itemDefs)) {
			if (lockingItem && isLocked === undefined) isLocked = true ; // Default to locked if a locking item was specified
			if (isLocked && isOpen === undefined) isOpen = false ; // Default to closed if locked
			itemsById[itemId] = (contents) ? new ContainerItem(name, description, isOpen, isLocked) : new Item(name, description) ;
		}
		return itemsById ;
	}

	// Place items in item-containers
	static placeItemsInItemContainers(itemDefs, itemsById) {
		for (const [itemId, { contents }] of Object.entries(itemDefs)) {
			for (const contentsItemId of contents || []) {
				itemsById[itemId].contents.addItem(itemsById[contentsItemId]) ;
			}
		}
	}

	// Link item-containers to key-items
	static linkItemContainersToKeyItems(itemDefs, itemsById) {
		for (const [itemId, { lockingItem }] of Object.entries(itemDefs)) {
			if (lockingItem) itemsById[itemId].lockingItem = itemsById[lockingItem] ;
		}
	}
}