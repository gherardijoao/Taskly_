import React, { useState } from 'react';
import { FiMessageSquare, FiX, FiZap } from 'react-icons/fi';
import { TaskAdvisorService } from '../services/task-advisor.service';
import type { TaskSuggestion } from '../services/task-advisor.service';
import './TaskAdvisor.css';
import { motion, AnimatePresence } from 'framer-motion';

const TaskAdvisor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState('');
  const [suggestion, setSuggestion] = useState<TaskSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpen = () => {
    setIsOpen(true);
    setSuggestion(null);
    setError('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setContext('');
    setSuggestion(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!context.trim()) {
      setError('Por favor, descreva o contexto da sua tarefa.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuggestion(null);

    try {
      const result = await TaskAdvisorService.generateAdvice(context.trim());
      setSuggestion(result);
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar conselhos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="task-advisor-container">
        <button 
          className="task-advisor-button" 
          onClick={handleOpen}
          title="Consultor de Tarefas"
        >
          <FiZap />
        </button>
      </div>

      {isOpen && (
        <div className="task-advisor-modal" onClick={handleClose}>
          <div className="task-advisor-content" onClick={(e) => e.stopPropagation()}>
            <div className="task-advisor-header">
              <h2>
                <FiMessageSquare style={{ marginRight: '8px' }} />
                Consultor de Tarefas
              </h2>
              <button className="task-advisor-close" onClick={handleClose}>
                <FiX />
              </button>
            </div>

            <div className="task-advisor-body">
              <form className="task-advisor-form" onSubmit={handleSubmit}>
                <div className="task-advisor-form-group">
                  <label htmlFor="context">Contexto da Tarefa *</label>
                  <textarea
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Descreva o que você quer fazer ou qual é o seu objetivo..."
                    required
                  />
                </div>

                {error && <div className="task-advisor-error">{error}</div>}

                <div className="task-advisor-actions">
                  <button 
                    type="button" 
                    className="task-advisor-button-secondary"
                    onClick={handleClose}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="task-advisor-button-primary"
                    disabled={isLoading || !context.trim()}
                  >
                    {isLoading ? 'Gerando...' : 'Gerar Conselhos'}
                  </button>
                </div>
              </form>

              {isLoading && (
                <div className="task-advisor-loading">
                  Gerando conselhos personalizados...
                </div>
              )}

              {suggestion && (
                <div className={`task-advisor-result ${suggestion ? 'show' : ''}`}>
                  <h3>Dicas para completar sua tarefa</h3>
                  <ul className="task-advisor-bullet-list">
                    <AnimatePresence>
                      {suggestion.dicas.map((dica, idx) => (
                        <motion.li
                          className="task-advisor-bullet-item"
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ delay: 0.08 * idx, duration: 0.5, type: 'spring', stiffness: 60 }}
                        >
                          <span className="bullet-dot" />
                          <span>{dica}</span>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <div className="suggestion-summary" style={{ color: '#bbb', fontStyle: 'italic', marginBottom: 8 }}>
                    {suggestion.resumo}
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '0.9rem', color: '#888' }}>
                    💡 Essas dicas foram geradas por IA. Use-as como inspiração para avançar na sua tarefa!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskAdvisor; 