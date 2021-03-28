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
        function: (fn, par, client) => JSON.stringify(fn(client, par))
    };
    Config._matching = [];
    Starting.Config = Config;
    class Server extends Config {
        static start() {
            Utils.createMatchingRoutes();
            const server = http.createServer((req, res) => {
                res.end(Utils.routerWatcher({ req, res }).toString());
            }).listen(this.port, this.startCallback);
            console.log(this._matching);
            Config._server = server;
        }
    }
    Starting.Server = Server;
    class Utils extends Config {
        static routerWatcher(client) {
            let par;
            let route = this.router[client.req.url];
            if (!route) {
                for (let i = 0; i < this._matching.length; i++) {
                    const rx = this._matching[i];
                    par = client.req.url.match(rx[0]);
                    if (par) {
                        par.shift();
                        route = rx[1];
                        break;
                    }
                }
            }
            const type = typeof route;
            const renderer = this._types[type];
            return renderer(route, par, client);
        }
        static createMatchingRoutes() {
            for (const item in this.router) {
                if (item.includes('*')) {
                    const rx = new RegExp(item.replace('*', '(.*)'));
                    const route = this.router[item];
                    this._matching.push([rx, route]);
                    delete this.router[item];
                }
            }
        }
    }
})(Starting || (Starting = {}));
Starting.Config.router = {
    '/': 'Hello world!',
    '/func': (client, par) => {
        return { url: client.req.url };
    },
    '/sex/*': (client, par) => `parameter = ${par[0]}`
};
Starting.Server.start();
//# sourceMappingURL=main.js.map