import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Paper, Typography, TextField, Button, 
    Box, Grid, Divider, Stack, MenuItem, Snackbar, Alert 
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import { createMesa } from '../../services/mesaService';
import { mesaZodSchema } from '../../schemas/mesa';
import ErrorMessage from '../../components/ErrorMessage';

const CreateMesaPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    
    const [formData, setFormData] = useState({
        numero: '',
        capacidad: '',
        estado: 'disponible'
    });

    const handleNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); 

        // IMPORTANTE: Convertimos a número antes de validar con Zod y enviar al service
        // para que coincida con el Schema de Zod y el Schema de Mongoose
        const dataToValidate = {
            ...formData,
            numero: formData.numero === '' ? undefined : Number(formData.numero),
            capacidad: formData.capacidad === '' ? undefined : Number(formData.capacidad),
        };

        try {
            const resultado = mesaZodSchema.safeParse(dataToValidate);
            
            if (!resultado.success) {
                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0], 
                    mensaje: issue.message
                }));
                setErrors(listaErrores);
            } else {
                // Enviamos la data parseada (con números)
                await createMesa(dataToValidate);
                handleNotification('Mesa creada con éxito');
                // Pequeño delay para que se vea la notificación antes de navegar
                setTimeout(() => navigate('/mesas'), 1500);
            }
        } catch (error) {
            const serverMsg = error.response?.data?.errores 
                ? error.response.data.errores.join(', ') 
                : (error.response?.data?.msg || error.message);
            setErrors([{ campo: 'SERVER', mensaje: serverMsg }]);
            handleNotification('Error al guardar la mesa', 'error');
        }
    };

    const hasError = (fieldName) => errors.some(err => err.campo === fieldName);

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Registrar Mesa
                </Typography>
                <Divider sx={{ mb: 4 }} />
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth 
                                label="Número de Mesa" 
                                type="number"
                                value={formData.numero}
                                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                error={hasError('numero')} 
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth 
                                label="Capacidad" 
                                type="number"
                                value={formData.capacidad}
                                onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                                error={hasError('capacidad')} 
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth 
                                select 
                                label="Estado Inicial"
                                value={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                            >
                                <MenuItem value="disponible">Disponible</MenuItem>
                                <MenuItem value="reservada">Reservada</MenuItem>
                                {/* "ocupada" no suele ser un estado inicial manual, pero podrías agregarlo si quieres */}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    startIcon={<ArrowBackIcon />} 
                                    onClick={() => navigate('/mesas')}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    fullWidth 
                                    startIcon={<SaveIcon />} 
                                    color="primary"
                                >
                                    Guardar Mesa
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>

                <Box sx={{ mt: 3 }}>
                    <ErrorMessage errors={errors} />
                </Box>
            </Paper>

            {/* Snackbar para consistencia con MesasPage */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CreateMesaPage;