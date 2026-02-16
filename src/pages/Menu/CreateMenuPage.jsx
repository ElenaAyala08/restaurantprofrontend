import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  Stack,
  MenuItem
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

import { createMenu } from '../../services/menuService';
import { menuZodSchema } from '../../schemas/menu';
import ErrorMessage from '../../components/ErrorMessage';

const CreateMenuPage = () => {

  // 🔹 Categorías según tu enum del backend
  const categorias = [
    'Entradas',
    'Platos Fuertes',
    'Bebidas',
    'Postres'
  ];

  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      // Validación con transformación automática del precio
      const resultado = menuZodSchema.safeParse(formData);

      if (!resultado.success) {
        const listaErrores = resultado.error.issues.map(issue => ({
          campo: issue.path[0],
          mensaje: issue.message
        }));

        setErrors(listaErrores);
        return;
      }

      // Usamos los datos transformados por Zod
      await createMenu(resultado.data);

      navigate('/menu');

    } catch (error) {
      const serverMsg =
        error.response?.data?.errores
          ? error.response.data.errores.join(', ')
          : error.message;

      setErrors([{ campo: 'SERVER', mensaje: serverMsg }]);
    }
  };

  const hasError = (fieldName) =>
    errors.some(err => err.campo === fieldName);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>

        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', textAlign: 'center' }}
        >
          Nuevo Platillo
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            {/* Nombre */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Platillo"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                error={hasError('nombre')}
                required
              />
            </Grid>

            {/* Precio */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({ ...formData, precio: e.target.value })
                }
                error={hasError('precio')}
                required
              />
            </Grid>

            {/* Categoría (SELECT) */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Categoría"
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
                error={hasError('categoria')}
                required
              >
                <MenuItem value="">
                  Seleccione una categoría
                </MenuItem>

                {categorias.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Descripción */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={2}
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                error={hasError('descripcion')}
                required
              />
            </Grid>

            {/* Botones */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/menu')}
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
                  Añadir al Menú
                </Button>
              </Stack>
            </Grid>

          </Grid>
        </form>

        {/* Errores */}
        <Box sx={{ mt: 3 }}>
          <ErrorMessage errors={errors} />
        </Box>

      </Paper>
    </Container>
  );
};

export default CreateMenuPage;
