import api from '../api/axiosInstance';

export const getCategorias = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    return api.get('/categorias', {
        params: filtrosLimpios 
    });
};

export const getCategoriaById = (id) => api.get(`/categorias/${id}`);
export const createCategoria = (categoriaData) => api.post('/categorias', categoriaData);
export const updateCategoria = (id, categoriaData) => api.put(`/categorias/${id}`, categoriaData);
export const deleteCategoria = (id) => api.delete(`/categorias/${id}`);
