
const express = require('express');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');


const indexPath = path.join(__dirname, './index.html');
const cssPath = path.join(__dirname, './style.css');



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

app.get('/', async (req, res) => {
	try {
		await client.connect(); 

		const randomNumber = getRandomNumber()

		const db = client.db(dbName);
		const collection = db.collection(collectionName);
		const quotes = await collection.find({id:randomNumber}).toArray(); 
		const quotesMovie = quotes.map((quote) => quote.movie);
		const quotesContent = quotes.map((quote) => quote.content);
		const quotesAuthor = quotes.map((quote) => quote.author);
		const quotesYt = quotes.map((quote) => quote.yt);

		fs.readFile(indexPath, 'utf8', (err, data) => {
			if (err) {
				console.log('Cannot read html file', err);
				return res.status(500).send('Server error');
			}
			const modifiedData = data
				.replace(
					'<span class="quote-content"></span',
					`<span class="quote-content">${quotesContent}</span>`
				)
				.replace(
					'<span class="author"></span>',
					`<span class="author">${quotesAuthor} - </span>`
				)
				.replace(
					'<span class="movie"></span>',
					`<span class="movie">${quotesMovie}</span>`
				)
				.replace(
					'<a href="">',
					`<a href="${quotesYt}" target ="_blank">`
				);
			res.send(modifiedData);
		});
	} catch (error) {
		console.log(
			'There was an error with the connection to the database:',
			error
		);
		res.status(500).send('Server Error');
	} finally {
		client.close();
	}
});

app.get('/style.css', (req, res) => {
	const cssFileStream = fs.createReadStream(cssPath, 'utf8');
	cssFileStream.pipe(res);
  });

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
