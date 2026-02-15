import React, { useEffect, useState } from 'react';
import { 
    Container, Typography, Paper, Grid, Button,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress,
    Snackbar, Alert, Box
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { getMesas } from '../../services/mesaService';
import { getAuthUsuario } from '../../utils/auth';

const MesaPage = () => {

    const usuario = getAuthUsuario();

    const [loading, setLoading] = useState(true);
    const [mesas, setMesas] = useState([]);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchMesas = async () => {
        try {
            setLoading(true);
            const response = await getMesas();
            setMesas(response.data);
        } catch (error) {
            setNotification({
                open: true,
                message: 'Error al cargar las mesas',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMesas();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gestión de Mesas
            </Typography>

            {/* BOTÓN ACTUALIZAR */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<SearchIcon />}
                            onClick={fetchMesas}
                        >
                            Actualizar Lista
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
                        Lista de Mesas
                    </Typography>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Número</TableCell>
                                    <TableCell>Capacidad</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Fecha Creación</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mesas.map((mesa) => (
                                    <TableRow key={mesa._id}>
                                        <TableCell>{mesa.numero}</TableCell>
                                        <TableCell>{mesa.capacidad}</TableCell>
                                        <TableCell>{mesa.estado}</TableCell>
                                        <TableCell>
                                            {new Date(mesa.createdAt).toLocaleDateString()}
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

export default MesaPage;
