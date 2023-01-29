// Type: Module
// Note: Based off code from "JSQuiz" project

export default class GameListUIManager {
	constructor(selectors) {
		// Get elements / templates
		const keysToRetrieve = ['gameListContainer', 'gameListEntryTemplate'] ;
		this.els = getElementsBySelector(selectors, keysToRetrieve) ;

		// Note the selectors for accessing elements in newly created template clones
		this.selectors = selectors ;
	}

	createGameSelectionOptions(gameList) {
		for (const gameEntry of gameList) {
			// Clone the template to create a new game entry element for the game list
			const gameListEntryEl = this.els.gameListEntryTemplate.content.firstElementChild.cloneNode(true);

			// Set all the content for this game entry element
			gameListEntryEl.querySelector(this.selectors.gameListEntryImg).src = gameEntry.imageSrc ;
			gameListEntryEl.querySelector(this.selectors.gameListEntryImg).alt = gameEntry.title + ' : ' + gameEntry.summary ;
			gameListEntryEl.querySelector(this.selectors.gameListEntryTitle).innerText = gameEntry.title ;
			gameListEntryEl.querySelector(this.selectors.gameListEntrySummary).innerText = gameEntry.summary ;
	
			// Add it to the list container element
			this.els.gameListContainer.appendChild(gameListEntryEl) ;
		}

		// Set the first one as active
		this.els.gameListContainer.firstElementChild.classList.add('active') ;
	}
}