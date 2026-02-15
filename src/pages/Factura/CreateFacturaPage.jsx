import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Paper, Typography, TextField, Button, 
    Box, Grid, Divider, Stack, MenuItem 
} from '@mui/material';
import { Receipt as ReceiptIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import { createFactura } from '../../services/facturaService';
import { facturaZodSchema } from '../../schemas/factura';
import ErrorMessage from '../../components/ErrorMessage';

const CreateFacturaPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        pedidoId: '',
        metodoPago: 'Efectivo'
    });

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
                await createFactura(formData);
                navigate('/facturas');
            }

        } catch (error) {
            const serverMsg = error.response?.data?.errores 
                ? error.response.data.errores.join(', ') 
                : error.response?.data?.msg || error.message;
            setErrors([{ campo: 'SERVER', mensaje: serverMsg }]);
        }
    };

    const hasError = (fieldName) => errors.some(err => err.campo === fieldName);

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Generar Factura
                </Typography>
                <Divider sx={{ mb: 4 }} />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="ID del Pedido"
                                variant="outlined"
                                value={formData.pedidoId}
                                onChange={(e) => setFormData({ ...formData, pedidoId: e.target.value })}
                                error={hasError('pedidoId')}
                                helperText="Ingrese el ID del pedido a facturar"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Método de Pago"
                                value={formData.metodoPago}
                                onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
                                error={hasError('metodoPago')}
                                required
                            >
                                <MenuItem value="Efectivo">Efectivo</MenuItem>
                                <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                                <MenuItem value="Transferencia">Transferencia</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Stack direction="row" spacing={2}>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => navigate('/facturas')}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    fullWidth 
                                    startIcon={<ReceiptIcon />}
                                    color="success"
                                >
                                    Finalizar y Pagar
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
                <Box sx={{ mt: 3 }}>
                    <ErrorMessage errors={errors} />
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateFacturaPage;