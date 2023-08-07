const express = require('express');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, './index.html');
const cssPath = path.join(__dirname, './style.css');
const jsPath = path.join(__dirname, './script.js');


const app = express();
const port = 3000;

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'QuoteWebsite';
const collectionName = 'quotes';
const client = new MongoClient(url);

const getRandomNumber = () => {
  const randomNumber = Math.floor(Math.random() * 11) + 1;
  return randomNumber;
};

app.get('/', (req, res) => {
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      console.log('Cannot read html file', err);
      return res.status(500).send('Server error');
    }
    res.send(data);
  });
});

app.get('/next-quote', async (req, res) => {
  try {
    await client.connect();

    const randomNum = getRandomNumber();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const quote = await collection.findOne({ id: randomNum });

    res.json(quote);
  } catch (error) {
    console.log('Error with the connection to the database:', error);
    res.status(500).send('Server Error');
  } finally {
    client.close();
  }
});

app.get('/style.css', (req, res) => {
  const cssFile = fs.createReadStream(cssPath, 'utf8');
  cssFile.pipe(res);
});

app.get('/script.js', (req, res) => {
	const jsFile = fs.createReadStream(jsPath, 'utf8');
	jsFile.pipe(res);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
