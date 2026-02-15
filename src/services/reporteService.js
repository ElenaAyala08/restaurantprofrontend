import api from '../api/axiosInstance';

export const getReportes = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    return api.get('/reportes', {
        params: filtrosLimpios 
    });
};

export const getReporteById = (id) => api.get(`/reportes/${id}`);
export const createReporte = (reporteData) => api.post('/reportes', reporteData);
export const updateReporte = (id, reporteData) => api.put(`/reportes/${id}`, reporteData);
export const deleteReporte = (id) => api.delete(`/reportes/${id}`);
