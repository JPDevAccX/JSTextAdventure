// Type: Module
// Note: Based off code from "JSQuiz" project

export default class GameUIManager {
	constructor(selectors, gameStartCallback, gameResetCallback, handleCommandCallback) {
		// Get elements / templates
		const keysToRetrieve = [
			'gameTitle', 'gameSelectorContainer', 'gameIntroText', 
			'gameStartButton', 
			'gameMainContainer', 'gameProgressStatus', 'currentRoomNameDisplay', 'gameOutput', 'gameInput',
			'compass',
			'n_compassDark', 'n_compassLight', 'e_compassDark', 'e_compassLight', 's_compassDark', 's_compassLight', 'w_compassDark', 'w_compassLight',
			'gameMap',
			'gameEndContainer', 'gameResultsContainer', 'resetButton'
		] ;
		this.els = getElementsBySelector(selectors, keysToRetrieve) ;
	
		this.handleCommandCallback = handleCommandCallback ;

		// Map setup
		for (let yOff = 3; yOff >= -3; yOff--) {
			for (let xOff = -3; xOff <= 3; xOff++) {
				const mapBlockEl = document.createElement('div') ;
				mapBlockEl.className = 'my-map-block' ;
				this.els.gameMap.appendChild(mapBlockEl) ;
			}
		}
		this.els.gameMap.children[3 + 3 * 7].classList.add('my-current-room') ;

		// Add event listeners for the start and restart buttons
		this.els.gameStartButton.addEventListener('click', () => gameStartCallback()) ;
		this.els.resetButton.addEventListener('click', gameResetCallback) ;

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
		document.addEventListener('keydown', this.handleKeyDown) ;

		this.els.compass.addEventListener('click', (e) => {
			if (!this.els.gameInput.disabled) {
				const isDirection = /^compass_.*/.test(e.target.id) ;
				if (isDirection) {
					if (e.target.classList.contains("my-compass-isexit-dark") || e.target.classList.contains("my-compass-isexit-light")) {
						const direction = e.target.id.charAt(8) ;
						this.handleCommandCallback(direction) ;
						this.commandHistory.push(direction) ;
						this.commandHistoryIndex = this.commandHistory.length ;
						this.els.gameInput.value = '' ;
					}
				}
			}
		}) ;

		this.lockGameInput() ;
	}

	initForGame(gameTitle, gameData) {
		this.els.gameTitle.innerText = gameTitle ;
		this.els.gameIntroText.innerText = gameData.introText ;
		this.gameData = gameData ;

		this.resetCommandHistory() ;
	}

	resetCommandHistory() {
		this.commandHistory = [] ;
		this.commandHistoryIndex = 0 ;
	}

	newRun(stage, gameState, lockGameInput = false) {
		gameState.revealedMapArray = [] ;
		if (lockGameInput) this.lockGameInput() ;
		else this.unlockGameInput() ;
		this.updateUI(stage, gameState) ;
	}

	updateUI(stage, gameState = null) {
		// (not a huge fan of switch statements but works well here)
		switch(stage) {
			case 't': this.setVisibilities(true, false, false) ; // TITLE
			break ;
			case 'g': // IN-GAME
				this.setProgressDescription(gameState.score) ;
				this.showRoomStatus(gameState.player.currentRoom, gameState.outputBuffer, gameState.revealedMapArray, gameState.mapDims) ;
				this.els.gameInput.focus() ;
			break ;
			case 'w': // WIN
			case 'l': // LOSE
				this.showRoomStatus(gameState.player.currentRoom, gameState.outputBuffer, gameState.revealedMapArray, gameState.mapDims) ;
				this.startShowResults(stage, gameState.score) ;
			break ;
			default:
				console.error("Invalid game state type") ;
		}
	}

	setProgressDescription(score) {
		this.els.gameProgressStatus.innerHTML = 'Score: ' + score + "<br>" ;
	}

