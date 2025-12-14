import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <nav
          style={{
            padding: '1rem',
            borderBottom: '1px solid #ccc',
            backgroundColor: '#f8f9fa',
          }}
        >
          <Link
            to="/"
            style={{
              marginRight: '1rem',
              textDecoration: 'none',
              color: '#007bff',
            }}
          >
            Home
          </Link>
          <Link
            to="/about"
            style={{
              marginRight: '1rem',
              textDecoration: 'none',
              color: '#007bff',
            }}
          >
            About
          </Link>
          <Link
            to="/dashboard"
            style={{ textDecoration: 'none', color: '#007bff' }}
          >
            Dashboard
          </Link>
        </nav>
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
