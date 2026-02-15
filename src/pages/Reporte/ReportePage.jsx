import React, { useEffect, useState } from 'react';
import { 
    Container, Typography, Paper, Grid, Button,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress,
    Snackbar, Alert, Box
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { getReporteById } from '../../services/reporteService';
import { getAuthUsuario } from '../../utils/auth';

const ReportesPage = () => {

    const usuario = getAuthUsuario();

    const [loading, setLoading] = useState(true);
    const [rango, setRango] = useState('todo');
    const [data, setData] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const fetchReporte = async () => {
        try {
            setLoading(true);
            const response = await getSalesReport(rango);
            setData(response.data);
        } catch (error) {
            setNotification({
                open: true,
                message: 'Error al cargar el reporte',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReporte();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Reporte de Ventas
            </Typography>

            {/* FILTRO POR RANGO */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item>
                        <Button variant="contained" onClick={() => setRango('hoy')}>
                            Hoy
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={() => setRango('semana')}>
                            Semana
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={() => setRango('mes')}>
                            Mes
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" onClick={() => setRango('todo')}>
                            Todo
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button 
                            variant="contained" 
                            color="success"
                            startIcon={<SearchIcon />}
                            onClick={fetchReporte}
                        >
                            Generar Reporte
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {loading ? (
                <Box textAlign="center">
                    <CircularProgress />
                </Box>
            ) : data && (
                <>
                    {/* RESUMEN GENERAL */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6">Resumen General</Typography>
                        <Typography>Ingresos Totales: ${data.resumen.ingresosTotales}</Typography>
                        <Typography>Facturas Pagadas: {data.resumen.facturasPagadas}</Typography>
                        <Typography>Ticket Promedio: ${data.resumen.ticketPromedio}</Typography>
                        <Typography>Pedidos Totales: {data.resumen.pedidosTotales}</Typography>
                    </Paper>

                    {/* VENTAS POR CATEGORÍA */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6">Ventas por Categoría</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Categoría</TableCell>
                                        <TableCell>Ventas</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.porCategoria.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item._id}</TableCell>
                                            <TableCell>${item.ventas}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* MÁS VENDIDOS */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6">Productos Más Vendidos</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Producto</TableCell>
                                        <TableCell>Unidades</TableCell>
                                        <TableCell>Total Ventas</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.masVendidos.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item._id}</TableCell>
                                            <TableCell>{item.unidades}</TableCell>
                                            <TableCell>${item.totalVentas}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* FACTURAS RECIENTES */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">Facturas Recientes</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Cliente</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Fecha</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.facturasRecientes.map((factura) => (
                                        <TableRow key={factura._id}>
                                            <TableCell>{factura._id}</TableCell>
                                            <TableCell>{factura.cliente || '-'}</TableCell>
                                            <TableCell>${factura.total}</TableCell>
                                            <TableCell>
                                                {new Date(factura.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
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

export default ReportesPage;
