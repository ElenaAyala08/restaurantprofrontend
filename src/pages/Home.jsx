import { Box, Typography, Container, Button, Stack } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant'; 
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '85vh',
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        // Imagen de comida profesional (puedes cambiar esta URL por otra de comida)
        backgroundImage: 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      }}
    >
      {/* Capa oscura (Overlay) para que el texto sea legible */}
      <Box
        sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4))',
          zIndex: 1
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Stack spacing={3} sx={{ maxWidth: 700 }}>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ p: 1.5, bgcolor: 'primary.main', borderRadius: 2, display: 'flex' }}>
                <RestaurantIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 900, letterSpacing: 2 }}>
                SISTEMA PROFESIONAL
            </Typography>
          </Stack>

          <Typography variant="h1" sx={{ 
            color: 'white', 
            fontWeight: 900, 
            fontSize: { xs: '3rem', md: '5rem' },
            lineHeight: 1.1,
            textShadow: '0 5px 15px rgba(0,0,0,0.5)'
          }}>
            Gestión <br />
            <span style={{ color: '#1976d2' }}>Gastronómica</span>
          </Typography>

          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, maxWidth: 500 }}>
            Optimiza tu restaurante con RestaurantPro. Control total de pedidos, mesas y reportes en un solo lugar.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button 
              component={Link} 
              to="/pedidos" 
              variant="contained" 
              size="large"
              sx={{ 
                px: 6, py: 2, 
                borderRadius: 3, 
                fontWeight: 800, 
                fontSize: '1.1rem',
                textTransform: 'none' 
              }}
            >
              Comenzar ahora
            </Button>
            
            <Button 
              component={Link} 
              to="/reporte" 
              variant="outlined" 
              size="large"
              sx={{ 
                px: 4, py: 2, 
                borderRadius: 3, 
                fontWeight: 800, 
                color: 'white', 
                borderColor: 'white',
                textTransform: 'none',
                '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
              }}
            >
              Ver Reportes
            </Button>
          </Stack>

        </Stack>
      </Container>
    </Box>
  );
};

export default Home;