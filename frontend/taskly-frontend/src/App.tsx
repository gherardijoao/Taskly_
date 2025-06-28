import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import PageTransition from './components/PageTransition';

// AnimatePresence wrapper component to access location
function AnimatedRoutes() {
  const location = useLocation();

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Componente para rotas protegidas
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rota padrão redireciona para login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Rotas de autenticação */}
        <Route 
          path="/login" 
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          } 
        />
        
        {/* Rota protegida para o dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </ProtectedRoute>
          } 
        />
        
        {/* Rota para página não encontrada */}
        <Route 
          path="*" 
          element={
            <PageTransition>
              <div>Página não encontrada</div>
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
