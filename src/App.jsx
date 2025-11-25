import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css' // Assuming this file has styles for .App
import PortfolioPage from './portfoliopage/portfoliopage'; 
// Use the React entrypoint for Vercel Analytics in a Vite/CRA-style app
import { Analytics } from '@vercel/analytics/react';

function App() {
  useEffect(() => {
    document.title = 'Mohit Bellwani';
  }, []);
  return (
    <div className="App">
      {/* Render the Portfolio Page here */}
      <PortfolioPage />
      <Analytics/>
    </div>
  )
}

export default App
