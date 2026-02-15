import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';

// Componentes Base
import Layout from './components/Layout';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

// --- USUARIOS (Carpeta Usuarios) ---
import UsuarioPage from './pages/Usuarios/UsuarioPage';
import CreateUsuarioPage from './pages/Usuarios/CreateUsuarioPage';
import EditUsuarioPage from './pages/Usuarios/EditUsuarioPage';
import LoginUsuarioPage from './pages/Usuarios/LoginUsuarioPage';
import ChangePasswordUsuarioPage from './pages/Usuarios/ChangePasswordUsuarioPage';

// --- CATEGORIA (Carpeta Categoria) ---
import CategoriaPage from './pages/Categoria/CategoriaPage';
import CreateCategoriaPage from './pages/Categoria/CreateCategoriaPage';
import EditCategoriaPage from './pages/Categoria/EditCategoriaPage';

// --- FACTURA (Carpeta Factura) ---
import FacturaPage from './pages/Factura/FacturaPage';
import CreateFacturaPage from './pages/Factura/CreateFacturaPage';
import EditFacturaPage from './pages/Factura/EditFacturaPage';

// --- MENU (Carpeta Menu) ---
import MenuPage from './pages/Menu/MenuPage';
import CreateMenuPage from './pages/Menu/CreateMenuPage';
import EditMenuPage from './pages/Menu/EditMenuPage';

// --- MESAS (Carpeta Mesas) ---
import MesaPage from './pages/Mesas/MesaPage';
import CreateMesaPage from './pages/Mesas/CreateMesaPage';
import EditMesaPage from './pages/Mesas/EditMesaPage';

// --- PEDIDOS (Carpeta Pedidos) ---
import PedidoPage from './pages/Pedidos/PedidoPage';
import CreatePedidoPage from './pages/Pedidos/CreatePedidoPage';
import EditPedidoPage from './pages/Pedidos/EditPedidoPage';

// --- REPORTE (Carpeta Reporte) ---
import ReportePage from './pages/Reporte/ReportePage';
import CreateReportePage from './pages/Reporte/CreateReportePage';
import EditReportePage from './pages/Reporte/EditReportePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          
          {/* --- RUTAS PÚBLICAS --- */}
          <Route index element={<Home />} />
          <Route path="/usuario/login" element={<LoginUsuarioPage />} />

          {/* --- RUTAS PROTEGIDAS: Administrador, Cocinero, Mesero --- */}
          <Route element={<ProtectedRoute allowedRoles={['Administrador', 'Cocinero', 'Mesero']} />}>
            <Route path="/usuario/changepassword" element={<ChangePasswordUsuarioPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/pedidos" element={<PedidoPage />} />
          </Route>

          {/* --- RUTAS PROTEGIDAS: Administrador, Mesero --- */}
          <Route element={<ProtectedRoute allowedRoles={['Administrador', 'Mesero']} />}>
            <Route path="/pedidos/create" element={<CreatePedidoPage />} />
            <Route path="/pedidos/edit/:id" element={<EditPedidoPage />} />
            <Route path="/mesas" element={<MesaPage />} />
            <Route path="/mesas/create" element={<CreateMesaPage />} />
            <Route path="/mesas/edit/:id" element={<EditMesaPage />} />
            <Route path="/factura" element={<FacturaPage />} />
            <Route path="/factura/create" element={<CreateFacturaPage />} />
            <Route path="/factura/edit/:id" element={<EditFacturaPage />} />
          </Route>

          {/* --- RUTAS PROTEGIDAS: Solo Administrador --- */}
          <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
            {/* Gestión de Usuarios */}
            <Route path="/usuario" element={<UsuarioPage />} />
            <Route path="/usuario/create" element={<CreateUsuarioPage />} />
            <Route path="/usuario/edit/:id" element={<EditUsuarioPage />} />

            {/* Gestión de Menú y Categorías */}
            <Route path="/menu/create" element={<CreateMenuPage />} />
            <Route path="/menu/edit/:id" element={<EditMenuPage />} />
            <Route path="/categoria" element={<CategoriaPage />} />
            <Route path="/categoria/create" element={<CreateCategoriaPage />} />
            <Route path="/categoria/edit/:id" element={<EditCategoriaPage />} />

            {/* Reportes */}
            <Route path="/reporte" element={<ReportePage />} />
            <Route path="/reporte/create" element={<CreateReportePage />} />
            <Route path="/reporte/edit/:id" element={<EditReportePage />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;