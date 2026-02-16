import api from '../api/axiosInstance';

export const getPedidos = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(
            ([_, value]) => value !== '' && value !== null && value !== undefined
        )
    );
    return api.get('/api/pedidos', {
        params: filtrosLimpios 
    });
};

export const getPedidoById = (id) => api.get(`/api/pedidos/${id}`);
export const createPedido = (pedidoData) => api.post('/api/pedidos', pedidoData);
export const updatePedido = (id, pedidoData) => api.put(`/api/pedidos/${id}`, pedidoData);
export const deletePedido = (id) => api.delete(`/api/pedidos/${id}`);
