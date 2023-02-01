const VOWELS = ['a', 'e', 'i', 'o', 'u'] ; 

export default class Entity {	
	constructor(name, description, flags = '') {
		this._name = name ;
		this._description = description ;
		
		flags = flags.split('/') ;
		if (!flags.includes('a') && !flags.includes('an') && !flags.includes('p')) {
			if (VOWELS.includes(this._name.charAt(0))) flags.push('an') ;
			else flags.push('a') ;
		}
		if (flags.includes('a')) this.indefArticle = 'a' ;
		else if (flags.includes('an')) this.indefArticle = 'an' ;
		else this.indefArticle = '' ;
	}
	get name() { return this._name ; }
	get description() { return this._description ; }

	getCompleteNameIdentifier(namePrependStr = '', nameAppendStr = '') {
		return this.indefArticle + ' ' + namePrependStr + this._name + nameAppendStr ; 
	}
}