import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Stack, 
  Divider,
  CircularProgress,
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

// Servicios y validaciones adaptados a Menu
import { getMenuById, updateMenu } from '../../services/menuService';
import { menuZodSchema } from '../../schemas/menu';
import ErrorMessage from '../../components/ErrorMessage';

const EditMenuPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        disponible: true
    });

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await getMenuById(id);
                setFormData({
                    nombre: response.data.nombre || '',
                    descripcion: response.data.descripcion || '',
                    precio: response.data.precio || '',
                    categoria: response.data.categoria || '',
                    disponible: response.data.disponible ?? true
                });
            } catch (error) {
                console.error('Error fetching menu item:', error);
                setErrors([{ campo: 'SERVER', mensaje: 'No se pudo cargar la información del platillo.' }]);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); 

        try {
            const resultado = menuZodSchema.safeParse(formData);
            
            if (!resultado.success) {
                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0],
                    mensaje: issue.message
                }));
                setErrors(listaErrores);
            } else {
                await updateMenu(id, formData);
                navigate('/menu');
            }
        } catch (error) {
            let serverMessage = "";
            if (error.response) {
                serverMessage = error.response.data.errores 
                    ? error.response.data.errores.join(', ') 
                    : error.response.data.msg || 'Error en el servidor';
            } else {
                serverMessage = error.message;
            }
            setErrors([{ campo: 'SERVER', mensaje: serverMessage }]);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
                    Editar Item del Menú
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                label="Nombre del Platillo"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Precio"
                                name="precio"
                                type="number"
                                value={formData.precio}
                                onChange={handleChange}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Categoría"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="Ej: Bebidas, Entradas, Fuertes"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={formData.disponible} 
                                        onChange={handleChange} 
                                        name="disponible" 
                                        color="primary"
                                    />
                                }
                                label="Disponible para la venta"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descripción"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                variant="outlined"
                                multiline
                                rows={3}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    startIcon={<EditIcon />}
                                >
                                    Guardar Cambios
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    fullWidth
                                    size="large"
                                    onClick={() => navigate('/menu')}
                                    startIcon={<CancelIcon />}
                                >
                                    Cancelar
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>

                {errors.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Divider sx={{ mb: 2 }} />
                        <ErrorMessage errors={errors} />
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default EditMenuPage;