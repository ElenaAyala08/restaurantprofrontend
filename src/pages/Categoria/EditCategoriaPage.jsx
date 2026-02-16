import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, TextField, Button, Typography, Container, 
  Paper, Grid, Stack, Divider, CircularProgress 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

import { getCategoriaById, updateCategoria } from '../../services/categoriaService';
import { categoriaZodSchema } from '../../schemas/categoria';
import ErrorMessage from '../../components/ErrorMessage';

const EditCategoriaPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    useEffect(() => {
        const fetchCategoria = async () => {
            try {
                const response = await getCategoriaById(id);
                // El controlador devuelve directamente el objeto o { categoria: {...} }
                // Ajustamos para capturar los datos correctamente
                const data = response.data;
                setFormData({
                    nombre: data.nombre || '',
                    descripcion: data.descripcion || ''
                });
            } catch (error) {
                setErrors([{ campo: 'SERVER', mensaje: 'No se pudo cargar la información.' }]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoria();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiamos el error del campo cuando el usuario empieza a escribir
        if (errors.length > 0) {
            setErrors(errors.filter(err => err.campo !== name));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); 

        // 1. Validación de Frontend
        const resultado = categoriaZodSchema.safeParse(formData);
        
        if (!resultado.success) {
            const listaErrores = resultado.error.issues.map(issue => ({
                campo: issue.path[0],
                mensaje: issue.message
            }));
            return setErrors(listaErrores);
        }

        try {
            // 2. Envío a API
            await updateCategoria(id, formData);
            navigate('/categoria');
        } catch (error) {
            const serverMsg = error.response?.data?.errores 
                ? error.response.data.errores.join(', ') 
                : error.response?.data?.msg || error.message;
            
            setErrors([{ campo: 'SERVER', mensaje: serverMsg }]);
        }
    };

    // Función para obtener error específico de un campo
    const getFieldError = (fieldName) => errors.find(err => err.campo === fieldName)?.mensaje;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Editar Categoría
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    Modifica los detalles de la categoría seleccionada
                </Typography>
                
                <Divider sx={{ mb: 4 }} />

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nombre de la Categoría"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                error={!!getFieldError('nombre')}
                                helperText={getFieldError('nombre')}
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
                                multiline
                                rows={4}
                                error={!!getFieldError('descripcion')}
                                helperText={getFieldError('descripcion')}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    fullWidth
                                    size="large"
                                    onClick={() => navigate('/categoria')}
                                    startIcon={<CancelIcon />}
                                >
                                    Cancelar
                                </Button>
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
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>

                {/* Errores globales o de servidor */}
                {errors.some(err => err.campo === 'SERVER') && (
                    <Box sx={{ mt: 3 }}>
                        <ErrorMessage errors={errors.filter(err => err.campo === 'SERVER')} />
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default EditCategoriaPage;