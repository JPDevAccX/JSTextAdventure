// Type: Module
export default class CommandParser {
	constructor(subs = {}, verbs = []) {
		this.subs = {
		...{ // Merge in default substitutions...
		},
		...CommandParser.getDirectionSubs(), // ...with directional subs...
		...subs //...and with custom subs
		} ;

		this.verbs = [
		...[  // Merge in default verbs...
			'go'
		],
			...verbs // ...with custom verbs
		] ;

		// Compile the substitution 'from' regexps ahead of time
		this.compiledRegExps = {} ;
		for (const subFrom of Object.keys(this.subs)) {
			this.compiledRegExps[subFrom] = new RegExp(subFrom, 'g') ;
		}
	}

	static getDirectionSubs() {
		const directions = {n : 'north', e : 'east', s : 'south', w : 'west', u: 'up', d: 'down'}
		const dirSubs = {
			'(^| )go to ': '',
			'(^| )goto ': '',
			'(^| )go ': ''
		} ;

		for (const [short, long] of Object.entries(directions)) {
			dirSubs['(^| )' + short + '( |$)'] = ' go ' + short + ' ' ;
			dirSubs['(^| )' + long + '( |$)'] = ' go ' + short + ' ' ;
		}

		return dirSubs ;
	}

	parseCommand(command) {
		command = command.toLowerCase() ;

		// Do substitutions
		for (const [subFrom, subTo] of Object.entries(this.subs)) {
			command = command.replaceAll(this.compiledRegExps[subFrom], subTo) ;
		}
		command = command.trim().replaceAll(/ +/g, ' ') ;

		// Parse
		const commandTokens = command.split(' ') ;
		if (this.verbs.includes(commandTokens[0])) {
			return {commandType: 'VN', verb: commandTokens[0], object: commandTokens[1]} ; // Verb-noun structure (e.g. "go west" or "attack monster")
		}
		else return {commandType: 'UNKNOWN'} ;
	}
}