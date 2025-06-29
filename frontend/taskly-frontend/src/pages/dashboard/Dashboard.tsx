import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiFilter, FiCheck, FiCircle, FiCalendar, FiUser, FiBookOpen, FiBriefcase, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import './Dashboard.css';

interface Task {
  id: string;
  nome: string;
  descricao?: string;
  status: 'pendente' | 'concluída';
  dataCriacao: string;
  tag?: string;
}

const Dashboard = () => {
  const [userName, setUserName] = useState('João');
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      nome: 'Estudar matemática discreta',
      status: 'pendente',
      dataCriacao: '2024-06-20',
      tag: 'Estudos'
    },
    {
      id: '2',
      nome: 'Finalizar projeto React',
      status: 'pendente',
      dataCriacao: '2024-06-21',
      tag: 'Trabalho'
    },
    {
      id: '3',
      nome: 'Revisar código do backend',
      status: 'pendente',
      dataCriacao: '2024-06-22',
      tag: 'Trabalho'
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [totalTaskCount, setTotalTaskCount] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Fechar o menu quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getGreeting = () => {
    const now = new Date();
    // Ajusta para o fuso horário de São Paulo (GMT-3)
    const spHour = now.getHours();
    
    if (spHour >= 5 && spHour < 12) {
      return 'Bom dia';
    } else if (spHour >= 12 && spHour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    return `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
      setGreeting(getGreeting());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileClick = () => {
    // Esta é uma função temporária para implementação futura
    console.log('Perfil clicado - funcionalidade em breve');
    // Navegará para a página de perfil no futuro
    // navigate('/profile');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: 'pendente' | 'concluída') => {
    const newStatus = currentStatus === 'pendente' ? 'concluída' : 'pendente';
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    if (newStatus === 'concluída') {
      setCompletedTaskCount(prev => prev + 1);
    } else {
      setCompletedTaskCount(prev => prev - 1);
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => getTaskTag(task) === category).length;
  };

  const getTaskTag = (task: Task) => {
    if (task.nome.toLowerCase().includes('estudar') || task.nome.toLowerCase().includes('matemática')) return 'Estudos';
    if (task.nome.toLowerCase().includes('projeto') || task.nome.toLowerCase().includes('react') || task.nome.toLowerCase().includes('código') || task.nome.toLowerCase().includes('backend')) return 'Trabalho';
    return 'Pessoal';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <h2>Carregando...</h2>
      </div>
    );
  }

  return (
    <motion.div 
      className="dashboard-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Menu para dispositivos móveis - só será visível em mobile devido ao CSS */}
      <div className="mobile-menu-container">
        <div className="mobile-logo">TASKLY</div>
        <button 
          className={`hamburger-button ${mobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu} 
          aria-label="Menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div 
        ref={mobileMenuRef}
        className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
      >
        <ul className="mobile-menu-items">
          <li className="mobile-menu-item" onClick={handleProfileClick}>
            <FiUser size={18} />
            <span>Meu Perfil</span>
          </li>
          <li className="mobile-menu-item" onClick={handleLogout}>
            <FiLogOut size={18} />
            <span>Sair</span>
          </li>
        </ul>
      </div>

      {/* Sidebar para desktop - será oculta em mobile devido ao CSS */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h1 className="logo-menu">TASKLY</h1>
          <p className="sidebar-subtitle">Organize suas demandas</p>
        </div>
        
        <motion.div variants={itemVariants} className="sidebar-section">
          <h3 className="section-title">VISÃO GERAL</h3>
          <ul className="sidebar-menu">
            <li className="menu-item active">
              <div className="menu-item-content">
                <FiCalendar className="menu-icon" />
                <span>Todas as Tarefas</span>
              </div>
              <span className="task-count">{totalTaskCount}</span>
            </li>
            <li className="menu-item">
              <div className="menu-item-content">
                <FiCalendar className="menu-icon" />
                <span>Hoje</span>
              </div>
              <span className="task-count">0</span>
            </li>
          </ul>
        </motion.div>
        
        <motion.div variants={itemVariants} className="sidebar-section">
          <div className="section-header">
            <h3 className="section-title">GRUPOS</h3>
            <button className="add-group-btn">
              <FiPlus size={14} />
            </button>
          </div>
          <ul className="sidebar-menu">
            <li className="menu-item">
              <div className="menu-item-content">
                <FiBookOpen className="menu-icon" />
                <span>Estudos</span>
              </div>
              <span className="task-count">{getTasksByCategory('Estudos')}</span>
            </li>
            <li className="menu-item">
              <div className="menu-item-content">
                <FiBriefcase className="menu-icon" />
                <span>Trabalho</span>
              </div>
              <span className="task-count">{getTasksByCategory('Trabalho')}</span>
            </li>
            <li className="menu-item">
              <div className="menu-item-content">
                <FiUser className="menu-icon" />
                <span>Pessoal</span>
              </div>
              <span className="task-count">{getTasksByCategory('Pessoal')}</span>
            </li>
          </ul>
        </motion.div>
        
        <motion.div variants={itemVariants} className="sidebar-section user-profile-section">
          <h3 className="section-title">USUÁRIO</h3>
          <ul className="sidebar-menu">
            <li className="menu-item" onClick={handleProfileClick}>
              <div className="menu-item-content">
                <FiUser className="menu-icon" />
                <span>Meu Perfil</span>
              </div>
            </li>
            <li className="menu-item" onClick={handleLogout}>
              <div className="menu-item-content">
                <FiLogOut className="menu-icon" />
                <span>Sair</span>
              </div>
            </li>
          </ul>
        </motion.div>
        
        <motion.div variants={itemVariants} className="progress-section">
          <div className="progress-header">
            <span>Progresso</span>
            <span className="progress-percentage">{Math.round((completedTaskCount / totalTaskCount) * 100) || 0}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(completedTaskCount / totalTaskCount) * 100}%` }}
            />
          </div>
          <div className="progress-text">
            {completedTaskCount} de {totalTaskCount} tarefas concluídas
          </div>
        </motion.div>
      </div>

      <div className="dashboard-main">
        <motion.div variants={itemVariants} className="main-header">
          <div className="greeting-section">
            <h1 className="greeting">{greeting}, {userName}</h1>
            <div className="date-time">
              <span className="date">{getCurrentDate()}</span>
              <span className="time">{currentTime}</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="filter-btn">
              <FiFilter size={16} />
              <span>Filtrar</span>
            </button>
            <motion.button 
              className="add-task-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus size={16} />
              <span>Adicionar Tarefa</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="tasks-section">
          <div className="tasks-header">
            <h2 className="tasks-title">Todas as Tarefas</h2>
            <span className="tasks-count">{totalTaskCount} tarefas</span>
          </div>
          
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
              className="search-input"
            />
          </div>

          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="no-tasks">
                {searchQuery ? 'Nenhuma tarefa encontrada' : 'Você ainda não tem tarefas'}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <motion.div 
                  key={task.id} 
                  className={`task-item ${task.status === 'concluída' ? 'completed' : ''}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  layout
                >
                  <div 
                    className="task-checkbox"
                    onClick={() => toggleTaskStatus(task.id, task.status)}
                  >
                    {task.status === 'concluída' ? (
                      <FiCheck className="check-icon" />
                    ) : (
                      <FiCircle className="circle-icon" />
                    )}
                  </div>
                  <div className="task-content">
                    <h3 className="task-title">{task.nome}</h3>
                    <span className="task-date">
                      Criada em {new Date(task.dataCriacao).toLocaleDateString('pt-BR', { 
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                  <div className={`task-tag ${getTaskTag(task).toLowerCase()}`}>
                    {getTaskTag(task)}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;