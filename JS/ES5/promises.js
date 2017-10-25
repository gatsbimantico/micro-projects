/**
 * @author	César Costas Carrera	<costascarrera.cesar@gmail.com>
 *
 * PROMISE POLYFILL
 *
 * Is an exercise in coding to make some sync between async calls,
 * This implementation attempts to match the implementation on
 * Google Chrome 61
 * 
 * The exercise required:
 * - Avoiding storing the callbacks in an array
 * - Avoid creating unnecesary extra methods
 * - Making the resulting object the most exact match
 * 
 */
(function promisePolyfill(umd, scope) {

	// #region POLYFILL PRIVATE PROPERTIES
	var states = {
		PENDING: "pending",
		RESOLVED: "resolved",
		REJECTED: "rejected"
	};
	// #endregion

	// #region POLYFILL PRIVATE METHODS
	function resolve(value) {

		// Ignore if it was previously resolved
		if (this.parent['[[PromiseStatus]]'] !== states.PENDING) {

			return;

		}

		// Update the status
		this.parent['[[PromiseValue]]'] = value;
		this.parent['[[PromiseStatus]]'] = states.RESOLVED;

		setTimeout(function () {

			this.thens.child(value);
			this.thens.parent(value);

		}.bind(this));

	}

	function reject(value) {

		var parentCatchCallback,
			childCatchCallback;

		// Ignore if it was previously resolved
		if (this.parent['[[PromiseStatus]]'] !== states.PENDING) {

			return;

		}

		// Update the status
		this.parent['[[PromiseValue]]'] = value;
		this.parent['[[PromiseStatus]]'] = states.REJECTED;
		console.error('Uncaught (in promise)', value);

		setTimeout(function () {

			this.catches.parent.bind(this.parent);
			this.catches.parent(value);

			this.catches.child.bind(this.parent);
			this.catches.child(value);

		}.bind(this));

		return value;

	}
	// #endregion

	function Promise() {

		var resolver = arguments[0],
			prototype,
			emptyFn = function (value) { return value; },
			thenable = {
				parent: this,
				child: null,
				thens: { parent: emptyFn, child: emptyFn },
				catches: { parent: emptyFn, child: emptyFn }
			};

		if (!(this instanceof Promise)) {

			throw new TypeError('undefined is not a promise');

		}

		if (typeof resolver !== 'function') {

			throw new TypeError('Promise resolver ' + resolver + ' is not a function');

		}

		/**
		 * Creates a new scope to avoid conflicts
		 * in the name of the prototype function
		 */
		(function () { prototype = function Promise() { }; }());

		this.__proto__ = prototype;
		this['[[PromiseStatus]]'] = states.PENDING;
		this['[[PromiseValue]]'] = undefined;

		prototype.then = function thenableThen(callback) {

			if (thenable.child) {

				return thenable.child.then(callback);

			} else {

				thenable.child = new Promise(function (onFulfilled, onRejected) {

					thenable.thens.child = function (value) {

						onFulfilled(value);

					}

				});
				return new Promise(function (onFulfilled, onRejected) {

					thenable.thens.parent = function (value) {

						onFulfilled(callback(value));

					}

				});

			}

		};
		prototype['catch'] = function thenableCatch(callback) {

			if (thenable.child) {

				return thenable.child['catch'](callback);

			} else {

				thenable.child = new Promise(function (onFulfilled, onRejected) {

					thenable.catches.child = function (value) {

						onRejected(value);

					}

				});
				return new Promise(function (onFulfilled, onRejected) {

					thenable.catches.parent = function (value) {

						onRejected(callback(value));

					}

				});

			}

		};

		try {

			resolver(resolve.bind(thenable), reject.bind(thenable));

		} catch (e) {

			reject(e);

		}

	}

	Promise.resolve = function resolve() {

		var thenable = arguments[0];

		return new Promise(function (onFulfilled) {

			onFulfilled();

		}).then(thenable.then);

	};

	Promise.reject = function reject() {

		var thenable = arguments[0];

		return new Promise(function (onFulfilled, onRejected) {

			onRejected();

		})['catch'](thenable['catch']);

	};

	Promise['all'] = function () {

		var promises = arguments[0];

		return new Promise(function (onFulfilled, onRejected) {

			var length = promises.length,
				response = [];

			function check() {

				if (promises.length === response.length) {

					onFulfilled(response);

				}

			}

			promises.forEach(function (promise) {

				promise.then(function (value) {

					response.push(value);
					check();

				}).catch(function (value) {

					onRejected(value);

				});
			});

		});

	};
	Promise.race = function () {

		var promises = arguments[0];

		return new Promise(function (onFulfilled, onRejected) {

			var length = promises.length,
				response = [];

			promises.forEach(function (promise) {

				promise.then(function (value) {

					onFulfilled(value);

				}).catch(function (value) {

					onRejected(value);

				});
			});

		});

	};

	umd('PromiseA', Promise);

})(function UMD(name, definition) {

	var scope;

	if (typeof module !== 'undefined' && module.exports) {

		module.exports = definition;

	} else if (typeof exports !== 'undefined') {

		exports = definition;

	} else if (typeof define === 'function' && define.amd) {

		define(function AMD() {

			return definition;

		});

	} else {

		scope = typeof global !== 'undefined' ? global : this;
		scope[name] = scope[name] || definition;

	}

});
