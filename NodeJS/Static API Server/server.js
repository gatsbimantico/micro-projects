require('http')
    .createServer((req, res) => {
        var json;
        try {
            json = require('fs').readFileSync('.' + req.url);
        } catch (e) {
            json = '{"status":"error"}';
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(json);
    })
    .listen(3000, 'localhost');
