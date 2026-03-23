import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Cesium3Dtiles from './pages/Cesium3Dtiles'
import OnlyEarth from './pages/OnlyEarth'
import Atmosphere from './pages/Atmosphere'
import LEO from './pages/LEO'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <nav style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '2rem', flexShrink: 0 }}>
          <Link to="/">首页</Link>
          <Link to="/cesium3Dtiles">cesium3Dtiles</Link>
          <Link to="/onlyEarth">OnlyEarth</Link>
          <Link to="/atmosphere">Atmosphere</Link>
          <Link to="/leo">LEO</Link>
          <Link to="/about">关于</Link>
        </nav>
        
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/cesium3Dtiles" element={<Cesium3Dtiles />} />
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
