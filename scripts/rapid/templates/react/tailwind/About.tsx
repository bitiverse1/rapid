import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About</h1>
        <p className="text-gray-700 mb-4">
          This is a sample application built with React, Tailwind CSS, and React
          Router.
        </p>
        <p className="text-gray-700 mb-6">
          Tailwind CSS is a utility-first CSS framework that provides low-level
          utility classes to build custom designs.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
