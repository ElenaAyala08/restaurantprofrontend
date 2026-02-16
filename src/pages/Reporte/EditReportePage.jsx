import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, TextField, Button, Typography, Container, Paper, 
  Grid, Stack, Divider, CircularProgress, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

import { getReporteById, updateReporte } from '../../services/reporteService';
import { reporteZodSchema } from '../../schemas/reporte';
import ErrorMessage from '../../components/ErrorMessage';

const EditReportePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    
    const [formData, setFormData] = useState({
        rango: '' // Usamos rango para validar con Zod antes de enviar
    });

    useEffect(() => {
        const fetchReporte = async () => {
            try {
                const response = await getReporteById(id);
                // Mapeamos tipoReporte del backend al campo rango del formulario
                setFormData({
                    rango: response.data.tipoReporte || 'hoy'
                });
            } catch (error) {
                setErrors([{ campo: 'SERVER', mensaje: 'No se pudo cargar el reporte.' }]);
            } finally {
                setLoading(false);
            }
        };
        fetchReporte();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ rango: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const resultado = reporteZodSchema.safeParse(formData);
        
        if (!resultado.success) {
            const listaErrores = resultado.error.issues.map(issue => ({
                campo: issue.path[0],
                mensaje: issue.message
            }));
            return setErrors(listaErrores);
        }

        try {
            // Enviamos tipoReporte para que coincida con el modelo de Mongoose
            await updateReporte(id, { tipoReporte: formData.rango });
            navigate('/reportes');
        } catch (error) {
            setErrors([{ campo: 'SERVER', mensaje: error.response?.data?.error || 'Error al actualizar' }]);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
              Actualizar Configuración de Reporte
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Rango de Tiempo"
                    value={formData.rango}
                    onChange={handleChange}
                    variant="outlined"
                  >
                    <MenuItem value="hoy">Hoy</MenuItem>
                    <MenuItem value="semana">Semana</MenuItem>
                    <MenuItem value="mes">Mes</MenuItem>
                    <MenuItem value="todo">Todo</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      startIcon={<EditIcon />}
                    >
                      Actualizar
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/reportes')}
                      startIcon={<CancelIcon />}
                    >
                      Cancelar
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            {errors.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <ErrorMessage errors={errors} />
              </Box>
            )}
          </Paper>
        </Container>
    );
}

export default EditReportePage;