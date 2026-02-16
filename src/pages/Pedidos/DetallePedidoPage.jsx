import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Paper,
    Grid,
    Divider,
    Box,
    Button
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getPedidoById } from "../../services/pedidoService";

const DetallePedidoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const res = await getPedidoById(id);
                setPedido(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPedido();
    }, [id]);

    if (!pedido) return (
        <Container sx={{ mt: 5 }}><Typography>Cargando detalle...</Typography></Container>
    );

    // Cálculos usando el 13% para ser consistente con tu sistema
    const subtotal = pedido.items.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );
    const impuesto = subtotal * 0.13;
    const total = subtotal + impuesto;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate(-1)} 
                sx={{ mb: 2 }}
            >
                Volver
            </Button>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Resumen del Pedido
                </Typography>
                
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 3, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                    <Typography variant="h6">
                        {/* Mostramos el número de mesa si existe el objeto, sino el ID como respaldo */}
                        Mesa: {pedido.mesa?.numero ? `Mesa ${pedido.mesa.numero}` : `ID: ${pedido.mesa}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        ID Pedido: {pedido._id}
                    </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                    Productos consumidos:
                </Typography>

                {pedido.items.map((item, index) => (
                    <Grid container key={index} sx={{ py: 1, borderBottom: '1px solid #eee' }}>
                        <Grid item xs={6}>
                            <Typography sx={{ fontWeight: 500 }}>{item.nombre}</Typography>
                        </Grid>
                        <Grid item xs={3} textAlign="center">
                            <Typography>x{item.cantidad}</Typography>
                        </Grid>
                        <Grid item xs={3} textAlign="right">
                            <Typography>${(item.precio * item.cantidad).toFixed(2)}</Typography>
                        </Grid>
                    </Grid>
                ))}

                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="body1">
                        Subtotal: <strong>${subtotal.toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="body1">
                        Impuesto (13%): <strong>${impuesto.toFixed(2)}</strong>
                    </Typography>
                    <Divider sx={{ my: 1, width: '200px' }} />
                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        Total: ${total.toFixed(2)}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default DetallePedidoPage;