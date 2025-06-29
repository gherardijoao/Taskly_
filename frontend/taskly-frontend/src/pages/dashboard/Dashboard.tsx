import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import PageTransition from '../../components/PageTransition';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar perfil do usuário');
        }

        const userData = await response.json();
        setUserName(userData.nome);
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        // If token is invalid, redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <h2>Carregando...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>TASKLY</h1>
        <div className="user-info">
          <span>Bem-vindo, {userName}</span>
          <button onClick={handleLogout} className="logout-button">Sair</button>
        </div>
      </header>

      <div className="dashboard-content">
        <h2>Suas Tarefas</h2>
        <p>Funcionalidade de gerenciamento de tarefas em breve!</p>
      </div>
    </div>
  );
};

export default Dashboard; 