// Type: Module
export default class CommandParser {
	constructor(subs = {}, verbs = []) {
		this.subs = {
		...{ // Merge in default substitutions...
			'(^| )look at ': ' examine ',
			'(^| )ex ': ' examine ',
			'(^| )pick up ' : ' get ',
			'(^| )retrieve ' : ' get ',
			'(^| )shut ' : ' close ',
			' using ' : ' with ',
			' using the ' : ' with ',
			' with the ' : ' with ',
			'^i$': 'inventory',
			'^inv$': 'inventory',
			'^l$': ' look ',
		},
		...CommandParser.getDirectionSubs(), // ...with directional subs...
		...subs //...and with custom subs
		} ;

		this.verbs = [
		...[  // Merge in default verbs...
			'go', 'examine', 'get', 'drop', 'open', 'close', 'unlock', 'lock', 'attack'
		],
			...verbs // ...with custom verbs
		] ;

		this.basicCommands = [
			'inventory', 'look'
		]

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

		console.log("parseCommand() : Command (after subs) = '" + command + "'")

		// Parse
		let parseData = { commandType: 'UNKNOWN' } ;
		const commandTokens = command.split(' ') ;
		if (this.verbs.includes(commandTokens[0])) {
			if (commandTokens.length === 2) { // Verb-noun structure (e.g. "go west" or "attack monster")
				parseData = { commandType: 'VN', verb: commandTokens[0], object: commandTokens[1] } ;
			}
			else if (commandTokens.length === 4 && commandTokens[2] === 'with') { // Verb-noun structure + "with" object
				parseData = {
					commandType: 'VN',
					verb: commandTokens[0],
					object: commandTokens[1],
					withObject: commandTokens[3]
				} ;
			}
		}
		else if (this.basicCommands.includes(commandTokens[0])) {
			parseData = { commandType: 'COM', command: commandTokens[0] } ; // Basic command (e.g "inventory")
		}

		console.log("parseCommand() : parseData =", parseData) ;

		return parseData ;
	}
}