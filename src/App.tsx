import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import GlobeTest from './pages/GlobeTest'
import OnlyEarth from './pages/OnlyEarth'
import Atmosphere from './pages/Atmosphere'
import LEO from './pages/LEO'
import GlobeCamera from './pages/GlobeCamera'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <nav style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '2rem', flexShrink: 0 }}>
          <Link to="/">首页</Link>
          <Link to="/globeTest">globeTest</Link>
          <Link to="/globeCamera">globeCamera</Link>
          <Link to="/onlyEarth">OnlyEarth</Link>
          <Link to="/atmosphere">Atmosphere</Link>
          <Link to="/leo">LEO</Link>
          <Link to="/about">关于</Link>
        </nav>
        
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/globeTest" element={<GlobeTest />} />
            <Route path="/globeCamera" element={<GlobeCamera />} />
            <Route path="/onlyEarth" element={<OnlyEarth />} />
            <Route path="/atmosphere" element={<Atmosphere />} />
            <Route path="/leo" element={<LEO />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
