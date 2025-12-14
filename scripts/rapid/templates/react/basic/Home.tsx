import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Your App</h1>
      <p>Built with React and React Router</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/about" style={{ marginRight: '1rem' }}>
          About
        </Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}
