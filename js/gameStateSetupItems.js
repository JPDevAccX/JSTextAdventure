// Type: Module

import ContainerItem from './entityTypes/containerItem.js';
import ConsumableItem from './entityTypes/consumableItem.js';
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
		for (let [itemId, { name, description, attackStrength, contents, isOpen, isLocked, lockingItem, health, namingFlags}] of Object.entries(itemDefs)) {
			let genericItem = null ;
			if (contents) {
				if (lockingItem && isLocked === undefined) isLocked = true ; // Default to locked if a locking item was specified
				if (isLocked && isOpen === undefined) isOpen = false ; // Default to closed if locked
				genericItem = new ContainerItem(name, description, isOpen, isLocked) ;
			}
			else if (health) genericItem = new ConsumableItem(name, description, health) ;
			else genericItem = new Item(name, description, attackStrength) ;
			genericItem.applyFlags(namingFlags) ;
			itemsById[itemId] = genericItem ;
		}
		return itemsById ;
	}

	// Place items in item-containers
	static placeItemsInItemContainers(itemDefs, itemsById) {
		for (const [itemId, { contents }] of Object.entries(itemDefs)) {
			for (const contentsItemId of contents || []) {
				if (itemsById[contentsItemId]) itemsById[itemId].contents.addItem(itemsById[contentsItemId]) ;
				else console.error("Could not find item with id '" + contentsItemId + "'")
			}
		}
	}

	// Link item-containers to key-items
	static linkItemContainersToKeyItems(itemDefs, itemsById) {
		for (const [itemId, { lockingItem: lockingItemId }] of Object.entries(itemDefs)) {
			if (lockingItemId) {
				if (itemsById[lockingItemId]) itemsById[itemId].lockingItem = itemsById[lockingItemId] ;
				else console.error("Could not find item with id '" + lockingItemId + "'")
			}
		}
	}
}