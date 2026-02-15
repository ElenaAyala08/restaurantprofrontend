import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Typography, TextField, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, 
    IconButton, Box, CircularProgress, Grid, Chip, Avatar
} from '@mui/material';
import { 
    Edit as EditIcon, 
    PersonAdd as PersonAddIcon, 
    Search as SearchIcon,
    AdminPanelSettings as AdminIcon,
    Person as UsuarioIcon
} from '@mui/icons-material';

import { getUsuario } from '../../services/usuarioService';

const UsuarioPage = () => {
    const navigate = useNavigate();
    
    // Estados
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nombre: ''
    });

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const response = await getUsuario(formData);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error fetching Usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    // Función para renderizar el Chip del Rol
    const getRoleChip = (rol) => {
        const isAdmin = rol === 'Administrador';
        return (
            <Chip 
                icon={isAdmin ? <AdminIcon /> : <UsuarioIcon />} 
                label={rol} 
                variant="outlined" 
                color={isAdmin ? "secondary" : "default"}
                size="small"
            />
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Control de Usuarios
            </Typography>

            {/* Panel de Filtros */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            variant="outlined"
                            size="small"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            variant="contained" 
                            startIcon={<SearchIcon />} 
                            onClick={fetchUsuarios}
                            sx={{ flexGrow: 1 }}
                        >
                            Buscar
                        </Button>
                        <Button 
                            variant="contained" 
                            color="success" 
                            startIcon={<PersonAddIcon />}
                            onClick={() => navigate('/usuario/create')}
                            sx={{ flexGrow: 1 }}
                        >
                            Nuevo
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabla de Usuarios */}
            <TableContainer component={Paper} elevation={2}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={30} />
                                    <Typography variant="body2" sx={{ mt: 1 }}>Cargando usuarios...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : usuarios.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No se encontraron usuarios.
                                </TableCell>
                            </TableRow>
                        ) : (
                            usuarios.map((usuario) => (
                                <TableRow key={usuario._id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32, fontSize: '0.9rem' }}>
                                                {usuario.nombre.charAt(0)}
                                            </Avatar>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{usuario.email}</TableCell>
                                    <TableCell>{usuario.telefono || ''}</TableCell>
                                    <TableCell>{getRoleChip(usuario.rol)}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={usuario.status === 'active' ? 'Activo' : 'Inactivo'} 
                                            color={usuario.status === 'active' ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            color="primary" 
                                            size="small"
                                            onClick={() => navigate(`/usuario/edit/${usuario.id}`)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default UsuarioPage;