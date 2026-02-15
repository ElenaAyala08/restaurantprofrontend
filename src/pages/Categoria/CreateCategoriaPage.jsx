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
        try {
            const resultado = categoriaZodSchema.safeParse(formData);
            if (!resultado.success) {
                const listaErrores = resultado.error.issues.map(issue => ({
                    campo: issue.path[0], mensaje: issue.message
                }));
                setErrors(listaErrores);
            } else {
                await createCategoria(formData);
                navigate('/categorias');
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
                    Nueva Categoría
                </Typography>
                <Divider sx={{ mb: 4 }} />
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Nombre de Categoría"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                error={hasError('nombre')} required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Descripción" multiline rows={3}
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                error={hasError('descripcion')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <Button variant="outlined" fullWidth startIcon={<ArrowBackIcon />} onClick={() => navigate('/categorias')}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained" fullWidth startIcon={<SaveIcon />} color="primary">
                                    Crear Categoría
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

export default CreateCategoriaPage;