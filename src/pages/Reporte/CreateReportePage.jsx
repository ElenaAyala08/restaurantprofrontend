import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Grid, Divider, Stack, MenuItem } from '@mui/material';
import { Assessment as AssessmentIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import { createReporte } from '../../services/reporteService'; // Asumiendo que existe
import ErrorMessage from '../../components/ErrorMessage';

const CreateReportePage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        rango: 'hoy',
        descripcion: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Aquí llamarías a tu servicio para guardar el reporte
            await createReporte(formData); 
            navigate('/reportes');
        } catch (error) {
            setErrors([{ campo: 'SERVER', mensaje: error.message }]);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Nuevo Reporte
                </Typography>
                <Divider sx={{ mb: 4 }} />
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth select label="Rango de Ventas"
                                value={formData.rango}
                                onChange={(e) => setFormData({ ...formData, rango: e.target.value })}
                            >
                                <MenuItem value="hoy">Ventas de Hoy</MenuItem>
                                <MenuItem value="semana">Últimos 7 días</MenuItem>
                                <MenuItem value="mes">Último Mes</MenuItem>
                                <MenuItem value="todo">Histórico Total</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Notas del Reporte" multiline rows={2}
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <Button variant="outlined" onClick={() => navigate('/reportes')}>Cancelar</Button>
                                <Button type="submit" variant="contained" startIcon={<AssessmentIcon />} fullWidth>
                                    Generar Reporte
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

export default CreateReportePage;