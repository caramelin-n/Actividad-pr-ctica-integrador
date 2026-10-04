import { Navigate, Route, Routes, useLocation } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LibroListPage } from "./pages/LibroListPage";

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
