UCJS = {};

UCJS.UseStep = function (promise) {

    var p = promise || new Promise(r => r());

    this.wait = UCJS.wait.bind(this);

    this.then = (cmd) => {
        console.log('then', cmd);
        p.then(() => console.log('p.then', cmd));
        return new UCJS.UseStep();
    };

    this.either = (cmdList) => {
        console.log('either', cmdList);
        return new UCJS.UseStep(
            Promise.race(
                cmdList.map(cmd => {
                    p.then(() => console.log('p.then', cmd));
                })
            )
        );
    };

    this.or = (cmd) => {
        console.log('or', cmd);
        p['catch'](() => console.log('p.catch', cmd));
        return this;
    };

    return this;

};

UCJS.UseCase = function (definition) {

    var p = new Promise(r => r());

    return new UCJS.UseStep(p);

};
UCJS.wait = function (cmd) {
    console.log('wait', cmd);

    return new UCJS.UseStep(
        new Promise(r => {

            window.addEventListener(cmd, () => {
                console.log('wait listener', cmd);
                r();
            });

        })
    );

};
UCJS.fire = function (cmd) {

    window.dispatchEvent(new CustomEvent(cmd));

};