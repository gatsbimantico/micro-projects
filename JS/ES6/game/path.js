class Path extends Option {
	constructor(config) {
		if (!config) {
			return;
		}

		super(config);

		this.source = config.source;
		this.target = config.target;
	}

	check(roomId) {
		if (this.source === roomId) {
			return this;
		} else if (this.target === roomId) {
			var oposite = new Path(this);
			oposite.theta = (this.theta + 360) % 360 - 180;
			oposite.source = this.target;
			oposite.target = this.source;
			return oposite;
		} else {
			return;
		}
	}
}