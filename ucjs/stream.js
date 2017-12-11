/**
 * @author	César Costas Carrera	<costascarrera.cesar@gmail.com>
 *
 * STREAM
 * 
 */
(function streamDefinition(umd, scope) {

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
		// if (this.parent['[[StreamStatus]]'] !== states.PENDING) {

		// 	return;

		// }

		// Update the status
		this.parent['[[StreamValue]]'] = value;
		this.parent['[[StreamStatus]]'] = states.RESOLVED;

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
		if (this.parent['[[StreamStatus]]'] !== states.PENDING) {

			return;

		}

		// Update the status
		this.parent['[[StreamValue]]'] = value;
		this.parent['[[StreamStatus]]'] = states.REJECTED;
		console.error('Uncaught (in stream)', value);

		setTimeout(function () {

			this.catches.parent.bind(this.parent);
			this.catches.parent(value);

			this.catches.child.bind(this.parent);
			this.catches.child(value);

		}.bind(this));

		return value;

	}
	// #endregion

	function Stream() {

		var resolver = arguments[0],
			emptyFn = function (value) { return value; },
			thenable = {
				parent: this,
				child: null,
				thens: { parent: emptyFn, child: emptyFn },
				catches: { parent: emptyFn, child: emptyFn }
			};

		if (!(this instanceof Stream)) {

			throw new TypeError('undefined is not a stream');

		}

		if (typeof resolver !== 'function') {

			throw new TypeError('Stream resolver ' + resolver + ' is not a function');

		}

		this['[[StreamStatus]]'] = states.PENDING;
		this['[[StreamValue]]'] = undefined;
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

					thenable.child = new Stream(function (__then, __catch) {

						thenable.thens.child = function (value) {

							return __then(value);

						}

					});
					return new Stream(function (__then, __catch) {

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

					thenable.child = new Stream(function (__then, __catch) {

						thenable.catches.child = function (value) {

							return __catch(value);

						}

					});
					return new Stream(function (__then, __catch) {

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

	Object.defineProperty(Stream.prototype, 'then', {
		value: function _then() {

			return this.__prototype__.then(arguments[0]);

		}
	});

	Object.defineProperty(Stream.prototype, 'catch', {
		value: function _catch() {

			return this.__prototype__.catch(arguments[0]);

		}
	});

	Object.defineProperty(Stream, "resolve", {
		value: function resolve() {

			var thenable = arguments[0];

			return new Stream(function (__then) {

				__then();

			}).then(thenable.then);

		}
	});

	Object.defineProperty(Stream, "reject", {
		value: function reject() {

			var thenable = arguments[0];

			return new Stream(function (__then, __catch) {

				__catch();

			})['catch'](thenable['catch']);

		}
	});

	Object.defineProperty(Stream, "all", {
		value: function all() {

			var streams = arguments[0];

			return new Stream(function (__then, __catch) {

				var length = streams.length,
					response = [];

				function check() {

					if (streams.length === response.length) {

						__then(response);

					}

				}

				streams.forEach(function (stream) {

					stream.then(function (value) {

						response.push(value);
						check();

					}).catch(function (value) {

						__catch(value);

					});
				});

			});

		}
	});

	Object.defineProperty(Stream, "race", {
		value: function race() {

			var streams = arguments[0];

			return new Stream(function (__then, __catch) {

				var length = streams.length,
					response = [];

				streams.forEach(function (stream) {

					stream.then(function (value) {

						__then(value);

					}).catch(function (value) {

						__catch(value);

					});
				});

			});

		}
	});

	umd('Stream', Stream);

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
