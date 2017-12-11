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

		if (value instanceof Promise) {

			value.then(function (promisedValue) {

				this.thens.child(promisedValue);
				this.thens.parent(promisedValue);

			}.bind(this));

		} else {

			setTimeout(function () {

				this.thens.child(value);
				this.thens.parent(value);


			}.bind(this));

		}

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

		this['[[PromiseStatus]]'] = states.PENDING;
		this['[[PromiseValue]]'] = undefined;
		Object.defineProperty(this, '__prototype__', {
			value: {}
		});

		Object.defineProperty(this.__prototype__, 'then', {
			value: function _then() {

				var callback = arguments[0];

				if (thenable.child) {

					return thenable.child.then(function (value) {

						return callback(value);

					});

				} else {

					thenable.child = new Promise(function (__then, __catch) {

						thenable.thens.child = function (value) {

							return __then(value);

						}

					});
					return new Promise(function (__then, __catch) {

						thenable.thens.parent = function (value) {

							return __then(callback(value));

						}

					});

				}

			}
		});

		Object.defineProperty(this.__prototype__, 'catch', {
			value: function _catch() {

				var callback = arguments[0];

				if (thenable.child) {

					return thenable.child['catch'](callback);

				} else {

					thenable.child = new Promise(function (__then, __catch) {

						thenable.catches.child = function (value) {

							return __catch(value);

						}

					});
					return new Promise(function (__then, __catch) {

						thenable.catches.parent = function (value) {

							return __catch(callback(value));

						}

					});

				}

			}
		});


		try {

			resolver(resolve.bind(thenable), reject.bind(thenable));

		} catch (e) {

			reject(e);

		}

	}

	Object.defineProperty(Promise.prototype, 'then', {
		value: function _then() {

			return this.__prototype__.then(arguments[0]);

		}
	});

	Object.defineProperty(Promise.prototype, 'catch', {
		value: function _catch() {

			return this.__prototype__.catch(arguments[0]);

		}
	});

	Object.defineProperty(Promise, "resolve", {
		value: function resolve() {

			var thenable = arguments[0];

			return new Promise(function (__then) {

				__then();

			}).then(thenable.then);

		}
	});

	Object.defineProperty(Promise, "reject", {
		value: function reject() {

			var thenable = arguments[0];

			return new Promise(function (__then, __catch) {

				__catch();

			})['catch'](thenable['catch']);

		}
	});

	Object.defineProperty(Promise, "all", {
		value: function all() {

			var promises = arguments[0];

			return new Promise(function (__then, __catch) {

				var length = promises.length,
					response = [];

				function check() {

					if (promises.length === response.length) {

						__then(response);

					}

				}

				promises.forEach(function (promise) {

					promise.then(function (value) {

						response.push(value);
						check();

					}).catch(function (value) {

						__catch(value);

					});
				});

			});

		}
	});

	Object.defineProperty(Promise, "race", {
		value: function race() {

			var promises = arguments[0];

			return new Promise(function (__then, __catch) {

				var length = promises.length,
					response = [];

				promises.forEach(function (promise) {

					promise.then(function (value) {

						__then(value);

					}).catch(function (value) {

						__catch(value);

					});
				});

			});

		}
	});

	umd('Promise', Promise);

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
