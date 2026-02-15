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
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

// Servicios y validaciones adaptados a Categorías
import { getCategoriaById, updateCategoria } from '../../services/categoriaService';
import { categoriaZodSchema } from '../../schemas/categoria';
import ErrorMessage from '../../components/ErrorMessage';

const EditCategoriaPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    
    // Adaptado a la lógica de tu controlador de Categoría
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    useEffect(() => {
        const fetchCategoria = async () => {
            try {
                const response = await getCategoriaById(id);
                setFormData({
                    nombre: response.data.nombre || '',
                    descripcion: response.data.descripcion || ''
                });
            } catch (error) {
                console.error('Error fetching categoria:', error);
                setErrors([{ campo: 'SERVER', mensaje: 'No se pudo cargar la información de la categoría.' }]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoria();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); 

        try {
            const resultado = categoriaZodSchema.safeParse(formData);
            
            if (!resultado.success) {
                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0],
                    mensaje: issue.message
                }));
                setErrors(listaErrores);
            } else {
                await updateCategoria(id, formData);
                navigate('/categorias');
            }
        } catch (error) {
            let serverMessage = "";
            if (error.response) {
                // Maneja tanto el array de 'errores' como el 'msg' de duplicados
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
                    Editar Categoría
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nombre de la Categoría"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                variant="outlined"
                                required
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
                                rows={4}
                                placeholder="Escribe una breve descripción de la categoría..."
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
                                    Actualizar Categoría
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    fullWidth
                                    size="large"
                                    onClick={() => navigate('/categorias')}
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

export default EditCategoriaPage;