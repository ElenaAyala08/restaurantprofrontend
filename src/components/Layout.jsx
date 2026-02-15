import { Outlet, Link, useLocation } from 'react-router-dom';
import { getAuthUsuario, isAuthenticated } from '../utils/auth';
import { useState, useEffect, Fragment } from 'react';
const Layout = () => {
  const [usuario, setUsuario] = useState(getAuthUsuario());
  const [auth, setAuth] = useState(isAuthenticated());
  const location = useLocation();
  useEffect(() => {
    setUsuario(getAuthUsuario());
    setAuth(isAuthenticated());
  }, [location]);
  const links = [
    { to: "/usuario/changepassword", label: "Cambiar password", roles: ['Administrador', 'Cocinero', 'Mesero'] },
    { to: "/menu", label: "Menú", roles: ['Administrador', 'Cocinero', 'Mesero'] },
    { to: "/pedidos", label: "Pedidos", roles: ['Administrador', 'Cocinero', 'Mesero'] },
    { to: "/mesas", label: "Mesas", roles: ['Administrador', 'Mesero'] },
    { to: "/factura", label: "Facturación", roles: ['Administrador', 'Mesero'] },
    { to: "/usuario", label: "Usuarios", roles: ['Administrador'] },
    { to: "/categoria", label: "Categorías", roles: ['Administrador'] },
    { to: "/reporte", label: "Reportes", roles: ['Administrador'] },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <nav className="flex gap-4 container mx-auto">
          <Link to="/" className="hover:underline">Home</Link>|
          {auth ? (
            <Link to="/usuario/login" className="hover:underline">
              Cerrar sesión
            </Link>
          ) : (
            <Link to="/usuario/login" className="hover:underline">
              Iniciar sesión
            </Link>
          )}
          {links
            .filter(link => link.roles.includes(usuario?.rol)) // Filtramos por rol
            .map((link) => (
              <Fragment key={link.to}>
                {" | "}
                <Link to={link.to} className="hover:underline">
                  {link.label}
                </Link>
              </Fragment>
            ))
          }


        </nav>
      </header>
      <main className="flex-grow container mx-auto p-6">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2026 Mi Aplicación React</p>
      </footer>
    </div>
  );
};

export default Layout;