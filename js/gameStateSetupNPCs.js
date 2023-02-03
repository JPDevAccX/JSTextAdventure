// Type: Module

import NonPlayerCharacter from "./entityTypes/npc.js";

export default class GameStateSetupNPCs {
	static setup(gameData, itemsById) {
		const nonPlayerCharactersById = GameStateSetupNPCs.createNonPlayerCharacterObjects(gameData.npcDefs) ;
		GameStateSetupNPCs.addItemsToInventory(gameData.npcDefs, nonPlayerCharactersById, itemsById) ;
		GameStateSetupNPCs.linkNPCsToAttackItems(gameData.npcDefs, nonPlayerCharactersById, itemsById) ;
		GameStateSetupNPCs.addItemsToVulnerabilityList(gameData.npcDefs, nonPlayerCharactersById, itemsById) ;
		GameStateSetupNPCs.addItemsToTradeInventoryForItemList(gameData.npcDefs, nonPlayerCharactersById, itemsById) ;
		return nonPlayerCharactersById ;
	}

	// Create the NPC objects
	static createNonPlayerCharacterObjects(npcDefs) {
		const nonPlayerCharactersById = {} ;
		for (let [npcId, { name, description, greetingMessages, health}] of Object.entries(npcDefs)) {
			nonPlayerCharactersById[npcId] = new NonPlayerCharacter(name, description, greetingMessages, health) ;
		}
		return nonPlayerCharactersById ;
	}

	// Place items in NPC inventory
	static addItemsToInventory(npcDefs, nonPlayerCharactersById, itemsById) {
		for (const [npcId, npc] of Object.entries(nonPlayerCharactersById)) {
			for (const itemId of npcDefs[npcId].inventory || []) {
				if (itemsById[itemId]) npc.contents.addItem(itemsById[itemId]) ;
				else console.error("Could not find item with id '" + itemId + "'") ;
			}
		}
	}

	// Place items in NPC "vulnerability-list"
	static addItemsToVulnerabilityList(npcDefs, nonPlayerCharactersById, itemsById) {
		for (const [npcId, npc] of Object.entries(nonPlayerCharactersById)) {
			for (const itemId of npcDefs[npcId].vulnerabiltyItemList || []) {
				if (itemsById[itemId]) npc.addVulnerabilityItem(itemsById[itemId]) ;
				else console.error("Could not find item with id '" + itemId + "'") ;
			}
		}
	}

	// Place items in NPC "trade-item-list"
	static addItemsToTradeInventoryForItemList(npcDefs, nonPlayerCharactersById, itemsById) {
		for (const [npcId, npc] of Object.entries(nonPlayerCharactersById)) {
			for (const itemId of npcDefs[npcId].tradeInventoryForItemList || []) {
				if (itemsById[itemId]) npc.addTradeItem(itemsById[itemId]) ;
				else console.error("Could not find item with id '" + itemId + "'") ;
			}
		}
	}

	// Link NPCs to attack-items
	static linkNPCsToAttackItems(npcDefs, nonPlayerCharactersById, itemsById) {
		for (const [npcId, npc] of Object.entries(nonPlayerCharactersById)) {
			const itemId = npcDefs[npcId].attackItem || null ;
			if (itemId !== null && itemsById[itemId]) npc.attackItem = itemsById[itemId] ;
			else if (itemId !== null) console.error("Could not find item with id '" + itemId + "'") ;
		}
	}
}