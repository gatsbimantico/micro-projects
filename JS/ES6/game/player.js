class Player {
	constructor(config) {
		if (!config) {
			return;
		}

		this.name = config.name;
		this.isAlive = true;
		this.location = 0;
	}

	die() {
		this.isAlive = false;
	}

	moveTo(id) {
		this.location = id;
	}
}