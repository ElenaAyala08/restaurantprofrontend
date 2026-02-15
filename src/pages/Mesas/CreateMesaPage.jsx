import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Grid, Divider, Stack, MenuItem } from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import { createMesa } from '../../services/mesaService';
import { mesaZodSchema } from '../../schemas/mesa';
import ErrorMessage from '../../components/ErrorMessage';

const CreateMesaPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        numero: '',
        capacidad: '',
        estado: 'disponible'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); 
        try {
            const resultado = mesaZodSchema.safeParse(formData);
            if (!resultado.success) {
                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0], mensaje: issue.message
                }));
                setErrors(listaErrores);
            } else {
                await createMesa(formData);
                navigate('/mesas');
            }
        } catch (error) {
            const serverMsg = error.response?.data?.errores ? error.response.data.errores.join(', ') : error.message;
            setErrors([{ campo: 'SERVER', mensaje: serverMsg }]);
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
                                fullWidth label="Número de Mesa" type="number"
                                value={formData.numero}
                                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                error={hasError('numero')} required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth label="Capacidad" type="number"
                                value={formData.capacidad}
                                onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                                error={hasError('capacidad')} required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth select label="Estado Inicial"
                                value={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                            >
                                <MenuItem value="disponible">Disponible</MenuItem>
                                <MenuItem value="reservada">Reservada</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <Button variant="outlined" fullWidth startIcon={<ArrowBackIcon />} onClick={() => navigate('/mesas')}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained" fullWidth startIcon={<SaveIcon />} color="primary">
                                    Guardar Mesa
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
                <Box sx={{ mt: 3 }}><ErrorMessage errors={errors} /></Box>
            </Paper>
        </Container>
    );
};

export default CreateMesaPage;