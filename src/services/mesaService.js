import api from '../api/axiosInstance';

export const getMesas = (filtros = {}) => {

    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(
            ([_, value]) =>
                value !== '' &&
                value !== null &&
                value !== undefined
        )
    );

    return api.get('/api/mesas', {
        params: filtrosLimpios
    });
};

export const getMesaById = (id) => api.get(`/api/mesas/${id}`);
export const createMesa = (mesaData) => api.post('/api/mesas', mesaData);
export const updateMesa = (id, mesaData) => api.put(`/api/mesas/${id}`, mesaData);
export const deleteMesa = (id) => api.delete(`/api/mesas/${id}`);
