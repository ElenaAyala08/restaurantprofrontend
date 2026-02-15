import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Stack, 
  MenuItem, 
  Divider 
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CancelIcon from '@mui/icons-material/Cancel';

// Imports de lógica
import { createUsuario } from '../../services/usuarioService';
import { usuarioZodSchema } from '../../schemas/usuario';
import ErrorMessage from '../../components/ErrorMessage';

const CreateUsuarioPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        rol: 'Mesero',
        status: 'active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resultado = usuarioZodSchema.safeParse(formData);

            if (!resultado.success) {
                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0],
                    mensaje: issue.message
                }));
                setErrors(listaErrores);
            } else {
                await createUsuario(formData);
                navigate('/usuario');
            }
        } catch (error) {
            let serverMessage = "";
            if (error.response) {
                serverMessage = error.response.data.error || 'Error en el servidor';
            } else if (error.request) {
                serverMessage = 'No se pudo conectar con el servidor';
            } else {
                serverMessage = error.message;
            }
            setErrors([{ campo: 'SERVER', mensaje: serverMessage }]);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
                    Crear Nuevo Usuario
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        {/* Nombre y Apellido en la misma fila */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Correo Electrónico"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Teléfono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Contraseña"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Selectores con el componente TextField (select) */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Rol de Usuario"
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                            >
                                <MenuItem value="Administrador">Administrador</MenuItem>
                                <MenuItem value="Mesero">Mesero</MenuItem>
                                <MenuItem value="Cocinero">Cocinero</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Estado"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <MenuItem value="active">Activo</MenuItem>
                                <MenuItem value="inactive">Inactivo</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    startIcon={<PersonAddIcon />}
                                >
                                    Crear Usuario
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    fullWidth
                                    size="large"
                                    onClick={() => navigate('/usuario')}
                                    startIcon={<CancelIcon />}
                                >
                                    Cancelar
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>

                {/* Mantenemos tu componente de error original */}
                {errors.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Divider sx={{ mb: 2 }} />
                        <ErrorMessage errors={errors} />
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default CreateUsuarioPage;