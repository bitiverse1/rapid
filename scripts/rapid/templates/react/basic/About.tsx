import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>About</h1>
      <p>This is a sample application built with React and React Router.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}
