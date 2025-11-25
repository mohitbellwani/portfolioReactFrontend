import React from 'react';
import MBLogo from './Logo.jsx';
import './portfoliopage.css';

const PortfolioPage = () => {
  return (
    <div className="portfolio-container">
      <header className="portfolio-header">
        <MBLogo />
        <h1>Mohit Bellwani</h1>
      </header>
      <div className="portfolio-body">
        <div className="left-panel">
          <h2>About Me</h2>
          <p>This is the left panel. It will remain sticky on scroll in desktop view.</p>
        </div>
        <div className="right-panel">
          <h2>My Work</h2>
          <p>Scroll down to see the effect on the left panel.</p>
          <div style={{ height: '200vh', background: '#f0f0f0', padding: '1rem' }}>Extra content to enable scrolling.</div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;