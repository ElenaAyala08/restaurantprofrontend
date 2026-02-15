import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Grid, Button,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress,
    Snackbar, Alert, Box, TextField, MenuItem
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { getMenus } from '../../services/menuService';
import { getAuthUsuario } from '../../utils/auth';

const MenuPage = () => {

    const usuario = getAuthUsuario();

    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([]);
    const [filtros, setFiltros] = useState({
        categoria: '',
        disponible: ''
    });

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchMenu = async () => {
        try {
            setLoading(true);

            const filtrosActivos = {};
            if (filtros.categoria) filtrosActivos.categoria = filtros.categoria;
            if (filtros.disponible !== '') filtrosActivos.disponible = filtros.disponible;

            const response = await getMenu(filtrosActivos);
            setMenuItems(response.data);

        } catch (error) {
            setNotification({
                open: true,
                message: 'Error al cargar el menú',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gestión del Menú
            </Typography>

            {/* FILTROS */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">

                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Categoría"
                            value={filtros.categoria}
                            onChange={(e) =>
                                setFiltros({ ...filtros, categoria: e.target.value })
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Disponible"
                            value={filtros.disponible}
                            onChange={(e) =>
                                setFiltros({ ...filtros, disponible: e.target.value })
                            }
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="true">Disponible</MenuItem>
                            <MenuItem value="false">No Disponible</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<SearchIcon />}
                            onClick={fetchMenu}
                            fullWidth
                        >
                            Buscar
                        </Button>
                    </Grid>

                </Grid>
            </Paper>

            {loading ? (
                <Box textAlign="center">
                    <CircularProgress />
                </Box>
            ) : (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Lista del Menú
                    </Typography>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Categoría</TableCell>
                                    <TableCell>Precio</TableCell>
                                    <TableCell>Disponible</TableCell>
                                    <TableCell>Descripción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {menuItems.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{item.nombre}</TableCell>
                                        <TableCell>{item.categoria}</TableCell>
                                        <TableCell>${item.precio}</TableCell>
                                        <TableCell>
                                            {item.disponible ? 'Sí' : 'No'}
                                        </TableCell>
                                        <TableCell>
                                            {item.descripcion || '-'}
                                        </TableCell>
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

export default MenuPage;
