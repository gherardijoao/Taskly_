import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiCheck, FiCircle, FiCalendar, FiUser, FiBookOpen, FiBriefcase, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import './Dashboard.css';
import type { Task } from '../../types/task.types';
import { authService } from '../../services/auth.service';
import { taskService } from '../../services/task.service';
import AddTaskModal from '../../components/AddTaskModal';
import TaskDetailModal from '../../components/TaskDetailModal';
import TaskAdvisor from '../../components/TaskAdvisor';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [totalTaskCount, setTotalTaskCount] = useState(0);
  const [todayTaskCount, setTodayTaskCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tasksByCategory, setTasksByCategory] = useState<Record<string, number>>({});
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'today' | 'pending' | 'completed' | string>('all');
  
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Verificar autenticação e carregar dados do usuário
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const user = authService.getUserName();
    setUserName(user || 'Usuário');
  }, [navigate]);

  // Carregar tarefas e resumo
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        
        // Carregar todas as tarefas
        const tasksData = await taskService.getAllTasks();
        
        // Adaptar para o formato esperado pelo componente
        const adaptedTasks: Task[] = tasksData.map(task => ({
          id: task.id,
          nome: task.nome,
          descricao: task.descricao,
          status: task.status,
          dataCriacao: task.dataCriacao,
          dataCumprimento: task.dataCumprimento,
          dataAtualizacao: task.dataAtualizacao,
          categoria: task.categoria
        }));
        
        setTasks(adaptedTasks);
        
        // Carregar resumo para estatísticas
        const summary = await taskService.getTaskSummary();
        setCompletedTaskCount(summary.concluidas);
        setTotalTaskCount(summary.total);
        setTasksByCategory(summary.porCategoria);
        
        // Carregar contador de tarefas de hoje
        const todayTasks = await taskService.getTodayTasks();
        setTodayTaskCount(todayTasks.length);
        
        // Extrair categorias disponíveis do resumo
        const categories = Object.keys(summary.porCategoria).filter(
          category => category !== 'null' && category !== 'undefined' && category !== 'Sem categoria'
        );
        setAvailableCategories(categories);
        
        // Definir a seção ativa como 'all' ao carregar inicialmente
        setActiveSection('all');
        
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (authService.isAuthenticated()) {
      loadTasks();
    }
  }, []);

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
    authService.logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: 'pendente' | 'concluída') => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      const newStatus = currentStatus === 'pendente' ? 'concluída' : 'pendente';
      
      // Atualizar localmente para feedback imediato
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { 
            ...task, 
            status: newStatus,
            dataCumprimento: newStatus === 'concluída' ? new Date().toISOString() : undefined,
            dataAtualizacao: new Date().toISOString()
          } : task
        )
      );

      if (newStatus === 'concluída') {
        setCompletedTaskCount(prev => prev + 1);
      } else {
        setCompletedTaskCount(prev => prev - 1);
      }
      
      // Enviar para o backend
      await taskService.updateTask(taskId, { status: newStatus });
      
      // Atualizar resumo
      const summary = await taskService.getTaskSummary();
      setCompletedTaskCount(summary.concluidas);
      setTasksByCategory(summary.porCategoria);
      
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
      // Reverter em caso de erro
      setTasks(prevTasks => [...prevTasks]);
      // Recarregar dados
      const tasksData = await taskService.getAllTasks();
      setTasks(tasksData.map(task => ({
        id: task.id,
        nome: task.nome,
        descricao: task.descricao,
        status: task.status,
        dataCriacao: task.dataCriacao,
        dataCumprimento: task.dataCumprimento,
        dataAtualizacao: task.dataAtualizacao,
        categoria: task.categoria
      })));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // Se a busca estiver vazia, carrega todas as tarefas
      const tasksData = await taskService.getAllTasks();
      setTasks(tasksData.map(task => ({
        id: task.id,
        nome: task.nome,
        descricao: task.descricao,
        status: task.status,
        dataCriacao: task.dataCriacao,
        dataCumprimento: task.dataCumprimento,
        dataAtualizacao: task.dataAtualizacao,
        categoria: task.categoria
      })));
      return;
    }
    
    try {
      setIsLoading(true);
      const searchResults = await taskService.searchTasks(searchQuery);
      setTasks(searchResults.map(task => ({
        id: task.id,
        nome: task.nome,
        descricao: task.descricao,
        status: task.status,
        dataCriacao: task.dataCriacao,
        dataCumprimento: task.dataCumprimento,
        dataAtualizacao: task.dataAtualizacao,
        categoria: task.categoria
      })));
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar tarefas localmente baseado na busca
  const filteredTasks = searchQuery.trim() === '' 
    ? tasks 
    : tasks.filter(task => 
        task.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const getTasksByCategory = (category: string) => {
    return tasksByCategory[category] || 0;
  };

  const getTaskTag = (task: Task) => {
    // Se a tarefa já tem categoria definida, use-a
    if (task.categoria) return task.categoria;
    
    // Caso contrário, infere baseado no nome (compatibilidade com código anterior)
    if (task.nome.toLowerCase().includes('estudar') || task.nome.toLowerCase().includes('matemática')) return 'Estudos';
    if (task.nome.toLowerCase().includes('projeto') || task.nome.toLowerCase().includes('react') || task.nome.toLowerCase().includes('código') || task.nome.toLowerCase().includes('backend')) return 'Trabalho';
    return 'Pessoal';
  };

  const loadTasksByCategory = async (category: string) => {
    try {
      setIsLoading(true);
      const categoryTasks = await taskService.getTasksByCategory(category);
      setTasks(categoryTasks.map(task => ({
        id: task.id,
        nome: task.nome,
        descricao: task.descricao,
        status: task.status,
        dataCriacao: task.dataCriacao,
        dataCumprimento: task.dataCumprimento,
        dataAtualizacao: task.dataAtualizacao,
        categoria: task.categoria
      })));
      
      // Atualizar a seção ativa para a categoria selecionada
      setActiveSection(category);
    } catch (error) {
      console.error(`Erro ao carregar tarefas da categoria ${category}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTodayTasks = async () => {
    try {
      setIsLoading(true);
      const todayTasks = await taskService.getTodayTasks();
      setTasks(todayTasks.map(task => ({
        id: task.id,
        nome: task.nome,
        descricao: task.descricao,
        status: task.status,
        dataCriacao: task.dataCriacao,
        dataCumprimento: task.dataCumprimento,
        dataAtualizacao: task.dataAtualizacao,
        categoria: task.categoria
      })));
      
      // Atualizar a seção ativa para 'today'
      setActiveSection('today');
    } catch (error) {
      console.error('Erro ao carregar tarefas de hoje:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllTasks = async () => {
    try {
      setIsLoading(true);
      const tasksData = await taskService.getAllTasks();
      setTasks(tasksData.map(task => ({
        id: task.id,
        nome: task.nome,
        descricao: task.descricao,
        status: task.status,
        dataCriacao: task.dataCriacao,
        dataCumprimento: task.dataCumprimento,
        dataAtualizacao: task.dataAtualizacao,
        categoria: task.categoria
      })));
      
      // Atualizar a seção ativa para 'all'
      setActiveSection('all');
    } catch (error) {
      console.error('Erro ao carregar todas as tarefas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = () => {
    setIsAddTaskModalOpen(true);
  };

  const handleTaskAdded = async () => {
    try {
      setIsLoading(true);
      
      // Recarregar tarefas
      const tasksData = await taskService.getAllTasks();
      setTasks(tasksData.map(task => ({
        id: task.id,
        nome: task.nome,
        descricao: task.descricao,
        status: task.status,
        dataCriacao: task.dataCriacao,
        dataCumprimento: task.dataCumprimento,
        dataAtualizacao: task.dataAtualizacao,
        categoria: task.categoria
      })));
      
      // Atualizar resumo
      const summary = await taskService.getTaskSummary();
      setCompletedTaskCount(summary.concluidas);
      setTotalTaskCount(summary.total);
      setTasksByCategory(summary.porCategoria);
      
      // Atualizar contador de tarefas de hoje
      const todayTasks = await taskService.getTodayTasks();
      setTodayTaskCount(todayTasks.length);
      
      // Atualizar categorias disponíveis
      const categories = Object.keys(summary.porCategoria).filter(
        category => category !== 'null' && category !== 'undefined' && category !== 'Sem categoria'
      );
      setAvailableCategories(categories);
    } catch (error) {
      console.error('Erro ao recarregar tarefas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailModalOpen(true);
  };

  const handleTaskUpdated = async () => {
    // Recarregar as tarefas e estatísticas após uma atualização
    await handleTaskAdded(); // Reutiliza a função existente que já faz isso
  };

  const handleTaskDeleted = async () => {
    // Recarregar as tarefas e estatísticas após uma exclusão
    await handleTaskAdded(); // Reutiliza a função existente que já faz isso
    setSelectedTaskId(null);
  };

  const loadTasksByStatus = async (status: 'pendente' | 'concluída') => {
    try {
      setIsLoading(true);
      const allTasks = await taskService.getAllTasks();
      const filteredTasks = allTasks.filter(task => task.status === status);
      
      setTasks(filteredTasks.map(task => ({
        id: task.id,
        nome: task.nome,
        descricao: task.descricao,
        status: task.status,
        dataCriacao: task.dataCriacao,
        dataCumprimento: task.dataCumprimento,
        dataAtualizacao: task.dataAtualizacao,
        categoria: task.categoria
      })));
      
      // Atualizar a seção ativa para o status selecionado
      setActiveSection(status === 'pendente' ? 'pending' : 'completed');
    } catch (error) {
      console.error(`Erro ao carregar tarefas ${status}:`, error);
    } finally {
      setIsLoading(false);
    }
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

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    
    // Se vier no formato 'YYYY-MM-DD', tratar manualmente para evitar erro de fuso horário
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      // Retornar diretamente no formato DD/MM/YYYY sem criar objeto Date
      return `${Number(day)}/${Number(month)}/${year}`;
    }
    
    // Para datas em formato ISO (com timestamp)
    if (dateStr.includes('T')) {
      const [datePart] = dateStr.split('T');
      const [year, month, day] = datePart.split('-');
      return `${Number(day)}/${Number(month)}/${year}`;
    }
    
    // Fallback para outros formatos
    try {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateStr; // Retorna a string original se não conseguir formatar
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
      {/* Modal de adicionar tarefa */}
      <AddTaskModal 
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskAdded={handleTaskAdded}
      />

      {/* Modal de detalhes da tarefa */}
      <TaskDetailModal
        isOpen={isTaskDetailModalOpen}
        onClose={() => setIsTaskDetailModalOpen(false)}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
        taskId={selectedTaskId || undefined}
      />

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
        
        <div className="sidebar-sections-container">
          <motion.div variants={itemVariants} className="sidebar-section">
            <h3 className="section-title">VISÃO GERAL</h3>
            <ul className="sidebar-menu">
              <li 
                className={`menu-item ${activeSection === 'all' ? 'active' : ''}`} 
                onClick={loadAllTasks}
              >
                <div className="menu-item-content">
                  <FiCalendar className="menu-icon" />
                  <span>Todas as Tarefas</span>
                </div>
                <span className="task-count">{totalTaskCount}</span>
              </li>
              <li 
                className={`menu-item ${activeSection === 'today' ? 'active' : ''}`} 
                onClick={loadTodayTasks}
              >
                <div className="menu-item-content">
                  <FiCalendar className="menu-icon" />
                  <span>Hoje</span>
                </div>
                <span className="task-count">{todayTaskCount}</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="sidebar-section">
            <h3 className="section-title">STATUS</h3>
            <ul className="sidebar-menu">
              <li 
                className={`menu-item ${activeSection === 'pending' ? 'active' : ''}`} 
                onClick={() => loadTasksByStatus('pendente')}
                data-status="pending"
              >
                <div className="menu-item-content">
                  <FiCircle className="menu-icon status-icon" />
                  <span>Pendentes</span>
                </div>
                <span className="task-count">{totalTaskCount - completedTaskCount}</span>
              </li>
              <li 
                className={`menu-item ${activeSection === 'completed' ? 'active' : ''}`} 
                onClick={() => loadTasksByStatus('concluída')}
                data-status="completed"
              >
                <div className="menu-item-content">
                  <FiCheck className="menu-icon status-icon" />
                  <span>Concluídas</span>
                </div>
                <span className="task-count">{completedTaskCount}</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="sidebar-section">
            <div className="section-header">
              <h3 className="section-title">CATEGORIAS</h3>
              <button className="add-group-btn">
                <FiPlus size={14} />
              </button>
            </div>
            <ul className="sidebar-menu">
              {availableCategories.length > 0 ? (
                availableCategories.map((category) => (
                  <li 
                    key={category} 
                    className={`menu-item ${activeSection === category ? 'active' : ''}`}
                    onClick={() => loadTasksByCategory(category)}
                  >
                    <div className="menu-item-content">
                      {category === 'Estudos' ? (
                        <FiBookOpen className="menu-icon" />
                      ) : category === 'Trabalho' ? (
                        <FiBriefcase className="menu-icon" />
                      ) : (
                        <FiUser className="menu-icon" />
                      )}
                      <span>{category}</span>
                    </div>
                    <span className="task-count">{getTasksByCategory(category)}</span>
                  </li>
                ))
              ) : (
                <li className="menu-item-empty">
                  <span>Nenhuma categoria disponível</span>
                </li>
              )}
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
        </div>
        
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
            <motion.button 
              className="add-task-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddTask}
            >
              <FiPlus size={16} />
              <span>Adicionar Tarefa</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="tasks-section">
          <div className="tasks-header">
            <h2 className="tasks-title">
              {activeSection === 'all' ? 'Todas as Tarefas' : 
               activeSection === 'today' ? 'Tarefas de Hoje' : 
               activeSection === 'pending' ? 'Tarefas Pendentes' :
               activeSection === 'completed' ? 'Tarefas Concluídas' :
               `Tarefas: ${activeSection}`}
            </h2>
            <span className="tasks-count">
              {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
            </span>
          </div>
          
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
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
                  onClick={() => handleTaskClick(task.id)}
                >
                  <div 
                    className="task-checkbox"
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar que o clique no checkbox abra o modal
                      toggleTaskStatus(task.id, task.status);
                    }}
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
                      Criada em {formatDate(task.dataCriacao)}
                      {task.dataCumprimento && (
                        <>
                          {' '}• Cumprir até: {formatDate(task.dataCumprimento)}
                        </>
                      )}
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

      <TaskAdvisor />
    </motion.div>
  );
};

export default Dashboard;