import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Card 1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is a sample card component
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Card 2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Another sample card component
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Card 3
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yet another sample card
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" component={Link} to="/">
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
