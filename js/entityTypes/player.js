import Character from "./character.js";

export default class Player extends Character {
	constructor(name = 'Player', description = 'the player') {
		super(name, description) ;
	}
}