import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Divider,
    Stack,
    MenuItem,
    IconButton
} from '@mui/material';
import {
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

import { createPedido } from '../../services/pedidoService';
import { getMesas } from '../../services/mesaService';
import { getMenus } from '../../services/menuService';
import { pedidoZodSchema } from '../../schemas/pedido';
import ErrorMessage from '../../components/ErrorMessage';

const CreatePedidoPage = () => {

    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);
    const [mesas, setMesas] = useState([]);
    const [menus, setMenus] = useState([]);
    const [platilloSeleccionado, setPlatilloSeleccionado] = useState('');

    const [formData, setFormData] = useState({
        mesa: '',
        items: []
    });

    // ===============================
    // 🔹 Cargar mesas y menú
    // ===============================
    useEffect(() => {
        const fetchData = async () => {
            try {
                const mesasData = await getMesas(); 
                const todasLasMesas = mesasData.data || mesasData;
                const disponibles = mesasData.data?.filter(m => m.estado === 'disponible') || [];
                setMesas(disponibles);

                const menuData = await getMenus();
                setMenus(menuData.data || menuData);

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // ===============================
    // 🔹 Agregar platillo
    // ===============================
    const handleAddItem = (e) => {
        const menuId = e.target.value;
        setPlatilloSeleccionado(menuId);

        if (!menuId) return;

        const plato = menus.find(m => m._id === menuId);
        if (!plato) return;

        const nuevoItem = {
            menuId: plato._id,
            nombre: plato.nombre,
            precio: plato.precio,
            cantidad: 1,
            categoria: plato.categoria,
            nota: ''
        };

        setFormData(prev => ({
            ...prev,
            items: [...prev.items, nuevoItem]
        }));

        setPlatilloSeleccionado('');
    };

    // ===============================
    // 🔹 Cambiar cantidad
    // ===============================
    const handleCantidadChange = (index, value) => {
        const nuevosItems = [...formData.items];
        nuevosItems[index].cantidad = Number(value);

        setFormData({
            ...formData,
            items: nuevosItems
        });
    };

    // ===============================
    // 🔹 Eliminar item
    // ===============================
    const handleRemoveItem = (index) => {
        const nuevosItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: nuevosItems });
    };

    // ===============================
    // 🔹 Cálculos
    // ===============================
    const subtotal = formData.items.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );

    const impuesto = subtotal * 0.13;
    const total = subtotal + impuesto;

    // ===============================
    // 🔹 Enviar formulario
    // ===============================
const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    
    const pedidoData = {
        ...formData,
        subtotal, 
        impuesto, 
        total,    
        estado: 'pendiente' 
    };

    try {
        
        const resultado = pedidoZodSchema.safeParse(pedidoData);

        if (!resultado.success) {
            const listaErrores = resultado.error.issues.map(issue => ({
                campo: issue.path[0],
                mensaje: issue.message
            }));
            setErrors(listaErrores);
            return;
        }

        
        await createPedido(pedidoData);
        navigate('/pedidos');

    } catch (error) {
        let serverMessage = error.response?.data?.error || error.message;
        setErrors([{ campo: 'SERVER', mensaje: serverMessage }]);
    }
};

    const hasError = (fieldName) =>
        errors.some(err => err.campo === fieldName);

    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: 'bold', textAlign: 'center' }}
                >
                    Crear Nuevo Pedido
                </Typography>

                <Divider sx={{ mb: 4 }} />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>

                        {/* 🔹 Mesa */}
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Seleccionar Mesa"
                                value={formData.mesa}
                                onChange={(e) =>
                                    setFormData({ ...formData, mesa: e.target.value })
                                }
                                error={hasError('mesa')}
                                required
                            >
                                <MenuItem value="">
                                    Seleccionar
                                </MenuItem>

                                {mesas.map((mesa) => (
                                    <MenuItem key={mesa._id} value={mesa._id}>
                                        Mesa {mesa.numero} - Capacidad: {mesa.capacidad}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* 🔹 Agregar Platillo */}
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Agregar Platillo"
                                value={platilloSeleccionado}
                                onChange={handleAddItem}
                            >
                                <MenuItem value="">
                                    Seleccionar
                                </MenuItem>

                                {menus.map((plato) => (
                                    <MenuItem key={plato._id} value={plato._id}>
                                        {plato.nombre} - ${plato.precio}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* 🔹 Lista de items */}
                        {formData.items.map((item, index) => (
                            <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
                                <Grid item xs={4}>
                                    {item.nombre}
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField
                                        type="number"
                                        size="small"
                                        label="Cantidad"
                                        value={item.cantidad}
                                        onChange={(e) =>
                                            handleCantidadChange(index, e.target.value)
                                        }
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    ${item.precio * item.cantidad}
                                </Grid>

                                <Grid item xs={2}>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveItem(index)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}

                        {/* 🔹 Totales */}
                        <Grid item xs={12}>
                            <Box sx={{ mt: 3 }}>
                                <Typography>
                                    Subtotal: ${subtotal.toFixed(2)}
                                </Typography>
                                <Typography>
                                    Impuesto (13%): ${impuesto.toFixed(2)}
                                </Typography>
                                <Typography variant="h6">
                                    Total: ${total.toFixed(2)}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* 🔹 Botones */}
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => navigate('/pedidos')}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    startIcon={<SaveIcon />}
                                >
                                    Crear Pedido
                                </Button>
                            </Stack>
                        </Grid>

                    </Grid>
                </form>

                <Box sx={{ mt: 3 }}>
                    <ErrorMessage errors={errors} />
                </Box>

            </Paper>
        </Container>
    );
};

export default CreatePedidoPage;
