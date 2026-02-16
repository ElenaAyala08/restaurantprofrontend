import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, Typography, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton,
    Chip, Stack, Box, Tooltip, CircularProgress, Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Restaurant as RestaurantIcon
} from '@mui/icons-material';

// Importación de servicios
import { getPedidos, deletePedido } from '../../services/pedidoService';

const getStatusColor = (estado) => {
    switch (estado) {
        case 'pagado':
            return 'success';   // Verde
        case 'servido':
            return 'info';      // Azul (antes decía entregado)
        case 'pendiente':
            return 'warning';    // Naranja
        case 'cancelado':
            return 'error';      // Rojo
        default:
            return 'default';
    }
};

const PedidosPage = () => {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar la lista de pedidos al entrar
    const fetchPedidos = async () => {
        try {
            setLoading(true);
            const res = await getPedidos({});
            // Ordenar por fecha: los más recientes arriba
            const data = res.data || res;
            setPedidos(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar los pedidos. Verifique la conexión.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta comanda?')) {
            try {
                await deletePedido(id);
                fetchPedidos(); // Recargar lista
            } catch (err) {
                alert('Error al eliminar el pedido');
            }
        }
    };

    // Formateador de moneda (Colones)
    const formatMoney = (amount) => `₡${amount.toLocaleString()}`;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

                {/* CABECERA */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <RestaurantIcon color="primary" fontSize="large" />
                            Gestión de Pedidos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Listado de pedidos activos y facturación
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        size="large"
                        onClick={() => navigate('/pedidos/create')}
                        sx={{ fontWeight: 'bold', borderRadius: 2 }}
                    >
                        Nuevo Pedido
                    </Button>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Mesa</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Items</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Total (IVA Inc.)</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha/Hora</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pedidos.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            No hay pedidos registrados actualmente.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pedidos.map((pedido) => (
                                        <TableRow key={pedido._id} hover>
                                            {/* MESA */}
                                            <TableCell>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    Mesa #{pedido.mesa?.numero || 'N/A'}
                                                </Typography>
                                            </TableCell>

                                            {/* ITEMS (Resumen) */}
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {pedido.items.length} productos
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {pedido.items.slice(0, 2).map(i => i.nombre).join(', ')}
                                                    {pedido.items.length > 2 ? '...' : ''}
                                                </Typography>
                                            </TableCell>

                                            {/* TOTAL */}
                                            <TableCell>
                                                <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                    {formatMoney(pedido.total)}
                                                </Typography>
                                            </TableCell>

                                            {/* ESTADO */}
                                            <TableCell>
                                                <Chip
                                                    label={pedido.estado}
                                                    color={getStatusColor(pedido.estado)}
                                                    size="small"
                                                    sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                                                />
                                            </TableCell>

                                            {/* FECHA */}
                                            <TableCell>
                                                <Typography variant="caption">
                                                    {new Date(pedido.createdAt).toLocaleString('es-CR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        day: '2-digit',
                                                        month: '2-digit'
                                                    })}
                                                </Typography>
                                            </TableCell>

                                            {/* BOTONES DE ACCIÓN */}
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title="Ver Detalle">
                                                        <IconButton
                                                            color="info"
                                                            onClick={() => navigate(`/pedidos/detalle/${pedido._id}`)}
                                                        >
                                                            <ViewIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Editar Pedido">
                                                        <IconButton
                                                            color="secondary"
                                                            onClick={() => navigate(`/pedidos/edit/${pedido._id}`)}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Container>
    );
};

export default PedidosPage;