// Type: Module
// Note: Based off code from "JSQuiz" project

export default class GameUIManager {
	constructor(selectors, gameStartCallback, handleCommandCallback) {
		// Get elements / templates
		const keysToRetrieve = [
			'gameTitle', 'gameSelectorContainer', 'gameIntroText', 
			'gameStartButton', 
			'gameMainContainer', 'gameProgressStatus', 'currentRoomNameDisplay', 'gameOutput', 'gameInput',
			'gameResultsContainer'
		] ;
		this.els = getElementsBySelector(selectors, keysToRetrieve) ;

		// Add event listeners for the start-game button and command input
		this.els.gameStartButton.addEventListener('click', gameStartCallback) ;
		document.addEventListener('keydown', (e) => {
			if (e.key === "Enter") {
				handleCommandCallback(this.els.gameInput.value) ;
				this.els.gameInput.value = '' ;
			}
		}) ;
	}

	initForGame(gameTitle, gameData) {
		this.els.gameTitle.innerText = gameTitle ;
		this.els.gameIntroText.innerText = gameData.introText ;
		this.gameData = gameData ;
	}

	updateUI(stage, gameState = null) {
		// (not a huge fan of switch statements but works well here)
		switch(stage) {
			case 't': this.setVisibilities(true, false, false) ; // TITLE
			break ;
			case 'g': // IN-GAME
				this.setProgressDescription(gameState.score) ;
				this.showRoomStatus(gameState.player.currentRoom, gameState.outputBuffer) ;
			break ;
			case 'w': // WIN
			case 'l': // LOSE
				this.showResults(stage, gameState.score) ;
			break ;
			default:
				console.error("Invalid game state type") ;
		}
	}

	setProgressDescription(score) {
		this.els.gameProgressStatus.innerHTML = 'Score: ' + score + "<br>" ;
	}

	showRoomStatus(currentRoom, outputBuffer) {
		this.setVisibilities(false, true, false) ;
		this.els.currentRoomNameDisplay.innerText = currentRoom.rawName ;
		this.els.gameOutput.innerHTML = outputBuffer.getProcessedBufferText((entry) => markupToHtml(entry) + "<br>") ;
		this.els.gameOutput.scrollTo(0, 1000) ; // Scroll down to bottom
	}

	// Display win / lose results
	showResults(gameState, score) {
		this.setVisibilities(false, false, true) ;
		this.els.results.innerHTML = "" ;
		// TODO
	}

	// Set container element visibilities as required for each stage of the game
	setVisibilities(gameTitleVisible, inGameVisible, resultsVisible) {
		this.els.gameSelectorContainer.classList.toggle('d-none', !gameTitleVisible) ;
		this.els.gameSelectorContainer.ariaHidden = gameTitleVisible ? "false" : "true" ;
		this.els.gameMainContainer.classList.toggle('d-none', !inGameVisible) ;
		this.els.gameMainContainer.ariaHidden = inGameVisible ? "false" : "true" ;
		this.els.gameResultsContainer.classList.toggle('d-none', !resultsVisible) ;
		this.els.gameResultsContainer.ariaHidden = resultsVisible ? "false" : "true" ;
	}
}