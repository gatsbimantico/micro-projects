window.require([
	"./JS/ES6/game/item.js",
	"./JS/ES6/game/option.js",
	"./JS/ES6/game/path.js",
	"./JS/ES6/game/room.js",
	"./JS/ES6/game/gamemap.js",
	"./JS/ES6/game/game.js"
], function () {

	window.game = new Game();
	game.map = new GameMap();


	game.map.rooms = {
		theLandingRoom: new Room({
			id: 'theLandingRoom',
			name: 'Landing Room',
			description: "You've landed this world"
		}),
		theNextRoom: new Room({
			id: 'theNextRoom',
			name: 'Next Room',
			description: "This is the next room"
		}),
		theOtherRoom: new Room({
			id: 'theOtherRoom',
			name: 'Other Room',
			description: "This is the other room"
		})
	};

	game.map.paths = {
		theNextDoor: new Path({
			id: 'theNextDoor',
			name: 'Next Door',
			description: "A regular door",
			theta: 0,
			source: game.map.rooms.theLandingRoom.id,
			target: game.map.rooms.theNextRoom.id
		}),
		theOtherDoor: new Path({
			id: 'theOtherDoor',
			name: 'Other Door',
			description: "A regular door",
			theta: 90,
			source: game.map.rooms.theLandingRoom.id,
			target: game.map.rooms.theOtherRoom.id
		}),
		theLinkDoor: new Path({
			id: 'theLinkDoor',
			name: 'Link Door',
			description: "A regular door",
			theta: -40,
			source: game.map.rooms.theNextRoom.id,
			target: game.map.rooms.theOtherRoom.id
		})
	};

	game.render();
});