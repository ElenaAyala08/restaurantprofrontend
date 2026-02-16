import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    MenuItem,
    Grid,
    Paper,
    IconButton,
    ListSubheader,
    Box,
    Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { getPedidoById, updatePedido } from "../../services/pedidoService";
import { getMenus } from "../../services/menuService";

const EditPedidoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [menuRestaurante, setMenuRestaurante] = useState([]);
    const [formData, setFormData] = useState({
        mesa: "",
        items: [],
        estado: "" // 🔹 Estado inicial
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pedidoRes = await getPedidoById(id);
                setFormData(pedidoRes.data);

                const menuRes = await getMenus();
                setMenuRestaurante(menuRes.data || menuRes);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        fetchData();
    }, [id]);

    const handleSelectPlatillo = (e) => {
        const platilloId = e.target.value;
        if (!platilloId) return;

        const plato = menuRestaurante.find(p => p._id === platilloId);
        if (!plato) return;

        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    menuId: plato._id,
                    nombre: plato.nombre,
                    precio: plato.precio,
                    cantidad: 1,
                    categoria: plato.categoria,
                    nota: ""
                }
            ]
        }));
    };

    const handleCantidadChange = (index, cantidad) => {
        const nuevosItems = [...formData.items];
        nuevosItems[index].cantidad = Math.max(1, Number(cantidad));
        setFormData({ ...formData, items: nuevosItems });
    };

    const handleRemoveItem = (index) => {
        const nuevosItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: nuevosItems });
    };

    const subtotal = formData.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const impuesto = subtotal * 0.13;
    const total = subtotal + impuesto;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Enviamos el formData que ya incluye el campo 'estado' actualizado
            await updatePedido(id, formData);
            navigate("/pedidos");
        } catch (error) {
            console.error(error);
            alert("Error al actualizar pedido");
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Editar Pedido
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    ID: {id}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* 🔹 Mesa (Solo lectura) */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Mesa"
                                value={formData.mesa?.numero ? `Mesa ${formData.mesa.numero}` : "Cargando mesa..."}
                                disabled
                                variant="filled"
                            />
                        </Grid>

                        {/* 🔹 Estado del Pedido (Editable) */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Estado del Pedido"
                                value={formData.estado || "pendiente"}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                required
                                margin="normal"
                            >
                                {/* Estos valores deben ser idénticos a tu enum de Mongoose */}
                                <MenuItem value="pendiente">Pendiente</MenuItem>
                                <MenuItem value="servido">Servido</MenuItem> {/* Cambiado de 'entregado' a 'servido' */}
                                <MenuItem value="pagado">Pagado</MenuItem>
                                <MenuItem value="cancelado">Cancelado</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <TextField
                                select
                                fullWidth
                                label="Agregar más platillos"
                                value=""
                                onChange={handleSelectPlatillo}
                            >
                                <MenuItem value="">Seleccionar</MenuItem>
                                {[...new Set(menuRestaurante.map(m => m.categoria))].map(cat => [
                                    <ListSubheader key={cat} sx={{ bgcolor: 'background.paper', fontWeight: 'bold' }}>
                                        {cat ? cat.toUpperCase() : "OTROS"}
                                    </ListSubheader>,
                                    menuRestaurante.filter(p => p.categoria === cat).map(plato => (
                                        <MenuItem key={plato._id} value={plato._id}>
                                            {plato.nombre} - ${plato.precio}
                                        </MenuItem>
                                    ))
                                ])}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>Detalle del Pedido</Typography>
                        {formData.items.map((item, index) => (
                            <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1 }}>
                                <Grid item xs={5}><Typography>{item.nombre}</Typography></Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={item.cantidad}
                                        onChange={(e) => handleCantidadChange(index, e.target.value)}
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                                    <Typography>${(item.precio * item.cantidad).toFixed(2)}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton color="error" onClick={() => handleRemoveItem(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>

                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
                        <Typography>Impuesto (13%): ${impuesto.toFixed(2)}</Typography>
                        <Typography variant="h6" color="primary">Total: ${total.toFixed(2)}</Typography>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        <Grid item xs={6}>
                            <Button fullWidth variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/pedidos")}>
                                Volver
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button fullWidth type="submit" variant="contained" color="success" size="large" disabled={formData.items.length === 0}>
                                Actualizar Pedido
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default EditPedidoPage;