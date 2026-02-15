import React, { useEffect, useState } from 'react';
import { 
    Container, Typography, Paper, Grid, Button,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress,
    Snackbar, Alert, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Search as SearchIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

import { getPedidos } from '../../services/pedidoService';
// Importamos el servicio que trae los items específicos de un pedido
import { getDetallePedido } from '../../services/detallePedidoService'; 

const PedidosPage = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    
    // Estados para el Modal de Detalle
    const [openModal, setOpenModal] = useState(false);
    const [detalles, setDetalles] = useState([]);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    const [notification, setNotification] = useState({ 
        open: false, message: '', severity: 'success' 
    });

    const fetchPedidos = async () => {
        try {
            setLoading(true);
            const response = await getPedidos();
            setData(response.data);
        } catch (error) {
            setNotification({ open: true, message: 'Error al cargar los pedidos', severity: 'error' });
        } finally { setLoading(false); }
    };

    // Función para ver el detalle de un pedido específico
    const handleVerDetalle = async (pedidoId) => {
        try {
            setLoadingDetalle(true);
            setOpenModal(true);
            const response = await getDetallesByPedidoId(pedidoId);
            setDetalles(response.data);
        } catch (error) {
            setNotification({ open: true, message: 'No se pudieron obtener los detalles', severity: 'error' });
            setOpenModal(false);
        } finally { setLoadingDetalle(false); }
    };

    useEffect(() => { fetchPedidos(); }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gestión de Pedidos
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Button variant="contained" color="success" startIcon={<SearchIcon />} onClick={fetchPedidos}>
                    Actualizar Lista
                </Button>
            </Paper>

            {loading ? (
                <Box textAlign="center"><CircularProgress /></Box>
            ) : (
                <Paper sx={{ p: 3 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mesa</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((pedido) => (
                                    <TableRow key={pedido._id}>
                                        <TableCell>{pedido.mesa?.numero || 'N/A'}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>${pedido.total}</TableCell>
                                        <TableCell>{pedido.estado || 'pendiente'}</TableCell>
                                        <TableCell>{new Date(pedido.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell align="center">
                                            <IconButton color="primary" onClick={() => handleVerDetalle(pedido._id)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* MODAL DE DETALLES DEL PEDIDO */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Detalle del Pedido</DialogTitle>
                <DialogContent dividers>
                    {loadingDetalle ? (
                        <Box display="flex" justifyContent="center"><CircularProgress size={24} /></Box>
                    ) : (
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Producto</TableCell>
                                    <TableCell align="center">Cant.</TableCell>
                                    <TableCell align="right">Precio Unit.</TableCell>
                                    <TableCell align="right">Subtotal</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {detalles.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{item.producto?.nombre || 'Desconocido'}</TableCell>
                                        <TableCell align="center">{item.cantidad}</TableCell>
                                        <TableCell align="right">${item.precioUnitario}</TableCell>
                                        <TableCell align="right">${(item.cantidad * item.precioUnitario).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert severity={notification.severity}>{notification.message}</Alert>
            </Snackbar>
        </Container>
    );
};

export default PedidosPage;