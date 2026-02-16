import api from '../api/axiosInstance';

export const getMenus = (filtros = {}) => { 
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(
            ([_, value]) => value !== '' && value !== null && value !== undefined
        )
    );
    return api.get('/api/menu', { params: filtrosLimpios });
};

export const getMenuById = (id) =>
    api.get(`/api/menu/${id}`);

export const createMenu = (menuData) =>
    api.post('/api/menu', menuData);

export const updateMenu = (id, menuData) =>
    api.put(`/api/menu/${id}`, menuData);

export const deleteMenu = (id) =>
    api.delete(`/api/menu/${id}`);
