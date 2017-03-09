class Option extends Item {
	constructor(config) {
		if (!config) {
			return;
		}

		super(config);

		this.theta = config.theta;
	}
}