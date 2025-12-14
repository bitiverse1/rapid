import { Link } from 'react-router-dom';
import { Container, Typography, Paper, Box, Button } from '@mui/material';

export default function About() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" paragraph>
          This is a sample application built with React, Material-UI, and React
          Router.
        </Typography>
        <Typography variant="body1" paragraph>
          Material-UI provides a comprehensive set of UI components that follow
          Google's Material Design guidelines.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" component={Link} to="/">
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
