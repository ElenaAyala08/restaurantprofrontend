import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Box, CircularProgress, Grid, MenuItem,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Snackbar, Alert, Stack
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Search as SearchIcon,
    Add as AddIcon
} from '@mui/icons-material';

// Importación de tus servicios reales
import { getMenus, deleteMenu } from '../../services/menuService';
import { getAuthUsuario } from '../../utils/auth';

const MenuPage = () => {
    const usuario = getAuthUsuario();
    const navigate = useNavigate();

    // Estados
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({ categoria: '', disponible: '' });

    // Estados de UI
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMenuId, setSelectedMenuId] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    // Lógica de permisos según tus roles
    const hasPermission = usuario?.rol === 'Administrador' || usuario?.rol === 'Mesero';

    const fetchMenu = async () => {
        try {
            setLoading(true);
            // getMenu ya maneja la limpieza de filtros según tu código de service
            const response = await getMenus(filtros);
            setMenuItems(response.data);
        } catch (error) {
            handleNotification('Error al cargar el menú', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const handleOpenDelete = (id) => {
        setSelectedMenuId(id);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteMenu(selectedMenuId);
            handleNotification('Platillo eliminado correctamente');
            fetchMenu(); // Recargar tabla
        } catch (error) {
            handleNotification('No se pudo eliminar el platillo', 'error');
        } finally {
            setOpenDialog(false);
            setSelectedMenuId(null);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Gestión del Menú
                </Typography>
                {hasPermission && (
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/menu/create')}
                    >
                        Nuevo Platillo
                    </Button>
                )}
            </Stack>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                {/* BUSCADOR (Estructura estética 1) */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Filtrar por Categoría"
                            variant="outlined"
                            size="small"
                            value={filtros.categoria}
                            onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                        >
                            <MenuItem value="">Todas</MenuItem>
                            <MenuItem value="Entradas">Entradas</MenuItem>
                            <MenuItem value="Platos Fuertes">Platos Fuertes</MenuItem>
                            <MenuItem value="Bebidas">Bebidas</MenuItem>
                            <MenuItem value="Postres">Postres</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Estado"
                            variant="outlined"
                            size="small"
                            value={filtros.disponible}
                            onChange={(e) => setFiltros({ ...filtros, disponible: e.target.value })}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="true">Disponible</MenuItem>
                            <MenuItem value="false">No Disponible</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon />}
                            onClick={fetchMenu}
                        >
                            Buscar
                        </Button>
                    </Grid>
                </Grid>

                {/* TABLA DE RESULTADOS */}
                {loading ? (
                    <Box textAlign="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table sx={{ minWidth: 700 }}>
                            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                                <TableRow>
                                    <TableCell><strong>Platillo</strong></TableCell>
                                    <TableCell><strong>Categoría</strong></TableCell>
                                    <TableCell><strong>Precio</strong></TableCell>
                                    <TableCell><strong>Estado</strong></TableCell>
                                    <TableCell><strong>Descripción</strong></TableCell>
                                    {hasPermission && <TableCell align="center"><strong>Acciones</strong></TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {menuItems.length > 0 ? (
                                    menuItems.map((item) => (
                                        <TableRow key={item._id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{item.nombre}</TableCell>
                                            <TableCell>{item.categoria}</TableCell>
                                            <TableCell>${item.precio.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        px: 1, py: 0.5, borderRadius: 1,
                                                        backgroundColor: item.disponible ? '#e8f5e9' : '#ffebee',
                                                        color: item.disponible ? '#2e7d32' : '#d32f2f'
                                                    }}
                                                >
                                                    {item.disponible ? 'Disponible' : 'Agotado'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{item.descripcion || '-'}</TableCell>
                                            {hasPermission && (
                                                <TableCell align="center">
                                                    <Stack direction="row" spacing={1} justifyContent="center">
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => navigate(`/menu/edit/${item._id}`)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleOpenDelete(item._id)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Stack>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                            No se encontraron elementos en el menú.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* CONFIRMACIÓN DE ELIMINAR */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>¿Eliminar platillo?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Esta acción quitará el platillo del menú de forma permanente.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Confirmar Eliminación
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ALERTAS */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setNotification({ ...notification, open: false })}
                    severity={notification.severity}
                    variant="filled"
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default MenuPage;