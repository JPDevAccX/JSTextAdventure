// Note: Some functions re-used from the "JSQuiz" project

// A simple way of deep-cloning an object
// We use this so we can return a copy of an object from a function (or class method) instead of the original object
// This just helps to avoid confusing bugs where an object accidentally gets modified in unexpected places
function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

// Simple markup system with escaping of HTML special characters (so we can safely use innerHTML even if the data isn't trusted)
function markupToHtml(markup) {
	markup = htmlspecialchars(markup) ;
	markup = nl2br(markup) ;

	const replaceTable = {
		'[li]' : '<li>', '[/li]' : '</li>',
		'[ul]' : '<ul>', '[/ul]' : '</ul>',
		'[b]' : '<b>', '[/b]' : '</b>',
		'[err]' : '<span class="my-err">', '[/err]' : '</span>',
		'[conv]' : '<span class="my-conv">', '[/conv]' : '</span>',
		'[warn]' : '<span class="my-warn">', '[/warn]' : '</span>',
		'[fail]' : '<span class="my-fail">', '[/fail]' : '</span>',
		'[win]' : '<span class="my-win">', '[/win]' : '</span>'
	}
	for (const [from, to] of Object.entries(replaceTable)) {
		markup = markup.replaceAll(from, to) ;
	}
	return markup ;
}

// Replace HTML special characters with their entity names
// (equivalent to PHP function of the same name with ENT_QUOTES passed)
// https://stackoverflow.com/questions/1787322/what-is-the-htmlspecialchars-equivalent-in-javascript
function htmlspecialchars(str) { 
	if (str === null) return null ;
	
  let map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return str.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Replace newlines with <br> (equivalent to PHP function of the same name)
function nl2br(str) {
	return str.replaceAll("\n", "<br>") ;
}

// Retrieve the elements for the specified selectors and return as an object
function getElementsBySelector(keysToSelectorsTable, keysToRetrieve) {
	return Object.fromEntries(keysToRetrieve.map(key => ([key, document.querySelector(keysToSelectorsTable[key])]))) ;
}

// Log error to console and return null
function consoleErrAndReturnNull(errMsg) {
	console.error(errMsg) ;
	return null ;
}

// Check arg is instance of type
function instanceCheck(arg, type) {
	return (arg instanceof type) ;
}

// Check arg is instance of type or null
function instanceOrNullCheck(arg, type) {
	return (arg instanceof type) || null ;
}

// Create a natural-language string describing a list of entities
function createEntityListDescription(entityList, entityPrependStr = '', entityAppendStr = '') {
	let listStr = '' ;
	for (const [i, entryStr] of entityList.entries()) {
		listStr += entityPrependStr + entryStr + entityAppendStr ;
		if (entityList.length < 3 && i < entityList.length - 1) listStr += ' and ' ;
		else if (entityList.length >= 3 && i < entityList.length - 2) listStr += ', ' ;
		else if (entityList.length >= 3 && i < entityList.length - 1) listStr += ', and ' ;
	}
	return listStr ;
}

// Generate a random integer between 0 and n-1 inclusive with even probability distribution
function randomInt(n) {
	return Math.floor(Math.random() * n) ;
}