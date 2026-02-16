import api from '../api/axiosInstance';

export const getReportes = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    return api.get('/api/reportes', {
        params: filtrosLimpios 
    });
};

export const getReporteById = (id) => api.get(`/api/reportes/${id}`);
export const createReporte = (reporteData) => api.post('/api/reportes', reporteData);
export const updateReporte = (id, reporteData) => api.put(`/api/reportes/${id}`, reporteData);
export const deleteReporte = (id) => api.delete(`/api/reportes/${id}`);
