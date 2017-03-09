(function () {
	'use strict';

	if (!!window.Promise) {
		return;
	}

	window.Promise = class Promise {
		constructor(promisedCode) {
			this.onFulfilled = function () {};
			this.onRejected = function () {};
			this.resolved = false;

			this.then = function (onFulfilled, onRejected) {
				this.onFulfilled = onFulfilled || this.onFulfilled;
				this.onRejected = onRejected || this.onRejected;
				return this;
			};

			this.catch = function (onRejected) {
				this.onRejected = onRejected || this.onRejected;
				return this;
			};

			var self = this;

			this.resolve = function () {
				if (self.resolved) {
					return;
				}
				self.onFulfilled.apply(self, arguments);
				self.resolved = true;
			}

			this.reject = function () {
				if (self.resolved) {
					return;
				}
				self.onRejected.apply(self, arguments);
				self.resolved = true;
			}

			setTimeout(() => promisedCode(this.resolve, this.reject), 1);
		}
	};

}());