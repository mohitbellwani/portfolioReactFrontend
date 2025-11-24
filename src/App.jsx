import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PortfolioPage from './portfoliopage/portfoliopage'; 

function App() {
  useEffect(() => {
    document.title = 'Mohit Bellwani';
  }, []);
  return (
    <div className="App">
      {/* Render the Portfolio Page here */}
      <PortfolioPage />
    </div>
  )
}

export default App
