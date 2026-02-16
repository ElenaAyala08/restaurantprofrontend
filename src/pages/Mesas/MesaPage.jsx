import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Box, CircularProgress, Grid, MenuItem,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Snackbar, Alert, Stack, Chip
} from '@mui/material';
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Search as SearchIcon, 
    Add as AddIcon,
    TableBar as TableIcon
} from '@mui/icons-material';

// Importación de tus servicios
import { getMesas, deleteMesa } from '../../services/mesaService';
import { getAuthUsuario } from '../../utils/auth';

const MesasPage = () => {
    const usuario = getAuthUsuario();
    const navigate = useNavigate();

    // Estados de datos
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({ numero: '', estado: '' });

    // Estados de UI
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [mesaParaEliminar, setMesaParaEliminar] = useState(null);

    // Permisos: Admin y Mesero pueden crear/editar. Todos pueden ver.
    const canModify = usuario?.rol === 'Administrador' || usuario?.rol === 'Mesero';

    const fetchMesas = async () => {
        try {
            setLoading(true);
            const response = await getMesas(filtros);
            const data = response.data || response;
            setMesas(Array.isArray(data) ? data : []);
        } catch (error) {
            handleNotification('Error al cargar la lista de mesas', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const handleDeleteClick = (mesa) => {
        setMesaParaEliminar(mesa);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteMesa(mesaParaEliminar._id);
            handleNotification('Mesa eliminada correctamente');
            fetchMesas();
        } catch (error) {
            handleNotification('No se pudo eliminar la mesa', 'error');
        } finally {
            setOpenDeleteDialog(false);
            setMesaParaEliminar(null);
        }
    };

    useEffect(() => {
        fetchMesas();
    }, []);

    // Función para el color de los estados
    const getStatusChip = (estado) => {
        const colors = {
            disponible: { bg: '#e8f5e9', text: '#2e7d32' },
            ocupada: { bg: '#ffebee', text: '#c62828' },
            reservada: { bg: '#e3f2fd', text: '#1565c0' }
        };
        const style = colors[estado] || { bg: '#f5f5f5', text: '#757575' };
        
        return (
            <Chip 
                label={estado.toUpperCase()} 
                size="small" 
                sx={{ bgcolor: style.bg, color: style.text, fontWeight: 'bold' }} 
            />
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
            {/* CABECERA */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TableIcon fontSize="large" /> Gestión de Mesas
                </Typography>
                {canModify && (
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/mesas/create')}
                    >
                        NUEVA MESA
                    </Button>
                )}
            </Stack>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                {/* BUSCADOR */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Número de Mesa"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={filtros.numero}
                            onChange={(e) => setFiltros({ ...filtros, numero: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Estado"
                            variant="outlined"
                            size="small"
                            value={filtros.estado}
                            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                        >
                            <MenuItem value="">Todos los estados</MenuItem>
                            <MenuItem value="disponible">Disponible</MenuItem>
                            <MenuItem value="ocupada">Ocupada</MenuItem>
                            <MenuItem value="reservada">Reservada</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon />}
                            onClick={fetchMesas}
                            sx={{ height: '40px' }}
                        >
                            BUSCAR
                        </Button>
                    </Grid>
                </Grid>

                {/* TABLA */}
                {loading ? (
                    <Box textAlign="center" py={5}><CircularProgress /></Box>
                ) : (
                    <TableContainer>
                        <Table sx={{ minWidth: 600 }}>
                            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                                <TableRow>
                                    <TableCell><strong>N° Mesa</strong></TableCell>
                                    <TableCell><strong>Capacidad</strong></TableCell>
                                    <TableCell><strong>Estado</strong></TableCell>
                                    {canModify && <TableCell align="center"><strong>Acciones</strong></TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mesas.length > 0 ? (
                                    mesas.map((mesa) => (
                                        <TableRow key={mesa._id} hover>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Mesa {mesa.numero}</TableCell>
                                            <TableCell>{mesa.capacidad} personas</TableCell>
                                            <TableCell>{getStatusChip(mesa.estado)}</TableCell>
                                            {canModify && (
                                                <TableCell align="center">
                                                    <IconButton 
                                                        color="primary" 
                                                        onClick={() => navigate(`/mesas/edit/${mesa._id}`)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => handleDeleteClick(mesa)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                            No se encontraron mesas registradas.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* DIÁLOGO DE ELIMINACIÓN */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>¿Eliminar Mesa?</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar la <strong>Mesa {mesaParaEliminar?.numero}</strong>? 
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">Eliminar</Button>
                </DialogActions>
            </Dialog>

            {/* NOTIFICACIONES */}
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

export default MesasPage;