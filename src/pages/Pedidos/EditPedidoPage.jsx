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

// Servicios y validaciones adaptados a Pedidos
import { getPedidoById, updatePedido } from '../../services/pedidoService';
import { pedidoZodSchema } from '../../schemas/pedido'; // Asegúrate de que exista este esquema
import ErrorMessage from '../../components/ErrorMessage';

const EditPedidoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    
    // Adaptado a la lógica de negocio de Pedidos
    const [formData, setFormData] = useState({
        mesa: '',
        subtotal: 0,
        impuesto: 0,
        total: 0,
        estado: ''
    });

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const response = await getPedidoById(id);
                // Extraemos la información del pedido
                // Usamos ._id si el backend devuelve el objeto mesa poblado
                setFormData({
                    mesa: response.data.mesa?._id || response.data.mesa || '',
                    subtotal: response.data.subtotal || 0,
                    impuesto: response.data.impuesto || 0,
                    total: response.data.total || 0,
                    estado: response.data.estado || ''
                });
            } catch (error) {
                console.error('Error fetching pedido:', error);
                setErrors([{ campo: 'SERVER', mensaje: 'No se pudo cargar la información del pedido.' }]);
            } finally {
                setLoading(false);
            }
        };
        fetchPedido();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); 

        try {
            const resultado = pedidoZodSchema.safeParse(formData);
            
            if (!resultado.success) {
                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0],
                    mensaje: issue.message
                }));
                setErrors(listaErrores);
            } else {
                await updatePedido(id, formData);
                navigate('/pedidos'); // Redirección a la lista de pedidos
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
                    Editar Pedido
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="ID de Mesa"
                                name="mesa"
                                value={formData.mesa}
                                onChange={handleChange}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Estado del Pedido"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Subtotal"
                                name="subtotal"
                                type="number"
                                value={formData.subtotal}
                                onChange={handleChange}
                                variant="outlined"
                                disabled // Los totales suelen ser calculados, pero se muestran
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Impuesto (13%)"
                                name="impuesto"
                                type="number"
                                value={formData.impuesto}
                                onChange={handleChange}
                                variant="outlined"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Total"
                                name="total"
                                type="number"
                                value={formData.total}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{ bgcolor: '#f5f5f5' }}
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
                                    Actualizar Pedido
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    fullWidth
                                    size="large"
                                    onClick={() => navigate('/pedidos')}
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

export default EditPedidoPage;