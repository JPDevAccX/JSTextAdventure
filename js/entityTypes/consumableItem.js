import Item from "./item.js";
import Contents from "./contents.js";
import Player from "./player.js";

export default class ConsumableItem extends Item {
	constructor(name, description, health = 0, weight = 0) {
		super(name, description) ;
		this._health = health ;
		this._weight = weight ; // (currently unused)
	}

	get health() { return this._health ; }
	get weight() { return this._weight ; }

	eat(contentsContainer, player) {
		if (!instanceCheck(contentsContainer, Contents)) return consoleErrAndReturnNull("Argument 1 is not a Contents") ;
		if (!instanceCheck(player, Player)) return consoleErrAndReturnNull("Argument 2 is not a Player") ;
		contentsContainer.removeItem(this) ;
		const oldHealth = player.health ;
		player.changeHealthBy(this._health) ;
		return { isPlayerAlive: player.isAlive(), healthChange: player.health - oldHealth } ;
	}
}