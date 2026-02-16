import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Box, CircularProgress, 
    MenuItem, TextField, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Stack, Chip, IconButton
} from '@mui/material';
import { 
    TrendingUp, ReceiptLong, Analytics, Assessment, 
    CalendarMonth, Refresh, RestaurantMenu
} from '@mui/icons-material';

import { getReportes } from '../../services/reporteService';

const ReportePage = () => {
    const [loading, setLoading] = useState(true);
    const [rango, setRango] = useState('hoy');
    const [data, setData] = useState(null);

    const fetchReporte = async () => {
        try {
            setLoading(true);
            const response = await getReportes({ rango });
            setData(response.data || response);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReporte(); }, [rango]);

    // Limpia los decimales feos y formatea a moneda
    const formatMoney = (n) => `₡${Math.round(n || 0).toLocaleString()}`;

    const MiniCard = ({ title, value, icon, color }) => (
        <Paper elevation={0} sx={{ 
            p: 2, borderRadius: 3, bgcolor: 'white', flex: 1, minWidth: '200px',
            borderTop: `5px solid ${color}`, boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}15`, color: color, display: 'flex' }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>
                        {title}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: 'black' }}>
                        {value}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#000', color: 'white', pb: 5 }}>
            <Container maxWidth="lg">
                
                {/* Cabecera */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1, bgcolor: '#1976d2', borderRadius: 2, display: 'flex' }}>
                            <Analytics sx={{ color: 'white' }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 900 }}>Dashboard</Typography>
                    </Stack>

                    <Paper sx={{ p: 0.5, borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={fetchReporte} size="small"><Refresh fontSize="small" /></IconButton>
                        <TextField
                            select size="small" value={rango}
                            onChange={(e) => setRango(e.target.value)}
                            sx={{ width: 140, "& fieldset": { border: "none" } }}
                            InputProps={{ sx: { fontWeight: 700, fontSize: '0.85rem' } }}
                        >
                            <MenuItem value="hoy">Hoy</MenuItem>
                            <MenuItem value="semana">Semana</MenuItem>
                            <MenuItem value="mes">Mes</MenuItem>
                            <MenuItem value="todo">Total</MenuItem>
                        </TextField>
                    </Paper>
                </Stack>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
                ) : (
                    <Stack spacing={3}>
                        
                        {/* Tarjetas: Uso de Flexbox en lugar de Grid para evitar estiramientos */}
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 2, 
                            justifyContent: 'space-between' 
                        }}>
                            <MiniCard title="INGRESOS" value={formatMoney(data?.resumen?.ingresosTotales)} icon={<TrendingUp />} color="#4caf50" />
                            <MiniCard title="FACTURAS" value={data?.resumen?.facturasPagadas || 0} icon={<ReceiptLong />} color="#2196f3" />
                            <MiniCard title="PROMEDIO" value={formatMoney(data?.resumen?.ticketPromedio)} icon={<Analytics />} color="#ff9800" />
                            <MiniCard title="PLATILLOS" value={data?.resumen?.pedidosTotales || 0} icon={<Assessment />} color="#9c27b0" />
                        </Box>

                        {/* Tabla */}
                        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                            <Box sx={{ p: 2, bgcolor: 'white', display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #eee' }}>
                                <RestaurantMenu color="primary" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'black' }}>
                                    Platillos con mayor demanda
                                </Typography>
                            </Box>
                            <TableContainer sx={{ bgcolor: 'white' }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800 }}>NOMBRE</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 800 }}>VENDIDOS</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800 }}>TOTAL</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data?.masVendidos?.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell sx={{ fontWeight: 600 }}>{item.nombre}</TableCell>
                                                <TableCell align="center">
                                                    <Chip label={item.unidades} size="small" color="primary" sx={{ fontWeight: 900 }} />
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 800, color: '#1976d2' }}>
                                                    {formatMoney(item.totalVentas)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Stack>
                )}
            </Container>
        </Box>
    );
};

export default ReportePage;