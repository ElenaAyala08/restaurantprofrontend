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

// Servicios y validaciones (Adaptados a Reportes)
import { getReporteById, updateReporte } from '../../services/reporteService';
import { reporteZodSchema } from '../../schemas/reporte';
import ErrorMessage from '../../components/ErrorMessage';

const EditReportePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    
    
    const [formData, setFormData] = useState({
        rango: '',
        descripcion: '',
        estado: ''
    });

    useEffect(() => {
        const fetchReporte = async () => {
            try {
                const response = await getReporteById(id);
                setFormData({
                    rango: response.data.rango || 'hoy',
                    descripcion: response.data.descripcion || '',
                    estado: response.data.estado || 'pendiente'
                });
            } catch (error) {
                console.error('Error fetching reporte:', error);
                setErrors([{ campo: 'SERVER', mensaje: 'No se pudo cargar la información del reporte.' }]);
            } finally {
                setLoading(false);
            }
        };
        fetchReporte();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        try {
            const resultado = reporteZodSchema.safeParse(formData);
            
            if (!resultado.success) {
                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0],
                    mensaje: issue.message
                }));
                setErrors(listaErrores);
            } else {
                await updateReporte(id, formData);
                navigate('/reportes'); // O la ruta que uses
            }
        } catch (error) {
            let serverMessage = error.response?.data?.error || 'Error en el servidor';
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
                    Editar Reporte
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Rango de Tiempo"
                                name="rango"
                                value={formData.rango}
                                onChange={handleChange}
                                variant="outlined"
                                required
                            >
                                <MenuItem value="hoy">Hoy</MenuItem>
                                <MenuItem value="semana">Semana</MenuItem>
                                <MenuItem value="mes">Mes</MenuItem>
                                <MenuItem value="todo">Todo</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Estado del Reporte"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descripción / Notas"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                variant="outlined"
                                multiline
                                rows={4}
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
                                    Actualizar Reporte
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    fullWidth
                                    size="large"
                                    onClick={() => navigate('/reportes')}
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

export default EditReportePage;