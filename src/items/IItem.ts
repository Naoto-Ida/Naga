type ItemConstructor = {
	name: string;
	description?: string;
};

abstract class IItem {
	_name: string;
	_description: string;

	constructor({name, description = 'Its just an item bro!'}: ItemConstructor) {
		this._name = name;
		this._description = description;
	}

	get name() {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}
}
