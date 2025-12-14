import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Your App
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Built with React, Material-UI, and React Router
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" component={Link} to="/about" sx={{ mr: 2 }}>
            About
          </Button>
          <Button variant="outlined" component={Link} to="/dashboard">
            Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
