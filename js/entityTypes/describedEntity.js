export default class DescribedEntity {
	constructor(name, description) {
		this._name = name ;
		this._description = description ;
	}
	get name() { return this._name ; }
	get description() { return this._description ; }
}