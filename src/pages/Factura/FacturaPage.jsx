import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Grid, Button,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress,
    Snackbar, Alert, Box, TextField, MenuItem,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import { 
    Add as AddIcon, 
    Visibility as VisibilityIcon, 
    Print as PrintIcon 
} from '@mui/icons-material';

import {
    getFacturas,
    getEstadisticasFacturacion,
    createFactura,
    getDetalleFactura // Asegúrate de tener este servicio en tu facturaService
} from '../../services/facturaService';

import { getAuthUsuario } from '../../utils/auth';

const FacturasPage = () => {
    const usuario = getAuthUsuario();

    // Estados principales
    const [loading, setLoading] = useState(true);
    const [facturas, setFacturas] = useState([]);
    const [estadisticas, setEstadisticas] = useState({});
    const [form, setForm] = useState({ pedidoId: '', metodoPago: 'efectivo' });

    // Estados para el Modal de Detalle
    const [openModal, setOpenModal] = useState(false);
    const [detalle, setDetalle] = useState(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchFacturas = async () => {
        try {
            setLoading(true);
            const response = await getFacturas();
            setFacturas(response.data);
            const stats = await getEstadisticasFacturacion();
            setEstadisticas(stats.data);
        } catch (error) {
            setNotification({ open: true, message: 'Error al cargar facturas', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCrearFactura = async () => {
        try {
            await createFactura(form);
            setNotification({ open: true, message: 'Factura generada correctamente', severity: 'success' });
            setForm({ pedidoId: '', metodoPago: 'efectivo' });
            fetchFacturas();
        } catch (error) {
            setNotification({
                open: true,
                message: error.response?.data?.msg || 'Error al generar factura',
                severity: 'error'
            });
        }
    };

    const handleVerDetalle = async (id) => {
        try {
            setLoadingDetalle(true);
            setOpenModal(true);
            const response = await getDetalleFactura(id);
            setDetalle(response.data);
        } catch (error) {
            setNotification({ open: true, message: 'Error al obtener detalle', severity: 'error' });
            setOpenModal(false);
        } finally {
            setLoadingDetalle(false);
        }
    };

    useEffect(() => {
        fetchFacturas();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gestión de Facturación
            </Typography>

            {/* ESTADÍSTICAS */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography color="textSecondary">Facturas generadas</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{estadisticas.facturasGeneradas || 0}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography color="textSecondary">Pendientes facturar</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'orange' }}>{estadisticas.pendientesFacturar || 0}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography color="textSecondary">Total pedidos servidos</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'green' }}>{estadisticas.totalPedidosServidos || 0}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* FORMULARIO CREAR FACTURA */}
            {(usuario?.rol === 'Administrador' || usuario?.rol === 'Mesero') && (
                <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="h6" gutterBottom>Generar Nueva Factura</Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={5}>
                            <TextField
                                fullWidth label="ID del Pedido"
                                value={form.pedidoId}
                                onChange={(e) => setForm({ ...form, pedidoId: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                select fullWidth label="Método de Pago"
                                value={form.metodoPago}
                                onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}
                            >
                                <MenuItem value="efectivo">Efectivo</MenuItem>
                                <MenuItem value="tarjeta">Tarjeta</MenuItem>
                                <MenuItem value="transferencia">Transferencia</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button
                                variant="contained" color="primary" startIcon={<AddIcon />}
                                onClick={handleCrearFactura} fullWidth sx={{ height: '56px' }}
                            >
                                Facturar
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* LISTADO DE HISTORIAL */}
            {loading ? (
                <Box textAlign="center" py={5}><CircularProgress /></Box>
            ) : (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Historial de Facturas</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Número</TableCell>
                                    <TableCell>Mesa</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Método</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell align="right">Detalle</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {facturas.map((factura) => (
                                    <TableRow key={factura._id} hover>
                                        <TableCell sx={{ fontWeight: 'medium' }}>{factura.numeroFactura}</TableCell>
                                        <TableCell>Mesa {factura.pedido?.mesa?.numero || '-'}</TableCell>
                                        <TableCell>${factura.total}</TableCell>
                                        <TableCell sx={{ textTransform: 'capitalize' }}>{factura.metodoPago}</TableCell>
                                        <TableCell>{new Date(factura.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell align="right">
                                            <IconButton color="info" onClick={() => handleVerDetalle(factura._id)}>
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

            {/* MODAL DETALLE DE FACTURA (TICKET) */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
                {loadingDetalle || !detalle ? (
                    <Box p={4} textAlign="center"><CircularProgress /></Box>
                ) : (
                    <>
                        <DialogTitle sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>TICKET DE VENTA</Typography>
                            <Typography variant="caption">Nº: {detalle.encabezado.numeroFactura}</Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2"><b>Fecha:</b> {new Date(detalle.encabezado.fechaEmision).toLocaleString()}</Typography>
                                <Typography variant="body2"><b>Mesa:</b> {detalle.referenciaPedido.mesa}</Typography>
                                <Typography variant="body2"><b>Cajero:</b> {detalle.atendidoPor?.nombre}</Typography>
                            </Box>
                            <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
                            <Table size="small">
                                <TableBody>
                                    {detalle.items.map((item, i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={{ borderBottom: 'none', px: 0 }}>
                                                {item.cantidad}x {item.nombre}
                                            </TableCell>
                                            <TableCell align="right" sx={{ borderBottom: 'none', px: 0 }}>
                                                ${item.totalLinea.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                                <Typography>Subtotal:</Typography>
                                <Typography>${detalle.resumenFinanciero.subtotal.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                                <Typography>IVA:</Typography>
                                <Typography>${detalle.resumenFinanciero.impuesto.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mt: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>TOTAL:</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${detalle.resumenFinanciero.total.toFixed(2)}</Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
                            <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>
                                Imprimir
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Snackbar
                open={notification.open} autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert severity={notification.severity}>{notification.message}</Alert>
            </Snackbar>
        </Container>
    );
};

export default FacturasPage;