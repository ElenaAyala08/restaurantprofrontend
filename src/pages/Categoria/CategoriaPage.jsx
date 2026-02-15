import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Grid, Button,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress,
    Snackbar, Alert, Box, TextField
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import {
    getCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria
} from '../../services/categoriaService';

import { getAuthUsuario } from '../../utils/auth';

const CategoriasPage = () => {

    const usuario = getAuthUsuario();

    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [nombre, setNombre] = useState('');

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const response = await getCategorias();
            setCategorias(response.data);
        } catch (error) {
            setNotification({
                open: true,
                message: 'Error al cargar categorías',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCrear = async () => {
        try {
            await createCategoria({ nombre });

            setNotification({
                open: true,
                message: 'Categoría creada correctamente',
                severity: 'success'
            });

            setNombre('');
            fetchCategorias();

        } catch (error) {
            setNotification({
                open: true,
                message:
                    error.response?.data?.errores?.[0] ||
                    error.response?.data?.msg ||
                    'Error al crear categoría',
                severity: 'error'
            });
        }
    };

    const handleEliminar = async (id) => {
        try {
            await deleteCategoria(id);

            setNotification({
                open: true,
                message: 'Categoría eliminada correctamente',
                severity: 'success'
            });

            fetchCategorias();

        } catch (error) {
            setNotification({
                open: true,
                message: 'Error al eliminar categoría',
                severity: 'error'
            });
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gestión de Categorías
            </Typography>

            {/* CREAR CATEGORÍA */}
            {usuario?.rol === 'Administrador' && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Nueva Categoría
                    </Typography>

                    <Grid container spacing={2} alignItems="center">

                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleCrear}
                                fullWidth
                            >
                                Crear
                            </Button>
                        </Grid>

                    </Grid>
                </Paper>
            )}

            {/* LISTADO */}
            {loading ? (
                <Box textAlign="center">
                    <CircularProgress />
                </Box>
            ) : (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Lista de Categorías
                    </Typography>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    {usuario?.rol === 'Administrador' && (
                                        <TableCell align="center">Acciones</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categorias.map((cat) => (
                                    <TableRow key={cat._id}>
                                        <TableCell>{cat.nombre}</TableCell>

                                        {usuario?.rol === 'Administrador' && (
                                            <TableCell align="center">
                                                <Button
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => handleEliminar(cat._id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>

        </Container>
    );
};

export default CategoriasPage;
