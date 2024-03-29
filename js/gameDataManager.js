// Type: Module
// Note: Based off code from "JSQuiz" project

export default class GameDataManager {
	constructor(gamesPath) {
		this.gamesPath = gamesPath ;
		this.gameList = [] ;
	}

	async loadList() {
		this.gameList = (await import(this.gamesPath + '/gameList.js')).default ;
		return deepClone(this.gameList) ;
	}

	async loadGameByIndex(i) {
		const gameName = this.gameList[i].name ;
		this.gameData = (await import(this.gamesPath + '/' + gameName + '.js')).default ;
		return deepClone(this.gameData) ;
	}

	getGameData() {
		return deepClone(this.gameData) ;
	}
}