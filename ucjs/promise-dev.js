var dependencies = new Promise(function (resolve) {

    require([
        // (window.Promise = null, './promises.js')
        '../javascript-chain/jschain.js'
    ])
    .then(function () {

        resolve();

    });

});

var lame = new Promise(() => {});

lame.then(() => {

    console.log('This story starts');
    var split = window.test = new Chain(function resolver (resolve, reject) {

        console.log('We are going to test:');

        window.addEventListener('trigger event', function (e) {

            console.log('- resolving a promise');
            resolve(e);
            console.log('...now is resolved');

        });

    })
    .then(() => {

        console.log('- returning a promise');
        return new Promise(function resolver (resolve, reject) {

            console.log('- resolving that promise');
            setTimeout(() => {
                resolve(3);
                console.log('...now is resolved');
            }, 3000);

        });

    })
    ;
    
    split.then((v) => {

        console.log('0.1. test suceed?', v);
        return 4;

    }).then((v) => {

        console.log('0.1.1. test suceed?', v);

    });

    split.then((v) => {

        console.log('0.2. test suceed?', v);

    });

    split.then((v) => {

        console.log('0.3. test suceed?', v);
        return 6;

    }).then((v) => {

        console.log('0.3.1. test suceed?', v);
        return 8;

    }).then((v) => {

        console.log('0.3.1.1. test suceed?', v);

    });

    split.then((v) => {

        console.log('0.4. test suceed?', v);
        return 7;

    }).then((v) => {

        console.log('0.4.1. test suceed?', v);
        return 9;

    });

    var st = {
        ev: null
    };

    new Chain(function resolver (resolve, reject) {

        console.log('We are going to test:');

        st.ev = function (e) {

            console.log('- resolving a promise');
            resolve(e);
            console.log('...now is resolved');

        };

    }).then(msg => {
        console.log(msg);

        return 2;

    }).then(msg => console.log(msg));

    window.UCJS = {
        fire: function (msg) {

            st.ev(msg);

        }
    };

});

lame.then(() => {

    // Test Chain interface
    console.log('Test Chain interface');

    var tci = new Chain(() => {});

    var loop = tci.then(() => {});

    tci
        .then(() => console.log(0))

    loop
        .then(() => console.log('restart'))
        .then(() => {

            setTimeout(() => {

                console.log('iteration');
                loop.resolve();

            }, 350);

        });

    loop
        .then(() => console.log(1))
        .then(() => console.log(2))
        .then(() => console.log(3));

    loop.catch(() => console.log('locked!'));

    tci.resolve();

    setTimeout(() => {

        console.log('pause');
        loop.pause();

    }, 1000);

    setTimeout(() => {

        console.log('resume');
        tci.pause();
        loop.resume();

    }, 5000);

    setTimeout(() => {

        console.log('lock');
        loop.lock();

    }, 6000);

    setTimeout(() => {

        console.log('resume');
        loop.resume();
        loop.resolve();

    }, 9000);

    setTimeout(() => {

        console.log('destroy');
        loop.destroy();

    }, 10000);

    // console.log('tci.then', tci.then);
    // console.log('tci.catch', tci.catch);
    // console.log('tci.resolve', tci.resolve);
    // console.log('tci.reject', tci.reject);
    // console.log('Object.prototype.defineChain', Object.prototype.defineChain);
    // console.log('tci.isPENDING', typeof tci.isPENDING !== 'undefined');
    // console.log('tci.isRESOLVED', typeof tci.isRESOLVED !== 'undefined');
    // console.log('tci.isREJECTED', typeof tci.isREJECTED !== 'undefined');
    // console.log('tci.isLOCKED', typeof tci.isLOCKED !== 'undefined');
    // console.log('tci.isPAUSED', typeof tci.isPAUSED !== 'undefined');
    // console.log('tci.isDESTROYED', typeof tci.isDESTROYED !== 'undefined');
    // console.log('tci.lock', tci.lock);
    // console.log('tci.pause', tci.pause);
    // console.log('tci.resume', tci.resume);
    // console.log('tci.destroy', tci.destroy);

});

dependencies.then(() => {

    class BindedElement extends HTMLElement {
        static get is() { return 'binded-element'; }

        constructor() {
            super();
            // self.defineChain('bind');
            console.log(this);
            this.asdf = 5;
            return this;
        }

        connectedCallback() {
            console.log(`connectedCallback`);
            console.log(this.asdf) // undefined instead of 5
        }
    }

    window.BE = document.registerElement(BindedElement.is, BindedElement);

});
