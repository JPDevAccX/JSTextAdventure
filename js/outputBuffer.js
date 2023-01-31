// Type: Module
export default class OutputBuffer {
	constructor(maxEntries = 20) {
		this._maxEntries = maxEntries ;
		this._buffer = [] ;
	}

	getProcessedBufferText(func) {
		return this._buffer.reduce((buffer, entry) => buffer + func(entry), '') ;
	}

	add(entry) {
		if (this._buffer.length === this._maxEntries) this._buffer.shift() ;
		this._buffer.push(entry) ;
	}

	clear() {
		this._buffer = [] ;
	}
}