class GameMap {
	constructor() {
		this.rooms = {};
		this.paths = {};
	}

	getRoomOptions(roomId) {
		var options = [];
		return Object.keys(this.paths)
			.map(pathId => this.paths[pathId].check(roomId))
			.filter(path => !!path);
	}
}