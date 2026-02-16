import { Outlet, Link, useLocation } from 'react-router-dom';
import { getAuthUsuario, isAuthenticated } from '../utils/auth';
import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container, Stack, Divider } from '@mui/material';
import { Restaurant as RestaurantIcon, Logout as LogoutIcon, Login as LoginIcon } from '@mui/icons-material';

const Layout = () => {
  const [usuario, setUsuario] = useState(getAuthUsuario());
  const [auth, setAuth] = useState(isAuthenticated());
  const location = useLocation();

  useEffect(() => {
    setUsuario(getAuthUsuario());
    setAuth(isAuthenticated());
  }, [location]);

  const links = [
    { to: "/menu", label: "Menú", roles: ['Administrador', 'Cocinero', 'Mesero'] },
    { to: "/pedidos", label: "Pedidos", roles: ['Administrador', 'Cocinero', 'Mesero'] },
    { to: "/mesas", label: "Mesas", roles: ['Administrador', 'Mesero'] },
    { to: "/factura", label: "Facturación", roles: ['Administrador', 'Mesero'] },
    { to: "/usuario", label: "Usuarios", roles: ['Administrador'] },
    { to: "/categoria", label: "Categorías", roles: ['Administrador'] },
    { to: "/reporte", label: "Reportes", roles: ['Administrador'] },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(18,18,18,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #333' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1} alignItems="center" component={Link} to="/" sx={{ textDecoration: 'none', color: 'white' }}>
              <RestaurantIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 900 }}>Restaurant<span style={{color:'#1976d2'}}>Pro</span></Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              {auth && usuario?.rol && links.filter(l => l.roles.includes(usuario.rol)).map((link) => (
                <Button key={link.to} component={Link} to={link.to} size="small" 
                  sx={{ color: location.pathname === link.to ? '#1976d2' : '#aaa', fontWeight: 700, textTransform: 'none' }}>
                  {link.label}
                </Button>
              ))}
              <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: '#444' }} />
              <Button component={Link} to="/usuario/login" variant="outlined" size="small" startIcon={auth ? <LogoutIcon /> : <LoginIcon />} color={auth ? "error" : "primary"}>
                {auth ? 'Salir' : 'Entrar'}
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet /> 
      </Box>

      <Box component="footer" sx={{ py: 3, textAlign: 'center', color: '#666', borderTop: '1px solid #222' }}>
        <Typography variant="caption">&copy; 2026 RestaurantPro - Gestión Gastronómica</Typography>
      </Box>
    </Box>
  );
};

export default Layout;