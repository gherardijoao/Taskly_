import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FiX, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import { taskService } from '../services/task.service';
import type { CreateTaskDTO } from '../types/task.types';
import './AddTaskModal.css';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

const AddTaskModal = ({ isOpen, onClose, onTaskAdded }: AddTaskModalProps) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [dataCumprimento, setDataCumprimento] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const newCategoryInputRef = useRef<HTMLInputElement>(null);

  // Obter a data de hoje formatada para o input date
  const getTodayFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Carregar categorias existentes
  useEffect(() => {
    if (isOpen) {
      const loadCategories = async () => {
        try {
          const summary = await taskService.getTaskSummary();
          const categories = Object.keys(summary.porCategoria).filter(
            category => category !== 'null' && category !== 'undefined' && category !== 'Sem categoria'
          );
          setAvailableCategories(categories);
        } catch (error) {
          console.error('Erro ao carregar categorias:', error);
        }
      };
      
      loadCategories();
      
      // Resetar o formulário quando abrir o modal
      setTaskName('');
      setTaskDescription('');
      setTaskCategory('');
      setDataCumprimento('');
      setNewCategoryName('');
      setIsNewCategory(false);
      setError('');
      
      // Focar no campo de nome quando o modal abrir
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Focar no campo de nova categoria quando ele aparece
  useEffect(() => {
    if (isNewCategory && newCategoryInputRef.current) {
      setTimeout(() => {
        newCategoryInputRef.current?.focus();
      }, 100);
    }
  }, [isNewCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim()) {
      setError('Nome da tarefa é obrigatório');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const categoria = isNewCategory ? newCategoryName.trim() : taskCategory;
      
      const newTask: CreateTaskDTO = {
        nome: taskName.trim(),
        descricao: taskDescription.trim() || undefined,
        categoria: categoria || undefined,
        status: 'pendente',
        dataCumprimento: dataCumprimento || undefined
      };

      await taskService.createTask(newTask);
      
      // Notificar componente pai e fechar modal
      onTaskAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      setError('Erro ao criar tarefa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'nova') {
      setIsNewCategory(true);
      setTaskCategory('');
    } else {
      setIsNewCategory(false);
      setTaskCategory(value);
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

  const newCategoryVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.2
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
            className="add-task-modal"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Nova Tarefa</h2>
              <button className="close-button" onClick={onClose} aria-label="Fechar">
                <FiX size={20} />
              </button>
            </div>

            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <h3>Nome da Tarefa</h3>
                  <p>Dê um nome claro e objetivo para sua tarefa</p>
                  <input
                    id="taskName"
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Ex: Finalizar relatório mensal"
                    disabled={isLoading}
                    ref={nameInputRef}
                  />
                </div>

                <div className="form-group">
                  <h3>Descrição</h3>
                  <p>Adicione detalhes sobre o que precisa ser feito</p>
                  <textarea
                    id="taskDescription"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Ex: Incluir dados de vendas e análise de desempenho"
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
                      id="dataCumprimento"
                      type="date"
                      value={dataCumprimento}
                      onChange={(e) => setDataCumprimento(e.target.value)}
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
                    id="taskCategory"
                    value={isNewCategory ? 'nova' : taskCategory}
                    onChange={handleCategoryChange}
                    disabled={isLoading}
                  >
                    <option value="">Selecione uma categoria</option>
                    {availableCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="nova">+ Nova categoria</option>
                  </select>
                </div>

                <AnimatePresence>
                  {isNewCategory && (
                    <motion.div 
                      className="form-group new-category-field"
                      variants={newCategoryVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h3>Nova Categoria</h3>
                      <p>Crie uma nova categoria para organizar suas tarefas</p>
                      <input
                        id="newCategory"
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Ex: Projetos Pessoais"
                        disabled={isLoading}
                        ref={newCategoryInputRef}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <div className="error-message">
                    <FiAlertCircle size={16} style={{ marginRight: '8px' }} />
                    {error}
                  </div>
                )}

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isLoading || (isNewCategory && !newCategoryName.trim())}
                  >
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal; 