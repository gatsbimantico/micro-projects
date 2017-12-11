(function () {
	'use strict';

	function Require() {

		function moduleLoader(path, resolve, reject) {
			var script = document.createElement('script');
			script.src = path;
			script.async = false;
			script.onload = function () {
				console.info(path + ' loaded');
				resolve();
			};
			script.onerror = function () {
				reject();
			};
			document.body.appendChild(script);
		}

		return function require(paths) {
			var pathsTotal = paths.length,
				pathsLoaded = 0,
				alreadyLoaded = Array.prototype.slice
					.call(document.querySelectorAll('script'))
					.map(function (script) {
						return script.src;
					}),
				callback = {
					then: function () {}
				};

			paths.forEach(function (path) {

				var resolve = function () {

						pathsLoaded += 1;
						if (pathsLoaded === pathsTotal) {
							callback.then();
						}

					},
					isLoaded = alreadyLoaded.indexOf(path) !== -1;

				if (isLoaded) {

					setTimeout(function () {
						resolve();
					});

				} else {

					moduleLoader(path, resolve);

				}

			});

			return {
				then: function (_then) {
					callback.then = _then;
				}
			};

		}

	}

	window.require = new Require();
}());