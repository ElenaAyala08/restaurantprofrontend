import api from '../api/axiosInstance';

export const getMesas = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    return api.get('/mesas', {
        params: filtrosLimpios 
    });
};

export const getMesaById = (id) => api.get(`/mesas/${id}`);
export const createMesa = (mesaData) => api.post('/mesas', mesaData);
export const updateMesa = (id, mesaData) => api.put(`/mesas/${id}`, mesaData);
export const deleteMesa = (id) => api.delete(`/mesas/${id}`);
