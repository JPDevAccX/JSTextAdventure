// Type: Module

import ContainerItem from './entityTypes/containerItem.js';
import Item from './entityTypes/item.js';

export default class GameStateSetupItems {
	static setup(gameData) {
		const itemsById =  GameStateSetupItems.createItemObjects(gameData.itemDefs) ;
		GameStateSetupItems.placeItemsInItemContainers(gameData.itemDefs, itemsById) ;
		return itemsById ;
	}

	// Create the item objects
	static createItemObjects(itemDefs) {
		const itemsById = {} ;
		for (const [itemId, { name, description, weight, contents }] of Object.entries(itemDefs)) {
			itemsById[itemId] = (contents) ? new ContainerItem(name, description, weight) : new Item(name, description, weight) ;
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
}