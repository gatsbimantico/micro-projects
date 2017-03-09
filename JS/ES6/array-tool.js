class StringParser {
	constructor() {
		this.string = '';
		this.map = [];
		this.splitters = [];
	}

	_deep_map(arr, i) {
		if (i < this.splitters.length) {
			return arr.map(s => this._deep_map(s.split(this.splitters[i]), i + 1));
		} else {
			return arr;
		}
	}

	split() {
		return this._deep_map([this.string], 0);
	}
}