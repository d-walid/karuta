import { Routes, Route } from 'react-router-dom'

import MenuPage from './pages/MenuPage'
import GamePage from './pages/GamePage'
import ResultsPage from './pages/ResultsPage'


function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/game/:theme" element={<GamePage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  )
}

export default App