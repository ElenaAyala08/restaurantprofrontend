import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Paper, Typography, TextField, Button, 
    Box, Grid, Stack, MenuItem, Snackbar, Alert, CircularProgress 
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

// Servicios y validación
import { createReporte } from '../../services/reporteService';
import { getAuthUsuario } from '../../utils/auth';
import { reporteZodSchema } from '../../schemas/reporte';

const CreateReportePage = () => {
    const navigate = useNavigate();
    const usuario = getAuthUsuario();
    
    const [loading, setLoading] = useState(false);
    const [rango, setRango] = useState('hoy');
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar con Zod antes de enviar
        const validacion = reporteZodSchema.safeParse({ rango });
        if (!validacion.success) {
            setNotification({
                open: true,
                message: validacion.error.issues[0].message,
                severity: 'error'
            });
            return;
        }

        setLoading(true);
        try {
            // Estructura que espera tu reporteSchema de Mongoose
            const reporteData = {
                tipoReporte: rango,
                generadoPor: usuario?.id, // ID del administrador logueado
                resumen: {
                    ingresosTotales: 0, // El backend suele calcular esto, pero enviamos base
                    facturasPagadas: 0,
                    ticketPromedio: 0,
                    pedidosTotales: 0
                }
            };

            await createReporte(reporteData);

            setNotification({
                open: true,
                message: 'Reporte generado y guardado con éxito',
                severity: 'success'
            });

            // Redirigir a la lista de reportes tras un breve delay
            setTimeout(() => navigate('/reportes'), 1500);

        } catch (error) {
            setNotification({
                open: true,
                message: error.response?.data?.error || 'Error al generar el reporte',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={() => navigate('/reportes')}
                        sx={{ color: 'text.secondary' }}
                    >
                        Volver
                    </Button>
                </Stack>

                <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Generar Nuevo Reporte
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Seleccione el periodo contable para procesar las ventas.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Periodo del Reporte"
                                value={rango}
                                onChange={(e) => setRango(e.target.value)}
                                disabled={loading}
                                helperText="Este proceso consolidará las facturas pagadas en el rango seleccionado."
                            >
                                <MenuItem value="hoy">Ventas de Hoy</MenuItem>
                                <MenuItem value="semana">Últimos 7 días</MenuItem>
                                <MenuItem value="mes">Últimos 30 días</MenuItem>
                                <MenuItem value="todo">Histórico Completo</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                disabled={loading}
                                sx={{ py: 1.5, fontWeight: 'bold' }}
                            >
                                {loading ? 'Procesando...' : 'Confirmar y Guardar'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CreateReportePage;