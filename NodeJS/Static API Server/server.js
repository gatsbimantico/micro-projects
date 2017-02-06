require('http')
    .createServer((req, res) => {
        if (req.url == '/favicon.ico') return;

        var json,
            route = '.' + req.url;
        console.log(req.method + ' ' + route);

        try {
            json = require('fs').readFileSync(route);
        } catch (e) {
            json = '{"status":"error"}';
        }

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
        });
        res.end(json);
    })
    .listen(3000, 'localhost');
