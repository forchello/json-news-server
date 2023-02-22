const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

const { uuid } = require('uuidv4');
const app = express();
require('dotenv').config();

const url = process.env.MONGO_URL;

const Item = mongoose.model('Item', {
  id: String,
  title: String,
  body: String,
});

// Middleware
app.use(bodyParser.json());
app.use(cors())

// GET endpoint
app.get('/posts', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// GET endpoint
app.get('/posts/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const result = await Item.findOne({ id });
      res.json(result ?? {});
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
});

// ADD endpoint
app.post('/posts', async (req, res) => {
    try {
        const { title, body } = req.body;
        const item = await Item.create({id: uuid(), title, body});
        res.status(200).send(item);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});

// DELETE endpoint
app.delete('/posts/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Item.deleteOne({ id });
    console.log(result);
    if (result.deletedCount === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Connect to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });