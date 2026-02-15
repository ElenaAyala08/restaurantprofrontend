import api from '../api/axiosInstance';

export const getUsuario = (filtros) => {
    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    return api.get('/api/usuario', {
        params: filtrosLimpios 
    });
};
export const getUsuarioById = (id)=> api.get(`/api/usuario/${id}`);
export const createUsuario = (usuarioData)=> api.post('/api/usuario', usuarioData);
export const updateUsuario = (id, usuarioData)=> api.put(`/api/usuario/${id}`, usuarioData);
export const loginUsuario = (usuarioData)=> api.post('/api/usuario/login', usuarioData);
export const changePasswordUsuario = (id, usuarioData)=> api.put(`/api/usuario/${id}/change-password`, usuarioData);