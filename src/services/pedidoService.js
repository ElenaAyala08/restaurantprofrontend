import api from '../api/axiosInstance';

export const getPedidos = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    return api.get('/pedidos', {
        params: filtrosLimpios 
    });
};

export const getPedidoById = (id) => api.get(`/pedidos/${id}`);
export const createPedido = (pedidoData) => api.post('/pedidos', pedidoData);
export const updatePedido = (id, pedidoData) => api.put(`/pedidos/${id}`, pedidoData);
export const deletePedido = (id) => api.delete(`/pedidos/${id}`);
