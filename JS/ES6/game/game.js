class Game {
	constructor() {
		this.room = 'theLandingRoom';
		this.path = null;
	}

	getPath() {
		if (!this.path) {
			return new Item({
				name: 'Nowhere',
				description: ''
			});
		}

		return this.map.paths[this.path];
	}

	getRoom() {
		if (!this.room) {
			return new Item({
				name: 'Nowhere',
				description: ''
			});
		}

		return this.map.rooms[this.room];
	}

	getOptions() {
		return this.map.getRoomOptions(this.room);
	}

	follow(path) {
		if (!path || !path.target) {
			this.render('Can not follow a non path option');
			return;
		}

		this.room = path.target;
		this.path = path.id;

		this.render();
	}

	render(msg) {
		console.clear();
		Array.prototype.slice.call(document.querySelectorAll('.game-item')).forEach(n => n.parentNode.removeChild(n));
		if (!!msg) {
			console.log(msg);
		}
		console.log(
			'Going through',
			this.getPath().name,
			'you get into',
			this.getRoom().name,
			',',
			this.getRoom().description
		);
		console.log('There is');
		this.getOptions().forEach(opt => {
			console.log(opt.description + ' at ' + opt.theta + ' degrees');
			var sceneEl = document.querySelector('a-scene');

			var positionEl = document.createElement('a-entity');
			var textEl = document.createElement('a-entity');
			positionEl.setAttribute('class', 'game-item');
			positionEl.setAttribute('name', opt.name);

			positionEl.setAttribute("rotation", {
				x: -90,
				y: opt.theta,
				z: 0
			});
			textEl.setAttribute("geometry", {
				primitive: 'plane',
				width: 4,
				height: 2
			});
			textEl.setAttribute("material", 'color', 'blue');
			textEl.setAttribute("position", {
				x: 0,
				y: 5,
				z: 0
			});
			textEl.setAttribute("rotation", {
				x: 90,
				y: 0,
				z: 0
			});
			textEl.setAttribute("text", {
				align: 'center',
				value: opt.name + ': ' + opt.description
			});

			textEl.addEventListener('click', function () {
				window.game.follow(opt);
			})


			sceneEl.appendChild(positionEl);
			positionEl.appendChild(textEl);
		});
	}
}