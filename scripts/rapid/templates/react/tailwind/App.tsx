import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="text-2xl font-bold text-blue-600">My App</div>
              <div className="space-x-6">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  About
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex-grow overflow-auto">
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
