"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const hostname = '127.0.0.1';
const port = '8000';
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});
server.listen(port, () => {
    console.log(`Server has started on http://${hostname}:${port}/`);
});
server.on('error', (err) => {
    err.code == 'EACCES' ? console.log(`No access to http://${hostname}:${port}/`) : console.log(err.code);
});
//# sourceMappingURL=index.js.map