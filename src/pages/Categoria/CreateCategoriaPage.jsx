import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Grid, Divider, Stack } from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import { createCategoria } from '../../services/categoriaService';
import { categoriaZodSchema } from '../../schemas/categoria';
import ErrorMessage from '../../components/ErrorMessage';

const CreateCategoriaPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); 
        
        // 1. Validación de Frontend con Zod
        const resultado = categoriaZodSchema.safeParse(formData);
        
        if (!resultado.success) {
            const listaErrores = resultado.error.issues.map(issue => ({
                campo: issue.path[0], 
                mensaje: issue.message
            }));
            return setErrors(listaErrores);
        }

        try {
            // 2. Envío a la API
            await createCategoria(formData);
            navigate('/categoria');
        } catch (error) {
            // 3. Manejo de errores del Servidor (Mongoose/Express)
            const serverErrors = error.response?.data?.errores;
            const serverMsg = serverErrors ? serverErrors.join(', ') : error.message;
            setErrors([{ campo: 'SERVER', mensaje: serverMsg }]);
        }
    };

    // Función auxiliar para obtener el mensaje de error de un campo específico
    const getFieldError = (fieldName) => errors.find(err => err.campo === fieldName)?.mensaje;

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Nueva Categoría
                </Typography>
                <Divider sx={{ mb: 4 }} />
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth 
                                label="Nombre de Categoría"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                error={!!getFieldError('nombre')}
                                helperText={getFieldError('nombre')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth 
                                label="Descripción" 
                                multiline 
                                rows={3}
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                error={!!getFieldError('descripcion')}
                                helperText={getFieldError('descripcion')}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    startIcon={<ArrowBackIcon />} 
                                    onClick={() => navigate('/categoria')}
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
                                    Crear Categoría
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>

                {/* Muestra errores generales o de servidor que no pertenecen a un input */}
                {errors.some(err => err.campo === 'SERVER') && (
                    <Box sx={{ mt: 3 }}>
                        <ErrorMessage errors={errors.filter(err => err.campo === 'SERVER')} />
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default CreateCategoriaPage;