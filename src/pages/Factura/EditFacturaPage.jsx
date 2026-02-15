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

// Servicios y validaciones adaptados a Facturas
import { getFacturaById, updateFactura } from '../../services/facturaService';
import { facturaZodSchema } from '../../schemas/factura';
import ErrorMessage from '../../components/ErrorMessage';

const EditFacturaPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    
    const [formData, setFormData] = useState({
        numeroFactura: '',
        metodoPago: '',
        subtotal: 0,
        impuesto: 0,
        total: 0
    });

    useEffect(() => {
        const fetchFactura = async () => {
            try {
                const response = await getFacturaById(id);
                const data = response.data;
                setFormData({
                    numeroFactura: data.numeroFactura || '',
                    metodoPago: data.metodoPago || '',
                    subtotal: data.subtotal || 0,
                    impuesto: data.impuesto || 0,
                    total: data.total || 0
                });
            } catch (error) {
                console.error('Error fetching factura:', error);
                setErrors([{ campo: 'SERVER', mensaje: 'No se pudo cargar la información de la factura.' }]);
            } finally {
                setLoading(false);
            }
        };
        fetchFactura();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); 

        try {
            const resultado = facturaZodSchema.safeParse(formData);
            
            if (!resultado.success) {
                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0],
                    mensaje: issue.message
                }));
                setErrors(listaErrores);
            } else {
                await updateFactura(id, formData);
                navigate('/facturas');
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
                    Editar Factura
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Número de Factura"
                                name="numeroFactura"
                                value={formData.numeroFactura}
                                variant="outlined"
                                disabled // El número correlativo usualmente no se edita
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Método de Pago"
                                name="metodoPago"
                                value={formData.metodoPago}
                                onChange={handleChange}
                                variant="outlined"
                                required
                            >
                                <MenuItem value="Efectivo">Efectivo</MenuItem>
                                <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                                <MenuItem value="Transferencia">Transferencia</MenuItem>
                            </TextField>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Subtotal"
                                name="subtotal"
                                type="number"
                                value={formData.subtotal}
                                variant="outlined"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Impuesto"
                                name="impuesto"
                                type="number"
                                value={formData.impuesto}
                                variant="outlined"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Total Pagado"
                                name="total"
                                type="number"
                                value={formData.total}
                                variant="outlined"
                                sx={{ bgcolor: '#f9f9f9' }}
                                disabled
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
                                    Actualizar Factura
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    fullWidth
                                    size="large"
                                    onClick={() => navigate('/facturas')}
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

export default EditFacturaPage;