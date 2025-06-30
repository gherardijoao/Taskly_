import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FiX, FiAlertCircle, FiCalendar, FiCheck, FiTrash2, FiEdit2, FiSave, FiCircle } from 'react-icons/fi';
import { taskService } from '../services/task.service';
import type { Task, UpdateTaskDTO } from '../types/task.types';
import './TaskDetailModal.css';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
  onTaskDeleted?: () => void;
  taskId?: string;
}

const TaskDetailModal = ({ isOpen, onClose, onTaskUpdated, onTaskDeleted, taskId }: TaskDetailModalProps) => {
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  // Estados para edição
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Obter a data de hoje formatada para o input date
  const getTodayFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Formatar data para exibição
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não definida';
    // Se vier no formato 'YYYY-MM-DD' ou 'YYYY-MM-DD HH:mm:ss.sss', extrair só a parte da data
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      return `${day}/${month}/${year}`;
    }
    // Caso contrário, usar o método padrão
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Carregar dados da tarefa e categorias disponíveis
  useEffect(() => {
    if (isOpen && taskId) {
      const loadTaskAndCategories = async () => {
        setIsLoading(true);
        try {
          // Carregar detalhes da tarefa
          const taskData = await taskService.getTaskById(taskId);
          setTask(taskData);
          
          // Inicializar estados de edição
          setEditedName(taskData.nome);
          setEditedDescription(taskData.descricao || '');
          setEditedCategory(taskData.categoria || '');
          setEditedDueDate(taskData.dataCumprimento || '');
          
          // Carregar categorias disponíveis
          const summary = await taskService.getTaskSummary();
          const categories = Object.keys(summary.porCategoria).filter(
            category => category !== 'null' && category !== 'undefined' && category !== 'Sem categoria'
          );
          setAvailableCategories(categories);
        } catch (error) {
          console.error('Erro ao carregar tarefa:', error);
          setError('Não foi possível carregar os detalhes da tarefa.');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadTaskAndCategories();
    }
  }, [isOpen, taskId]);

  // Focar no campo de nome quando entrar no modo de edição
  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!task) return;
    
    if (!editedName.trim()) {
      setError('Nome da tarefa é obrigatório');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const updatedTask: UpdateTaskDTO = {
        nome: editedName.trim(),
        descricao: editedDescription.trim() || undefined,
        categoria: editedCategory || undefined,
        dataCumprimento: editedDueDate || undefined
      };

      await taskService.updateTask(task.id, updatedTask);
      
      // Atualizar a tarefa local
      const refreshedTask = await taskService.getTaskById(task.id);
      setTask(refreshedTask);
      
      // Sair do modo de edição
      setIsEditing(false);
      
      // Notificar componente pai
      onTaskUpdated();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      setError('Erro ao atualizar tarefa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!task) return;

    setIsLoading(true);
    try {
      const newStatus = task.status === 'pendente' ? 'concluída' : 'pendente';
      await taskService.updateTask(task.id, { status: newStatus });
      
      // Atualizar a tarefa local
      const refreshedTask = await taskService.getTaskById(task.id);
      setTask(refreshedTask);
      
      // Notificar componente pai
      onTaskUpdated();
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
      setError('Erro ao atualizar status da tarefa.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    setIsDeleting(true);
    try {
      await taskService.deleteTask(task.id);
      
      // Fechar modal e notificar componente pai
      onClose();
      if (onTaskDeleted) {
        onTaskDeleted();
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      setError('Erro ao excluir tarefa.');
      setIsDeleting(false);
    }
  };

  // Variantes de animação para o modal slide-in da direita
  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants: Variants = {
    hidden: { x: '100%', opacity: 0.5 },
    visible: { 
      x: '0%', 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        damping: 30, 
        stiffness: 300 
      } 
    },
    exit: { 
      x: '100%', 
      opacity: 0, 
      transition: { 
        duration: 0.3 
      } 
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div 
            className="task-detail-modal"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{isEditing ? 'Editar Tarefa' : 'Detalhes da Tarefa'}</h2>
              <button className="close-button" onClick={onClose} aria-label="Fechar">
                <FiX size={20} />
              </button>
            </div>

            <div className="modal-content">
              {isLoading && !task ? (
                <div className="loading-container">
                  <p>Carregando...</p>
                </div>
              ) : task ? (
                <>
                  <div className="task-status-badge" data-status={task.status}>
                    {task.status === 'concluída' ? 'Concluída' : 'Pendente'}
                  </div>
                  
                  {isEditing ? (
                    // Modo de edição
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                      <div className="form-group">
                        <h3>Nome da Tarefa</h3>
                        <p>Dê um nome claro e objetivo para sua tarefa</p>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Nome da tarefa"
                          disabled={isLoading}
                          ref={nameInputRef}
                        />
                      </div>

                      <div className="form-group">
                        <h3>Descrição</h3>
                        <p>Adicione detalhes sobre o que precisa ser feito</p>
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          placeholder="Descrição da tarefa (opcional)"
                          disabled={isLoading}
                          rows={3}
                        />
                      </div>

                      <div className="form-group">
                        <h3>Data de Cumprimento</h3>
                        <p>Defina quando esta tarefa deve ser concluída</p>
                        <div className="date-input-container">
                          <FiCalendar className="date-icon" />
                          <input
                            type="date"
                            value={editedDueDate}
                            onChange={(e) => setEditedDueDate(e.target.value)}
                            min={getTodayFormatted()}
                            disabled={isLoading}
                            className="date-input"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <h3>Categoria</h3>
                        <p>Organize suas tarefas por categorias</p>
                        <select
                          value={editedCategory}
                          onChange={(e) => setEditedCategory(e.target.value)}
                          disabled={isLoading}
                        >
                          <option value="">Sem categoria</option>
                          {availableCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      {error && (
                        <div className="error-message">
                          <FiAlertCircle size={16} style={{ marginRight: '8px' }} />
                          {error}
                        </div>
                      )}
                    </form>
                  ) : (
                    // Modo de visualização
                    <div className="task-details">
                      <div className="detail-group">
                        <h3>Nome</h3>
                        <p className="detail-value">{task.nome}</p>
                      </div>
                      
                      {task.descricao && (
                        <div className="detail-group">
                          <h3>Descrição</h3>
                          <p className="detail-value description">{task.descricao}</p>
                        </div>
                      )}
                      
                      <div className="detail-group">
                        <h3>Categoria</h3>
                        <p className="detail-value">
                          {task.categoria || 'Sem categoria'}
                        </p>
                      </div>
                      
                      <div className="detail-group">
                        <h3>Data de Criação</h3>
                        <p className="detail-value">{formatDate(task.dataCriacao)}</p>
                      </div>
                      
                      <div className="detail-group">
                        <h3>Data de Cumprimento</h3>
                        <p className="detail-value">{formatDate(task.dataCumprimento)}</p>
                      </div>
                      
                      <div className="detail-group">
                        <h3>Última Atualização</h3>
                        <p className="detail-value">{formatDate(task.dataAtualizacao)}</p>
                      </div>
                      
                      {error && (
                        <div className="error-message">
                          <FiAlertCircle size={16} style={{ marginRight: '8px' }} />
                          {error}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="error-container">
                  <FiAlertCircle size={24} />
                  <p>Tarefa não encontrada ou erro ao carregar.</p>
                </div>
              )}
            </div>

            {task && (
              <div className="modal-actions">
                {isEditing ? (
                  <>
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      className="submit-button"
                      onClick={handleSave}
                      disabled={isLoading || !editedName.trim()}
                    >
                      {isLoading ? 'Salvando...' : (
                        <>
                          <FiSave size={16} style={{ marginRight: '8px' }} />
                          Salvar Alterações
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      type="button" 
                      className="delete-button"
                      onClick={handleDelete}
                      disabled={isLoading || isDeleting}
                    >
                      {isDeleting ? 'Excluindo...' : (
                        <>
                          <FiTrash2 size={16} style={{ marginRight: '8px' }} />
                          Excluir
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="status-button"
                      onClick={handleToggleStatus}
                      disabled={isLoading}
                    >
                      {task.status === 'pendente' ? (
                        <>
                          <FiCheck size={16} style={{ marginRight: '8px' }} />
                          Marcar como Concluída
                        </>
                      ) : (
                        <>
                          <FiCircle size={16} style={{ marginRight: '8px' }} />
                          Marcar como Pendente
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="edit-button"
                      onClick={() => setIsEditing(true)}
                      disabled={isLoading}
                    >
                      <FiEdit2 size={16} style={{ marginRight: '8px' }} />
                      Editar
                    </button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailModal; 