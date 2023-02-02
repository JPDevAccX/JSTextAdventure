import Character from "./character.js";

export default class NonPlayerCharacter extends Character {
	constructor(name, description, greetingMessages = []) {
		super(name, description) ;
		this._greetingMessages = greetingMessages ;
		this._attackItem = null ;
		this._vulnerabiltyItemList = [] ;
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
}