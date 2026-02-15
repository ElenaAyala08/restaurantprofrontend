import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Grid, Divider, Stack } from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import { createPedido } from '../../services/pedidoService';
import { pedidoZodSchema } from '../../schemas/pedido';
import ErrorMessage from '../../components/ErrorMessage';

const CreatePedidoPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        mesa: '',
        items: [] // Aquí podrías inicializar con un item vacío si deseas
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); 
        try {
            const resultado = pedidoZodSchema.safeParse(formData);
            if (!resultado.success) {
                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0], mensaje: issue.message
                }));
                setErrors(listaErrores);
            } else {
                await createPedido(formData);
                navigate('/pedidos');
            }
        } catch (error) {
            setErrors([{ campo: 'SERVER', mensaje: error.response?.data?.error || error.message }]);
        }
    };

    const hasError = (fieldName) => errors.some(err => err.campo === fieldName);

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Abrir Nuevo Pedido
                </Typography>
                <Divider sx={{ mb: 4 }} />
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="ID de la Mesa" variant="outlined"
                                value={formData.mesa}
                                onChange={(e) => setFormData({ ...formData, mesa: e.target.value })}
                                error={hasError('mesa')} required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <Button variant="outlined" fullWidth startIcon={<ArrowBackIcon />} onClick={() => navigate('/pedidos')}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained" fullWidth startIcon={<SaveIcon />} color="primary">
                                    Crear Pedido
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

export default CreatePedidoPage;