import React, { useEffect, useState, useCallback } from 'react';
import {
    Container, Typography, Paper, Grid, Button,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress,
    Snackbar, Alert, Box, TextField, MenuItem,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Stack
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Print as PrintIcon
} from '@mui/icons-material';

import { getFacturas, getEstadisticasFacturacion, createFactura } from '../../services/facturaService';
import { getDetalleFactura } from '../../services/detalleFacturaService';
import { getPedidos } from '../../services/pedidoService';
import { getAuthUsuario } from '../../utils/auth';

const FacturasPage = () => {
    const usuario = getAuthUsuario();
    const [loading, setLoading] = useState(true);
    const [facturas, setFacturas] = useState([]);
    const [pedidosPendientes, setPedidosPendientes] = useState([]);
    const [estadisticas, setEstadisticas] = useState({ facturasGeneradas: 0, pendientesFacturar: 0, totalPedidosServidos: 0 });
    
    const [filterText, setFilterText] = useState('');
    const [filterMetodo, setFilterMetodo] = useState('Todos');
    const [form, setForm] = useState({ pedidoId: '', metodoPago: 'Efectivo' });
    const [openModal, setOpenModal] = useState(false);
    const [detalle, setDetalle] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // Intentamos traer todo, pero si uno falla (Error 500), el resto sigue
            const [resFacturas, resStats, resPedidos] = await Promise.allSettled([
                getFacturas({}),
                getEstadisticasFacturacion(),
                getPedidos()
            ]);

            setFacturas(resFacturas.status === 'fulfilled' ? resFacturas.value.data : []);
            setEstadisticas(resStats.status === 'fulfilled' ? resStats.value.data : { facturasGeneradas: 0, pendientesFacturar: 0, totalPedidosServidos: 0 });
            
            if (resPedidos.status === 'fulfilled') {
                const pedidos = resPedidos.value.data || [];
                setPedidosPendientes(pedidos.filter(p => p.estado === 'servido'));
            }

            if (resFacturas.status === 'rejected') {
                setNotification({ open: true, message: 'Servidor con problemas: No se pudieron cargar las facturas', severity: 'error' });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const facturasFiltradas = facturas.filter(f => {
        const num = f.numeroFactura || '';
        return num.toLowerCase().includes(filterText.toLowerCase()) && 
               (filterMetodo === 'Todos' || f.metodoPago === filterMetodo);
    });

    const handleCrearFactura = async () => {
        try {
            await createFactura(form);
            setNotification({ open: true, message: 'Pago registrado con éxito', severity: 'success' });
            setForm({ pedidoId: '', metodoPago: 'Efectivo' });
            fetchData();
        } catch (error) {
            setNotification({ open: true, message: 'Error al procesar: ' + (error.response?.data?.msg || 'Error interno'), severity: 'error' });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* ENCABEZADO CON ESTILO */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight="800" color="primary">Sistema de Facturación</Typography>
                <Button variant="contained" startIcon={<RefreshIcon />} onClick={fetchData}>REFRESCAR</Button>
            </Stack>

            {/* TARJETAS DE ESTADÍSTICAS (Estilo original recuperado) */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderTop: '5px solid #1976d2', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="subtitle1" color="textSecondary">Facturas Emitidas</Typography>
                        <Typography variant="h4" fontWeight="bold">{estadisticas.facturasGeneradas || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderTop: '5px solid #ed6c02', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="subtitle1" color="orange">Pendientes de Pago</Typography>
                        <Typography variant="h4" fontWeight="bold" color="orange">{estadisticas.pendientesFacturar || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderTop: '5px solid #2e7d32', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="subtitle1" color="green">Total del Día</Typography>
                        <Typography variant="h4" fontWeight="bold" color="green">{estadisticas.totalPedidosServidos || 0}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* REGISTRAR PAGO (Estilo mejorado) */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 4 }}>
                <Typography variant="h5" textAlign="center" mb={3} fontWeight="bold">Registrar Nuevo Pago</Typography>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={5}>
                        <TextField
                            select fullWidth label="Pedido / Mesa"
                            value={form.pedidoId}
                            onChange={(e) => setForm({ ...form, pedidoId: e.target.value })}
                        >
                            {pedidosPendientes.map((p) => (
                                <MenuItem key={p._id} value={p._id}>
                                    Mesa {p.mesa?.numero} — ${p.total?.toFixed(2)}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            select fullWidth label="Método de Pago"
                            value={form.metodoPago}
                            onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}
                        >
                            <MenuItem value="Efectivo">Efectivo</MenuItem>
                            <MenuItem value="Tarjeta de Crédito">Tarjeta de Crédito</MenuItem>
                            <MenuItem value="Transferencia">Transferencia</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            variant="contained" fullWidth size="large"
                            startIcon={<AddIcon />} color="success"
                            onClick={handleCrearFactura} disabled={!form.pedidoId}
                            sx={{ height: 56, fontWeight: 'bold' }}
                        >
                            COBRAR
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* TABLA DE FACTURAS */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell><b>NÚMERO</b></TableCell>
                            <TableCell><b>MESA</b></TableCell>
                            <TableCell><b>MONTO TOTAL</b></TableCell>
                            <TableCell><b>MÉTODO</b></TableCell>
                            <TableCell><b>FECHA</b></TableCell>
                            <TableCell align="right"><b>ACCIONES</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {facturasFiltradas.length > 0 ? facturasFiltradas.map((f) => (
                            <TableRow key={f._id} hover>
                                <TableCell>{f.numeroFactura}</TableCell>
                                <TableCell>Mesa {f.pedido?.mesa?.numero || 'N/A'}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>${f.total?.toFixed(2)}</TableCell>
                                <TableCell>{f.metodoPago}</TableCell>
                                <TableCell>{new Date(f.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={async () => {
                                        const res = await getDetalleFactura(f._id);
                                        setDetalle(res.data);
                                        setOpenModal(true);
                                    }}><VisibilityIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>No hay datos disponibles</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}>
                <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
            </Snackbar>
        </Container>
    );
};

export default FacturasPage;