import * as http from 'http';

namespace Starting {
    export class Config {
        public static port: number = 8000
        public static hostname: string = '127.0.0.1'
        public static router: object = { '/': 'Hello!' }
        public static startCallback: () => void = () => {
            console.log(`Server has started on http://${Config.hostname}:${Config.port}/`)
        }

        static _server: any = null
        static _types: object = {
            object: JSON.stringify,
            string: s => s,
            number: n => n.toString(),
            undefined: () => '404',
            function: (fn, par, client) => JSON.stringify(fn(client, par))
        }
        static _matching: any[] = []
    }

    export class Server extends Config {
        static start() {
            Utils.createMatchingRoutes()
            const server = http.createServer((req, res) => {
                res.end(Utils.routerWatcher({ req, res }).toString())
            }).listen(this.port, this.startCallback)

            console.log(this._matching)
            Config._server = server
        }
    }

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
            for(const item in this.router) {
                if(item.includes('*')) {
                    const rx = new RegExp(item.replace('*', '(.*)'));
                    const route = this.router[item]
                    this._matching.push([rx, route])

                    delete this.router[item];
                }
            }
        }
    }
}

Starting.Config.router = {
    '/': 'Hello world!',
    '/func': (client, par) => {
        return { url: client.req.url }
    },
    '/sex/*': (client, par) => `parameter = ${par[0]}`
}

Starting.Server.start()