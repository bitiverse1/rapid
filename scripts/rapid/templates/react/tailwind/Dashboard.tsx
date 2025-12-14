import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Card 1</h2>
          <p className="text-gray-600 mb-4">This is a sample card component</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Learn More →
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Card 2</h2>
          <p className="text-gray-600 mb-4">Another sample card component</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Learn More →
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Card 3</h2>
          <p className="text-gray-600 mb-4">Yet another sample card</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Learn More →
          </button>
        </div>
      </div>
      <Link
        to="/"
        className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
