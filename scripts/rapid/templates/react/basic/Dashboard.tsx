import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        <div
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '4px',
          }}
        >
          <h2>Card 1</h2>
          <p>This is a sample card component</p>
        </div>
        <div
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '4px',
          }}
        >
          <h2>Card 2</h2>
          <p>Another sample card component</p>
        </div>
        <div
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '4px',
          }}
        >
          <h2>Card 3</h2>
          <p>Yet another sample card</p>
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}
