import React, { useState } from 'react';
import { FiMessageSquare, FiX, FiZap } from 'react-icons/fi';
import suggestionService from '../services/suggestion.service';
import './TaskAdvisor.css';

interface TaskSuggestion {
  dicas: string[];
  resumo: string;
}

const TaskAdvisor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preferencias, setPreferencias] = useState('');
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
    setCategoria('');
    setPreferencias('');
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
      const result = await suggestionService.getSuggestion({
        context: context.trim(),
        categoria: categoria.trim() || undefined,
        preferencias: preferencias.trim() || undefined
      });

      setSuggestion(result);
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar sugestão. Tente novamente.');
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

                <div className="task-advisor-form-group">
                  <label htmlFor="categoria">Categoria (opcional)</label>
                  <select
                    id="categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    <option value="">Qualquer categoria</option>
                    <option value="Trabalho">Trabalho</option>
                    <option value="Estudos">Estudos</option>
                    <option value="Pessoal">Pessoal</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Casa">Casa</option>
                    <option value="Lazer">Lazer</option>
                  </select>
                </div>

                <div className="task-advisor-form-group">
                  <label htmlFor="preferencias">Preferências (opcional)</label>
                  <input
                    id="preferencias"
                    type="text"
                    value={preferencias}
                    onChange={(e) => setPreferencias(e.target.value)}
                    placeholder="Ex: dicas rápidas, foco em motivação, sugestões para procrastinação..."
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
                  Gerando sugestão personalizada...
                </div>
              )}

              {suggestion && (
                <div className={`task-advisor-result ${suggestion ? 'show' : ''}`}>
                  <h3>Dicas para completar sua tarefa</h3>
                  <ul style={{ margin: '0 0 16px 0', paddingLeft: 20 }}>
                    {suggestion.dicas.map((dica, idx) => (
                      <li key={idx} style={{ marginBottom: 8, color: '#fff' }}>{dica}</li>
                    ))}
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