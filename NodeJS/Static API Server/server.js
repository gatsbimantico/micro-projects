require('http')
    .createServer((req, res) => {
        if (req.url == '/favicon.ico') return;

        var json,
            status,
            route = '.' + req.url.replace(/\?.*$/g,'');

        try {
            json = require('fs').readFileSync(route);
            status = 200;
        } catch (e) {
            json = '{"status":"error"}';
            status = 404;
        }
        console.log(req.method, status, route);

        res.writeHead(status, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
        });
        res.end(json);
    })
    .listen(3000, 'localhost');
