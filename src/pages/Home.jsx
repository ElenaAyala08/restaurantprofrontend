
import { Box, Typography, Container, Paper } from '@mui/material';
import WavingHandIcon from '@mui/icons-material/WavingHand'; // Opcional: icono de saludo

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 4,
            background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
            border: '1px solid #e0e6ed'
          }}
        >
          <WavingHandIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          
          <Typography variant="h2" component="h1" fontWeight="800" gutterBottom color="primary">
            ¡Hola de nuevo! CRUSO DE MERN
          </Typography>
          
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
            Bienvenido al Sistema de Ventas.
          </Typography>
          
          <Typography variant="body1" color="text.disabled">
            Usa el menú lateral para gestionar tus registros y operaciones.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;