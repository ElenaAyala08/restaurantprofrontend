import { Navigate, Outlet } from 'react-router-dom';
import { getAuthUsuario, isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ allowedRoles }) => {
    const usuario = getAuthUsuario();
    const auth = isAuthenticated();
    if (!auth) {
        return <Navigate to="/usuario/login" replace />;
    }  
    if (allowedRoles && !allowedRoles.includes(usuario?.rol)) {
        return <Navigate to="/usuario/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;