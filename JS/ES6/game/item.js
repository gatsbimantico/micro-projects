class Item {
	constructor(config) {
		if (!config) {
			return;
		}

		this.id = config.id;
		this.name = config.name;
		this.description = config.description;
	}
}