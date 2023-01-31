// Type: Module

import Item from './entityTypes/item.js';

export default class GameStateSetupItems {
	static setup(gameData) {
		return GameStateSetupItems.createItemObjects(gameData.itemDefs) ;
	}

	// Create the item objects
	static createItemObjects(itemDefs) {
		const itemsById = {} ;
		for (const [itemId, { name, description, weight }] of Object.entries(itemDefs)) {
			itemsById[itemId] = new Item(name, description, weight) ;
		}
		return itemsById ;
	}
}