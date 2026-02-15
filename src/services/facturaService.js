import api from '../api/axiosInstance';

export const getFacturas = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    return api.get('/facturas', {
        params: filtrosLimpios 
    });
};

export const getFacturaById = (id) => api.get(`/facturas/${id}`);
export const createFactura = (facturaData) => api.post('/facturas', facturaData);
export const updateFactura = (id, facturaData) => api.put(`/facturas/${id}`, facturaData);
export const deleteFactura = (id) => api.delete(`/facturas/${id}`);
export const getEstadisticasFacturacion = () => api.get('/facturas/estadisticas');
export const getDetalleFactura = (id) => api.get(`/api/detallefactura/${id}`);
