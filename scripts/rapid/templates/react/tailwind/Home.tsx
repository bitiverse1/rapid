import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to Your App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Built with React, Tailwind CSS, and React Router
        </p>
        <div className="space-x-4">
          <Link
            to="/about"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            About
          </Link>
          <Link
            to="/dashboard"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
