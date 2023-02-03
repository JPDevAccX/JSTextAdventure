const VOWELS = ['a', 'e', 'i', 'o', 'u'] ; 

export default class Entity {	
	constructor(name, description, flags = '') {
		this._name = name ;
		this._description = description ;
		
		this.applyFlags(flags) ;
	}
	get rawName() { return this._name ; }
	get description() { return this._description ; }

	// Apply language flags (a|an|p) to determine the indefinite article to use
	applyFlags(flags = '') {
		flags = flags.split('/') ;
		if (!flags.includes('a') && !flags.includes('an') && !flags.includes('p')) {
			if (VOWELS.includes(this._name.charAt(0))) flags.push('an') ;
			else flags.push('a') ;
		}
		if (flags.includes('a')) this.indefArticle = 'a' ;
		else if (flags.includes('an')) this.indefArticle = 'an' ;
		else this.indefArticle = '' ;
	}

	// Get complete name including the indefinite article, and also enclose the names in the specified prepend and append strings if specified
	getCompleteNameIdentifier(namePrependStr = '', nameAppendStr = '') {
		return this.indefArticle + ' ' + namePrependStr + this._name + nameAppendStr ; 
	}

	// Get string of "<name> is <description>" format
	getFullDescription() {
		return "The [b]" + this._name +"[/b] is " + this._description ;
	}
}