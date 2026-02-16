import api from '../api/axiosInstance';

export const getFacturas = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    return api.get('/api/facturas', {
        params: filtrosLimpios 
    });
};

export const getFacturaById = (id) => api.get(`/api/facturas/${id}`);
export const createFactura = (facturaData) => api.post('/api/facturas', facturaData);
export const updateFactura = (id, facturaData) => api.put(`/api/facturas/${id}`, facturaData);
export const deleteFactura = (id) => api.delete(`/api/facturas/${id}`);
export const getEstadisticasFacturacion = () => api.get('/api/facturas/estadisticas');
export const getDetalleFactura = (id) => api.get(`/api/detallefactura/${id}`);
