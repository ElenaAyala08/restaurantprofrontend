import api from '../api/axiosInstance';

export const getMenus = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    return api.get('/menu', {
        params: filtrosLimpios 
    });
};

export const getMenuById = (id) => api.get(`/menu/${id}`);
export const createMenu = (menuData) => api.post('/menu', menuData);
export const updateMenu = (id, menuData) => api.put(`/menu/${id}`, menuData);
export const deleteMenu = (id) => api.delete(`/menu/${id}`);
