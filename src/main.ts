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
            function: (fn, req, res) => JSON.stringify(fn(req, res))
        }

        private static matching: object = {}
    }

    export class Server {
        static start() {
            const server = http.createServer((req, res) => {
                const data = Config.router[req.url]
                const result = Config._types[typeof data](data, req, res)
                res.end(result)
            }).listen(Config.port, Config.startCallback)

            server.on('error', (err: any) => {
                err.code == 'EACCES' ?
                    console.log(`No access to http://${Config.hostname}:${Config.port}/`) : console.log(err.code)
            })

            Config._server = server
        }
    }

    class Utils {
        static routerWatcher(client) {}
    }
}

Starting.Config.router = {
    '/': 'Hello world!',
    '/func': (req, res) => {
        return { url: req.url }
    }
}

Starting.Server.start()