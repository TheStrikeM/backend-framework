"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
var Starting;
(function (Starting) {
    class Config {
    }
    Config.port = 8000;
    Config.hostname = '127.0.0.1';
    Config.router = { '/': 'Hello!' };
    Config.startCallback = () => {
        console.log(`Server has started on http://${Config.hostname}:${Config.port}/`);
    };
    Config._server = null;
    Config._types = {
        object: JSON.stringify,
        string: s => s,
        number: n => n.toString(),
        undefined: () => '404',
        function: (fn, req, res) => JSON.stringify(fn(req, res))
    };
    Config.matching = {};
    Starting.Config = Config;
    class Server {
        static start() {
            const server = http.createServer((req, res) => {
                const data = Config.router[req.url];
                const result = Config._types[typeof data](data, req, res);
                res.end(result);
            }).listen(Config.port, Config.startCallback);
            server.on('error', (err) => {
                err.code == 'EACCES' ?
                    console.log(`No access to http://${Config.hostname}:${Config.port}/`) : console.log(err.code);
            });
            Config._server = server;
        }
    }
    Starting.Server = Server;
    class Utils {
        static routerWatcher(client) { }
    }
})(Starting || (Starting = {}));
Starting.Config.router = {
    '/': 'Hello world!',
    '/func': (req, res) => {
        return { url: req.url };
    }
};
Starting.Server.start();
//# sourceMappingURL=main.js.map