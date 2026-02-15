import api from '../api/axiosInstance';

export const getDetallePedido = (id) => api.get(`/api/detallepedido/${id}`);
