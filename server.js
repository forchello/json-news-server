const jsonServer = require('json-server');
const data = require('./db.json');

const server = jsonServer.create();

const isProductionEnv = process.env.NODE_ENV === 'production';
const router = jsonServer.router(isProductionEnv ? clone(data) : 'db.json', {
    _isFake: isProductionEnv
});

const middlewares = jsonServer.defaults();

server.use(middlewares);

server.delete('/:resource/:id', (req, res) => {
    const resource = req.params.resource;
    const id = Number(req.params.id);

    const data = router.db.get(resource).value();
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Element not found' });
    }

    const result = data.filter((item) => item.id !== id);
    router.db.set(resource, result).write();

    res.status(200).json({ message: 'success' });
});

server.use(router)
server.listen(process.env.PORT || 8000, () => {
    console.log('JSON Server is running')
})

module.exports = server;