// Type: Module

import NonPlayerCharacter from "./entityTypes/npc.js";

export default class GameStateSetupNPCs {
	static setup(gameData) {
		const nonPlayerCharactersById = GameStateSetupNPCs.createNonPlayerCharacterObjects(gameData.npcDefs) ;
		return nonPlayerCharactersById ;
	}

	// Create the NPC objects
	static createNonPlayerCharacterObjects(npcDefs) {
		const nonPlayerCharactersById = {} ;
		for (let [npcId, { name, description}] of Object.entries(npcDefs)) {
			nonPlayerCharactersById[npcId] = new NonPlayerCharacter(name, description) ;
		}
		return nonPlayerCharactersById ;
	}
}