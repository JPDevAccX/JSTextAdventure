import Character from "./character.js";

export default class NonPlayerCharacter extends Character {
	constructor(name, description, greetingMessages = []) {
		super(name, description) ;
		this._greetingMessages = greetingMessages ;
		this._attackItem = null ;
		this._vulnerabiltyItemList = [] ; // (invincible to other items regardless of attack strength)
		this._tradeInventoryForItemList = [] ;
	}

	getRandomGreetingMessage() {
		if (this._greetingMessages.length === 0) return '' ;
		const i = randomInt(this._greetingMessages.length) ;
		return this._greetingMessages[i] ;
	}

	set attackItem(item) { this._attackItem = item ; }
	
	addVulnerabilityItem(item) {
		this._vulnerabiltyItemList.push(item) ;
	}

	addTradeItem(item) {
		this._tradeInventoryForItemList.push(item) ;
	}

	getAttack() {
		if (!this._attackItem || !this.isAlive()) return null ; // No attack item or dead
		return {attackItemName: this._attackItem.rawName, damage: this._attackItem.attackStrength }
	}
}