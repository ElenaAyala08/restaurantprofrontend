import api from '../api/axiosInstance';

export const getCategorias = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    return api.get('/api/categorias', {
        params: filtrosLimpios 
    });
};

export const getCategoriaById = (id) => api.get(`/api/categorias/${id}`);
export const createCategoria = (categoriaData) => api.post('/api/categorias', categoriaData);
export const updateCategoria = (id, categoriaData) => api.put(`/api/categorias/${id}`, categoriaData);
export const deleteCategoria = (id) => api.delete(`/api/categorias/${id}`);
