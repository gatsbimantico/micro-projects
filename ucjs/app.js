require([
    // (window.Promise = null, './promises.js'),
    './uc.js'
], function () {

    new UCJS.UseCase({
        name	: 'User is asked for cookies with a confirmation dialog',
        ticket	: 'UC-0001'
    })
        .wait('Window: Load') // stream
        .then('Load confirmation dialog: Open')
        .either([ // all
            UCJS.wait('Load confirmation dialog: Accept') // stream
                .then('Load confirmation dialog: Close')
                .then('Log: Succes')
                .or('Log: Error'),
            UCJS.wait('Load confirmation dialog: Reject')
                .then('Load confirmation dialog: Close')
                .then('Log: Error')
                .or('Log: Error')
        ]);

    UCJS.fire('Window: Load');

});
