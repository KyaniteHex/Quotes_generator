let nextQuoteButton;
let quoteContent;
let author;
let movie;
let yt;

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
};

const prepareDOMElements = () => {
	nextQuoteButton = document.querySelector('.next-quote');
	quoteContent = document.querySelector('.quote-content');
	author = document.querySelector('.author');
	movie = document.querySelector('.movie');
	yt = document.querySelector('.youtube-href');
};
const prepareDOMEvents = () => {
	nextQuoteButton.addEventListener('click', nextQuoteEvent);
};

const nextQuoteEvent = async () => {
	try {
		const response = await fetch('/next-quote');
		const data = await response.json();
		quoteContent.textContent = data.content;
		author.textContent = data.author + ' - ';
		movie.textContent = data.movie;
        if(data.yt===''){
            yt.href==='#'
        }
		yt.href = data.yt;
	} catch (error) {
		console.log('Error fetching the next quote:', error);
	}
};

document.addEventListener('DOMContentLoaded', main);
