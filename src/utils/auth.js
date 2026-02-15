export const getAuthUsuario = () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
};

export const isAuthenticated = () => !!localStorage.getItem('token');