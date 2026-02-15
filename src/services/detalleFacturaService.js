import api from '../api/axiosInstance';

export const getDetalleFactura = (id) => api.get(`/api/detallefactura/${id}`);
