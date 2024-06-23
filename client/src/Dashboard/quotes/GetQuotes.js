import React, { useState, useEffect } from 'react';
import quotesData from './quotes';
import '../styles/GetQuote.css';

function GetQuotes() {
  const [ displayQuote, setDisplayQuote ] = useState({ quote: '', author: ''});

  useEffect(() => {
    const selectRandomQuote = () => {

      const authors = Object.keys(quotesData);
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
      const authorQuotes = quotesData[randomAuthor];
      const randomQuote = authorQuotes[Math.floor(Math.random() * authorQuotes.length)]
      const formattedQuote = `"${randomQuote}"`;
      const formattedAuthor = ` ${randomAuthor.replace(/([A-Z])/g, ' $1').trim()}`;
      setDisplayQuote({ quote: formattedQuote, author: formattedAuthor });
    }

    selectRandomQuote();

    const intervalId = setInterval(() => {
      selectRandomQuote();
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);
  
    return (
      <div className="card" id='quote-card'>
        <div className="card-body" id='quote-card-body'>
          <blockquote className="blockquote mb-0">
            <p className='quote-quote text-center'> {displayQuote.quote} </p>
            <footer className="blockquote-footer text-center" id='quote-footer'> {displayQuote.author} </footer>
          </blockquote>
        </div>
      </div>
    )
}

export default GetQuotes;


