import { Navigate, Route, Routes, useLocation } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LibroListPage } from "./pages/LibroListPage";
import { LibroDetailPage } from "./pages/LibroDetailPage";
import { LibroFormPage } from "./pages/LibroFormPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { AdminPage } from "./pages/AdminUsersPage";

// Rutas donde la navbar estorba: son pantallas de acceso, no de trabajo.
const RUTAS_AUTH = ["/login", "/register"];

function App() {
  const { pathname } = useLocation();
  const enAuth = RUTAS_AUTH.includes(pathname);

  return (
    <AuthProvider>
      {!enAuth && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LibroListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/libros/new"
          element={
            <ProtectedRoute permiso="libro:create">
              <LibroFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/libros/:id"
          element={
            <ProtectedRoute permiso="libro:read">
              <LibroDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/libros/:id/editar"
          element={
            <ProtectedRoute permiso="libro:update">
              <LibroFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notificaciones"
          element={
            <ProtectedRoute permiso="notification:read">
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute permiso="user:read">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
