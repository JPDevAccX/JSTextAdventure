// Type: Module (with side-effects)
// Note: This is based off "main.js" from the "JSQuiz" project
import selectors from "./selectors.js" ;
import GameDataManager from "./gameDataManager.js";
import GameListUIManager from "./gameListUIManager.js";
import GameRunManager from "./gameRunManager.js";
import GameUIManager from "./gameUIManager.js";

// --- Create manager objects ---
const gameDataManager = new GameDataManager('../games') ; // (manages the game-list / current-game data)
const gameListUIManager = new GameListUIManager(selectors) // (manages the game-list user-interface)
const gameRunManager = new GameRunManager() ; // (manages the current game state)
const gameUIManager = new GameUIManager(selectors, startGame, handleCommand) ; // (manages the user-interface for the current game)

// --- Load README for "Site Information" tab ---
fetch('README.md').
	then(response => response.text()).
	then(responseText => document.getElementById('tab_siteinfo').innerText = responseText).
	catch(() => document.getElementById('tab_siteinfo').innerText = 'Error loading README file') ;

// --- Tab-selection handling ---
document.getElementById('link_tab_game').addEventListener('click', (e) => setActivePage(e.target)) ;
document.getElementById('link_tab_siteinfo').addEventListener('click', (e) => setActivePage(e.target)) ;
function setActivePage(tabLinkEl) {
	document.querySelectorAll('.nav-link').forEach(el => {
		const tabContentsEl = document.getElementById(el.id.substring(5)) ;
		// Update state for all nav links and corresponding tab content elements
		if (el === tabLinkEl) {
			el.classList.add('active') ;
			el.setAttribute('aria-current', 'page') ;
			tabContentsEl.classList.remove('d-none') ;
			tabContentsEl.ariaHidden = "false"
		}
		else {
			el.classList.remove('active') ;
			el.removeAttribute('aria-current') ;
			tabContentsEl.classList.add('d-none') ;
			tabContentsEl.ariaHidden = "true"
		}
	}) ;
}

doGameSetup() ;

// ---------------------------------------------------------------------------------------------------------------------------------

async function doGameSetup() {
	// Load the game list and create UI elements for it
	const gameList = await gameDataManager.loadList() ;
	gameListUIManager.createGameSelectionOptions(gameList) ;

	// Load the data for the first game in the list and update the UI accordingly
	const gameData = await gameDataManager.loadGameByIndex(0) ;
	gameUIManager.initForGame(gameList[0].title, gameData) ;
	gameUIManager.updateUI('t') // Title 

	// Do the basic setup for the game-list bootstrap carousel
	const carouselEl = document.querySelector('#carousel')
	new bootstrap.Carousel(carouselEl, { interval: 2000, touch: false }) ;

	// Add an event listener to disable the start-game button during the carousel slide (to avoid race condition)
	carouselEl.addEventListener('slide.bs.carousel', () => {
		document.querySelector(selectors.gameStartButton).disabled = true ;
	}) ;

	// Add an event listener to handle the carousel selection having changed
	carouselEl.addEventListener('slid.bs.carousel', async event => {
		// Load the data for the newly selected game and update the UI accordingly
		const newGameIndex = event.to ;
		const gameData = await gameDataManager.loadGameByIndex(newGameIndex) ;
		gameUIManager.initForGame(gameList[newGameIndex].title, gameData) ;
		document.querySelector(selectors.gameStartButton).disabled = false ; // (re-enable start-game button)
	}) ;

	// Show the body-content now setup is complete
	document.querySelector(selectors.gameBody).classList.remove('invisible') ;
}

function startGame() {
	// Start a new run for this game
	const [stage, gameState] = gameRunManager.newRun(gameDataManager.getGameData()) ;
	gameUIManager.updateUI(stage, gameState) ;
}

// Update game state and UI depending on the user's command
function handleCommand(command) {
	const [stage, gameState] = gameRunManager.runCommand.bind(gameRunManager)(command) ;
	gameUIManager.updateUI(stage, gameState) ;
}