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

		return function require(paths, file) {
			var pathsTotal = paths.length;
			var pathsLoaded = 0;
			var alreadyLoaded = Array.prototype.slice
				.call(document.querySelectorAll('script'))
				.map(function (script) {
					return script.src;
				});

			paths.forEach(function (path) {
				new Promise(function (resolve, reject) {
					var isLoaded = alreadyLoaded.indexOf(path) !== -1;

					if (isLoaded) {
						resolve();
					} else {
						moduleLoader(path, resolve, reject);
					}
				}).then(function () {
					pathsLoaded += 1;
					if (pathsLoaded === pathsTotal) {
						file();
					}
				});
			});
		}

	}

	window.require = new Require();
}());