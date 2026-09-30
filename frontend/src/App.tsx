import { Navigate, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LibroListPage } from "./pages/LibroListPage";
import { LibroDetailPage } from "./pages/LibroDetailPage";
import { LibroFormPage } from "./pages/LibroFormPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { AdminPage } from "./pages/AdminUsersPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* El orden importa: "/libros/new" tiene que declararse antes que
            "/libros/:id", si no React Router matchea "new" como un id. */}
        <Route
          path="/libros/new"
          element={
            <ProtectedRoute>
              <LibroFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/libros/:id"
          element={
            <ProtectedRoute>
              <LibroDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notificaciones"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LibroListPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
