import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos el hook de navegación
import {
    Container, Typography, Paper, Button,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress,
    Snackbar, Alert, Box, Stack
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

import { getCategorias, deleteCategoria } from '../../services/categoriaService';
import { getAuthUsuario } from '../../utils/auth';

const CategoriasPage = () => {
    const navigate = useNavigate();
    const usuario = getAuthUsuario();

    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const response = await getCategorias({});
            setCategorias(response.data);
        } catch (error) {
            showNotification('Error al cargar categorías', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
        try {
            await deleteCategoria(id);
            showNotification('Categoría eliminada correctamente');
            fetchCategorias();
        } catch (error) {
            showNotification('Error al eliminar categoría', 'error');
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Gestión de Categorías
                </Typography>

                {/* BOTÓN CREAR: Ahora redirige a la otra página */}
                {usuario?.rol === 'Administrador' && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/categoria/create')} 
                    >
                        Nueva Categoría
                    </Button>
                )}
            </Stack>

            {loading ? (
                <Box textAlign="center" sx={{ mt: 5 }}><CircularProgress /></Box>
            ) : (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell><strong>Nombre</strong></TableCell>
                                    <TableCell><strong>Descripción</strong></TableCell>
                                    {usuario?.rol === 'Administrador' && (
                                        <TableCell align="center"><strong>Acciones</strong></TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categorias.map((cat) => (
                                    <TableRow key={cat._id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{cat.nombre}</TableCell>
                                        <TableCell>{cat.descripcion}</TableCell>
                                        
                                        {usuario?.rol === 'Administrador' && (
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    {/* BOTÓN EDITAR */}
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => navigate(`/categoria/edit/${cat._id}`)}
                                                    >
                                                        Editar
                                                    </Button>

                                                    {/* BOTÓN ELIMINAR */}
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => handleEliminar(cat._id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                                {categorias.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                            No hay categorías registradas.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

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

export default CategoriasPage;