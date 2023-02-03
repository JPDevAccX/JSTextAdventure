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
				npc.contents.addItem(itemsById[itemId]) ;
			}
		}
	}

	// Place items in NPC "vulnerability-list"
	static addItemsToVulnerabilityList(npcDefs, nonPlayerCharactersById, itemsById) {
		for (const [npcId, npc] of Object.entries(nonPlayerCharactersById)) {
			for (const itemId of npcDefs[npcId].vulnerabiltyItemList || []) {
				npc.addVulnerabilityItem(itemsById[itemId]) ;
			}
		}
	}

	// Place items in NPC "trade-item-list"
	static addItemsToTradeInventoryForItemList(npcDefs, nonPlayerCharactersById, itemsById) {
		for (const [npcId, npc] of Object.entries(nonPlayerCharactersById)) {
			for (const itemId of npcDefs[npcId].tradeInventoryForItemList || []) {
				npc.addTradeItem(itemsById[itemId]) ;
			}
		}
	}

	// Link NPCs to attack-items
	static linkNPCsToAttackItems(npcDefs, nonPlayerCharactersById, itemsById) {
		for (const [npcId, npc] of Object.entries(nonPlayerCharactersById)) {
			const itemId = npcDefs[npcId].attackItem || null ;
			npc.attackItem = itemsById[itemId] ;
		}
	}
}