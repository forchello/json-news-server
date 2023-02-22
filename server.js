const jsonServer = require('json-server');
const { createBridge } = require('@vercel/node-bridge');

const bridge = createBridge();

const server = jsonServer.create();

const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.delete('/:resource/:id', (req, res) => {
    try {
        const resource = req.params.resource;
        const id = Number(req.params.id);

        const data = bridge.fs.readFileSync('db.json', 'utf8');
        const parsedData = JSON.parse(data);
        const index = parsedData[resource].findIndex((item) => item.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Element not found' });
        }

        const result = parsedData[resource].filter((item) => item.id !== id);
        parsedData[resource] = result;

        bridge.fs.writeFileSync('db.json', JSON.stringify(parsedData));
        res.status(200).json({ message: 'success' });
    } catch (error) {
        return res.status(400).json({ error });
    }
});

server.use(router)
server.listen(process.env.PORT || 8000, () => {
    console.log('JSON Server is running')
})

module.exports = server;