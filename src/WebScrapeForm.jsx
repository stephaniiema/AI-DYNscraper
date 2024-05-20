import React, { useState } from 'react';
import WebScrape from './WebScrape';

const WebScrapeForm = () => {
  const [url, setUrl] = useState('');

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
    if (url.trim() !== '') {
      // Pass the URL to the WebScrape component
      return <WebScrape url={url} />;
    } else {
      alert('Please enter a valid URL.');
    }
  };

  return (
    <div>
      <h1>Scrape Web Data</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={url} onChange={handleUrlChange} placeholder="Enter URL to scrape from" />
        <button type="submit">Scrape</button>
      </form>
    </div>
  );
};

export default WebScrapeForm;
