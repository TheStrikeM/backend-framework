import * as http from 'http';

const hostname = '127.0.0.1'
const port = '8000'

const routing = {
    '/': 'Hello world!',
    '/obj': { name: "Oleg", age: 20 },
    '/func': (req, res) => {
        return { url: req.url, cookie: req.headers.cookie }
    }
}


const types = {
    object: JSON.stringify,
    string: s => s,
    number: n => n.toString(),
    undefined: () => '404',
    function: (fn, req, res) => JSON.stringify(fn(req, res))
}

const server = http.createServer((req, res) => {
    const data = routing[req.url]
    const result = types[typeof data](data, req, res)
    res.end(result)
})

server.listen(port, () => {
    console.log(`Server has started on http://${hostname}:${port}/`)
})

server.on('error', (err: any) => {
    err.code == 'EACCES' ? console.log(`No access to http://${hostname}:${port}/`) : console.log(err.code)
})