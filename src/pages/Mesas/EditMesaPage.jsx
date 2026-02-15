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
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

// Servicios y validaciones adaptados a Mesas
import { getMesaById, updateMesa } from '../../services/mesaService';
import { mesaZodSchema } from '../../schemas/mesa';
import ErrorMessage from '../../components/ErrorMessage';

const EditMesaPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    
    // Adaptado a la lógica de tu controlador de Mesas
    const [formData, setFormData] = useState({
        numero: '',
        capacidad: '',
        estado: 'disponible'
    });

    useEffect(() => {
        const fetchMesa = async () => {
            try {
                const response = await getMesaById(id);
                // Extraemos los campos exactos del modelo Mesa
                setFormData({
                    numero: response.data.numero || '',
                    capacidad: response.data.capacidad || '',
                    estado: response.data.estado || 'disponible'
                });
            } catch (error) {
                console.error('Error fetching mesa:', error);
                setErrors([{ campo: 'SERVER', mensaje: 'No se pudo cargar la información de la mesa.' }]);
            } finally {
                setLoading(false);
            }
        };
        fetchMesa();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); 

        try {
            const resultado = mesaZodSchema.safeParse(formData);
            
            if (!resultado.success) {
                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0],
                    mensaje: issue.message
                }));
                setErrors(listaErrores);
            } else {
                await updateMesa(id, formData);
                navigate('/mesas');
            }
        } catch (error) {
            let serverMessage = "";
            if (error.response) {
                // Manejo de errores específicos del backend (duplicados o validación)
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
                    Editar Mesa
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Número de Mesa"
                                name="numero"
                                type="number"
                                value={formData.numero}
                                onChange={handleChange}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Capacidad (Personas)"
                                name="capacidad"
                                type="number"
                                value={formData.capacidad}
                                onChange={handleChange}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Estado de la Mesa"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                variant="outlined"
                                required
                            >
                                <MenuItem value="disponible">Disponible</MenuItem>
                                <MenuItem value="ocupada">Ocupada</MenuItem>
                                <MenuItem value="reservada">Reservada</MenuItem>
                            </TextField>
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
                                    Actualizar Mesa
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    fullWidth
                                    size="large"
                                    onClick={() => navigate('/mesas')}
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

export default EditMesaPage;