	showRoomStatus(currentRoom, outputBuffer, revealedMapArray, mapDims) {
		this.setVisibilities(false, true, false) ;
		this.els.currentRoomNameDisplay.innerText = currentRoom.rawName ;
		this.els.gameOutput.innerHTML = outputBuffer.getProcessedBufferText((entry) => markupToHtml(entry) + "<br>") ;
		this.updateExitsCompass(currentRoom) ;
		this.updateMapDisplay(revealedMapArray, mapDims, currentRoom) ;
		this.els.gameOutput.scrollTo(0, 1000) ; // Scroll down to bottom
	}

	updateExitsCompass(currentRoom) {
		const roomExits = currentRoom.getExits() ;
		for (const exit of ['n', 'e', 's', 'w']) {
			const isRoomExit = roomExits.includes(exit) ;
			this.els[exit + '_compassDark'].classList.toggle('my-compass-isexit-dark', isRoomExit) ;
			this.els[exit + '_compassLight'].classList.toggle('my-compass-isexit-light', isRoomExit) ;
		}
	}

	updateRevealedMapArray(revealedMapArray, mapDims, currentRoom) {
		const [cx, cy, cz] = currentRoom.coords ;

		// (current room - for handling entrance and potentially 'teleportation' in future)
		revealedMapArray[cx + cy * mapDims.x + cz * mapDims.x * mapDims.y] = true ;

		// (adjoining rooms)
		const roomExits = currentRoom.getExits() ;
		const adjacentRoomOffsets = {n: [0, 1, 0], e: [1, 0, 0], s: [0, -1, 0], w: [-1, 0, 0], u: [0, 0, 1], d: [0, 0, -1]} ;
		for (const exit of ['n', 'e', 's', 'w']) {
			const isRoomExit = roomExits.includes(exit) ;
			if (isRoomExit) {
				const x = cx + adjacentRoomOffsets[exit][0] ;
				const y = cy + adjacentRoomOffsets[exit][1] ;
				const z = cz + adjacentRoomOffsets[exit][2] ;
				revealedMapArray[x + y * mapDims.x + z * mapDims.x * mapDims.y] = true ;
			}
		}
	}

	updateMapDisplay(revealedMapArray, mapDims, currentRoom) {
		this.updateRevealedMapArray(revealedMapArray, mapDims, currentRoom) ;
		const [cx, cy, cz] = currentRoom.coords ;
		
		let i = 0 ;
		const mapBlockEls = this.els.gameMap.children ;
		for (let yOff = 3; yOff >= -3; yOff--) {
			for (let xOff = -3; xOff <= 3; xOff++) {
				const x = cx + xOff ;
				const y = cy + yOff ;
				const z = cz ;
				const isKnown = readFlattened3DArrayEntry(revealedMapArray, mapDims, x, y, z) ;
				mapBlockEls[i].classList.toggle('is-room', !!isKnown) ;
				i++ ;
			}
		}
	}

	startShowResults(gameState, score) {
		setTimeout(() => this.showResults(gameState, score), 10000) ;
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
		this.els.gameEndContainer.classList.toggle('d-none', !resultsVisible) ;
	}

	lockGameInput() {
		this.els.gameInput.disabled = true ;
	}
	unlockGameInput() {
		this.els.gameInput.disabled = false ;
	}

	inputCommand(command, completionCallback, charDelay = 300) {
		let i = 0 ;
		const timer = setInterval(() => {
			if (charDelay > 0) this.els.gameInput.value += command.charAt(i) ;
			else this.els.gameInput.value = command ;
			i += ((charDelay === 0) ? command.length : 1) ;
			if (i === command.length) {
				clearInterval(timer) ;
				setTimeout(() => {
					this.els.gameInput.value = '' ;
					this.handleCommandCallback(command) ;
					completionCallback() ;
				}, charDelay) ;
			}
		}, 75) ;
	}
}