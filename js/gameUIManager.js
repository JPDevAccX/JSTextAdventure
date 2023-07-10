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
	
		this.handleCommandCallback = handleCommandCallback ;

		// Add event listener for the start-game button
		this.els.gameStartButton.addEventListener('click', gameStartCallback) ;
	}

	initForGame(gameTitle, gameData) {
		this.els.gameTitle.innerText = gameTitle ;
		this.els.gameIntroText.innerText = gameData.introText ;
		this.gameData = gameData ;

		this.commandHistory = [] ;
		this.commandHistoryIndex = 0 ;

		// Add event listener for the command input, and command history selection
		this.handleKeyDown = (e) => {
			if (!this.els.gameInput.disabled) {
				if (e.key === "Enter") {
					this.handleCommandCallback(this.els.gameInput.value) ;
					this.commandHistory.push(this.els.gameInput.value) ;
					this.commandHistoryIndex = this.commandHistory.length ;
					this.els.gameInput.value = '' ;
				}
				else if (e.key === "ArrowUp") {
					if (this.commandHistoryIndex > 0) {
						this.commandHistoryIndex-- ;
						this.els.gameInput.value = this.commandHistory[this.commandHistoryIndex] ;
					}
				}
				else if (e.key === "ArrowDown") {
					if (this.commandHistoryIndex < this.commandHistory.length) {
						this.commandHistoryIndex++ ;
						this.els.gameInput.value = this.commandHistory[this.commandHistoryIndex] || '' ;
					}
				}
			}
			if (["ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault() ;
		}
		document.removeEventListener('keydown', this.handleKeyDown) ;
		document.addEventListener('keydown', this.handleKeyDown) ;
	}

	updateUI(stage, gameState = null) {
		// (not a huge fan of switch statements but works well here)
		switch(stage) {
			case 't': this.setVisibilities(true, false, false) ; // TITLE
			break ;
			case 'g': // IN-GAME
				this.setProgressDescription(gameState.score) ;
				this.showRoomStatus(gameState.player.currentRoom, gameState.outputBuffer) ;
				this.els.gameInput.focus() ;
			break ;
			case 'w': // WIN
			case 'l': // LOSE
				this.showRoomStatus(gameState.player.currentRoom, gameState.outputBuffer) ;
				this.startShowResults(stage, gameState.score) ;
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

	startShowResults(gameState, score) {
		document.removeEventListener('keydown', this.handleKeyDown) ;
		setInterval(() => this.showResults(gameState, score), 10000) ;
	}

	// Display win / lose results
	showResults(gameState, score) {
		this.setVisibilities(false, false, true) ;
		this.els.gameResultsContainer.innerHTML = "" ;
		this.els.gameResultsContainer.innerHTML += (gameState === 'w') ? "You won!" : "You lost!" ;
		this.els.gameResultsContainer.innerHTML += "<br>Score: " + score ;
	}

	// Set container element visibilities as required for each stage of the game
	setVisibilities(gameTitleVisible, inGameVisible, resultsVisible) {
		this.els.gameSelectorContainer.classList.toggle('d-none', !gameTitleVisible) ;
		this.els.gameMainContainer.classList.toggle('d-none', !inGameVisible) ;
		this.els.gameResultsContainer.classList.toggle('d-none', !resultsVisible) ;
	}

	lockGameInput() {
		this.els.gameInput.disabled = true ;
	}
	unlockGameInput() {
		this.els.gameInput.disabled = false ;
	}

	inputCommand(command, completionCallback) {
		let i = 0 ;
		const timer = setInterval(() => {
			this.els.gameInput.value += command.charAt(i) ;
			i++ ;
			if (i === command.length) {
				clearInterval(timer) ;
				setTimeout(() => {
					this.els.gameInput.value = '' ;
					this.handleCommandCallback(command) ;
					completionCallback() ;
				}, 300) ;
			}
		}, 75) ;
	}
}