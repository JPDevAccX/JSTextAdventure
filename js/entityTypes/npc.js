import Character from "./character.js";
import Item from "./item.js";
import Player from "./player.js";

export default class NonPlayerCharacter extends Character {
	constructor(name, description, greetingMessages = [], health = 100) {
		super(name, description, health) ;
		this._greetingMessages = greetingMessages ;
		this._attackItem = null ;
		this._vulnerabiltyItemList = [] ; // (invincible to other items regardless of attack strength)
		this._tradeInventoryForItemList = [] ;
	}

	getRandomGreetingMessage() {
		if (this._greetingMessages.length === 0 || !this.isAlive()) return '' ;
		const i = randomInt(this._greetingMessages.length) ;
		return this._greetingMessages[i] ;
	}

	set attackItem(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		this._attackItem = item ;
	}
	
	addVulnerabilityItem(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		this._vulnerabiltyItemList.push(item) ;
	}

	addTradeItem(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		this._tradeInventoryForItemList.push(item) ;
	}

	getAttack() {
		if (!this._attackItem || !this.isAlive()) return null ; // No attack item or dead
		return {attackItemName: this._attackItem.rawName, damage: this._attackItem.attackStrength }
	}

	isVulnerableToItem(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		return (this._vulnerabiltyItemList.includes(item)) ;
	}

	receiveAttackFromItem(item) {
		if (!instanceCheck(item, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;

		let isAlive = this.isAlive() ;
		let message, statusResult ;
		if (isAlive) {
			message = "You attacked [b]" + this.name + "[/b] with the [b]" + item.rawName + "[/b].\n" ;

			if (this.isVulnerableToItem(item)) {
				isAlive = this.changeHealthBy(-item.attackStrength) ;
				if (!isAlive) message += "The strike was fatal! [b]" + this.name + "[/b] is dead!\n" ;
				else if (item.attackStrength === 0) message += "I'm not sure the [b] " + item.rawName + "[/b] makes for a very good weapon.\n" ;
				statusResult = (isAlive) ? 'still_alive' : 'killed' ;
			}
			else {
				message += "The attack had no effect!\n" ;
				statusResult = 'still_alive' ;
			}
		}
		else {
			message = "[b]" + this.name + "[/b] is already dead! Leave them alone!"
			statusResult = 'already_dead' ;
		}
		return {statusResult, message} ;
	}

	offerTradeForInventory(tradeItem, player) {
		if (!instanceCheck(tradeItem, Item)) return consoleErrAndReturnNull("Argument 1 is not an Item") ;
		if (!instanceCheck(player, Player)) return consoleErrAndReturnNull("Argument 2 is not a Player") ;

		if (this._tradeInventoryForItemList.includes(tradeItem)) {
			const inventoryItemsDescription = this.getInventoryDescription() ;
			this.moveAllItems(player.contents) ;
			player.moveItem(tradeItem, this.inventory) ;
			return inventoryItemsDescription ;
		}

		return null ;
	}
 }