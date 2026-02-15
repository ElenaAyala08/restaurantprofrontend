import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Avatar, 
  CircularProgress 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { loginUsuario } from '../../services/usuarioService';
import { loginSchema } from '../../schemas/usuario';
import ErrorMessage from '../../components/ErrorMessage';

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }, []);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      const resultado = loginSchema.safeParse(credentials);
      if (!resultado.success) {
        const listaErrores = resultado.error.issues.map(issue => ({
          campo: issue.path[0],
          mensaje: issue.message
        }));
        setErrors(listaErrores);
      } else {
        const response = await loginUsuario(credentials);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        navigate('/');
      }
    } catch (error) {
      let serverMessage = error.response?.data?.msg || 'Error de conexión';
      setErrors([{ campo: 'SERVER', mensaje: serverMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* ESTE BOX ES LA CLAVE: 
       Ocupa el alto del contenedor blanco del Layout y centra el contenido 
    */
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)', // Ajuste para quedar al centro visual
        width: '100%',
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 4 }, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px', // Evita que se estire demasiado
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
          <LockOutlinedIcon fontSize="large" />
        </Avatar>
        
        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
          Bienvenido
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Ingresa tus credenciales para acceder
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={credentials.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
            disabled={isLoading}
          />

          <Box sx={{ mt: 2 }}>
            <ErrorMessage errors={errors} />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ 
              mt: 4, 
              mb: 2, 
              py: 1.5, 
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none' 
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;