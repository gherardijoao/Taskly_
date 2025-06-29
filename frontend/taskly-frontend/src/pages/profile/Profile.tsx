import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiEdit2, FiSave, FiTrash2, FiX, FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import { userService } from '../../services/user.service';
import { authService } from '../../services/auth.service';
import './Profile.css';

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  const navigate = useNavigate();

  // Buscar o perfil do usuário quando o componente montar
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await userService.getProfile();
        setProfile(userData);
        setEditName(userData.nome);
        setEditEmail(userData.email);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setError('Não foi possível carregar seus dados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleEdit = () => {
    if (profile) {
      setEditName(profile.nome);
      setEditEmail(profile.email);
      setIsEditing(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleSave = async () => {
    try {
      setError('');
      
      // Validações
      if (!editName.trim()) {
        setError('O nome é obrigatório');
        return;
      }
      
      if (!editEmail.trim()) {
        setError('O email é obrigatório');
        return;
      }
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editEmail)) {
        setError('Digite um email válido');
        return;
      }
      
      // Validar senha
      if (newPassword) {
        if (!currentPassword) {
          setError('Digite sua senha atual para alterá-la');
          return;
        }
        
        if (newPassword.length < 8) {
          setError('A nova senha deve ter pelo menos 8 caracteres');
          return;
        }
        
        if (newPassword !== confirmPassword) {
          setError('As senhas não coincidem');
          return;
        }
      }
      
      // Construir objeto de atualização
      const updateData: {
        nome?: string;
        email?: string;
        senha?: string;
        senhaAtual?: string;
      } = {};
      
      if (profile?.nome !== editName) {
        updateData.nome = editName;
      }
      
      if (profile?.email !== editEmail) {
        updateData.email = editEmail;
      }
      
      if (newPassword) {
        updateData.senha = newPassword;
        updateData.senhaAtual = currentPassword;
      }
      
      // Se não houve alterações
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false);
        return;
      }
      
      // Enviar atualização
      setIsLoading(true);
      const updatedProfile = await userService.updateProfile(updateData);
      
      // Atualizar dados locais
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccessMessage('Perfil atualizado com sucesso!');
      
      // Limpar senha atual e nova
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Atualizar nome do usuário no localStorage se foi alterado
      if (updateData.nome) {
        const currentUser = authService.getUser();
        if (currentUser) {
          authService.setUser({
            ...currentUser,
            nome: updateData.nome
          });
        }
      }
      
      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err.message || 'Erro ao atualizar o perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDeleteConfirmation = () => {
    setIsDeleting(!isDeleting);
    setDeleteConfirmation('');
    setError('');
  };

  const handleDeleteAccount = async () => {
    try {
      if (deleteConfirmation !== 'EXCLUIR') {
        setError('Digite EXCLUIR para confirmar');
        return;
      }
      
      setIsLoading(true);
      await userService.deleteAccount();
      
      // Fazer logout e redirecionar para a página inicial
      authService.logout();
      navigate('/login', { state: { message: 'Sua conta foi excluída com sucesso' } });
      
    } catch (err: any) {
      console.error('Erro ao excluir conta:', err);
      setError(err.message || 'Erro ao excluir a conta');
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="profile-loading">
        <h2>Carregando seu perfil...</h2>
      </div>
    );
  }

  return (
    <motion.div 
      className="profile-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="profile-header" variants={itemVariants}>
        <button className="back-button" onClick={handleBack}>
          <FiArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <h1>Meu Perfil</h1>
      </motion.div>

      {error && (
        <motion.div 
          className="error-message"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}

      {successMessage && (
        <motion.div 
          className="success-message"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {successMessage}
        </motion.div>
      )}

      {isDeleting ? (
        <motion.div className="delete-confirmation" variants={itemVariants}>
          <div className="delete-warning">
            <FiAlertTriangle size={24} />
            <h3>Atenção: Esta ação é irreversível</h3>
          </div>
          <p>
            Ao excluir sua conta, todos os seus dados e tarefas serão permanentemente removidos 
            e não poderão ser recuperados. Tem certeza que deseja continuar?
          </p>
          
          <div className="confirmation-input">
            <label>Digite EXCLUIR para confirmar:</label>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="EXCLUIR"
            />
          </div>
          
          <div className="button-group">
            <button 
              className="cancel-button"
              onClick={handleToggleDeleteConfirmation}
            >
              <FiX size={18} />
              Cancelar
            </button>
            <button 
              className="delete-button"
              onClick={handleDeleteAccount}
              disabled={isLoading || deleteConfirmation !== 'EXCLUIR'}
            >
              <FiTrash2 size={18} />
              Excluir minha conta
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div className="profile-card" variants={itemVariants}>
          <div className="profile-avatar">
            <FiUser size={48} />
          </div>
          
          {isEditing ? (
            // Formulário de edição
            <div className="profile-edit-form">
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Seu email"
                  required
                />
              </div>
              
              <div className="password-section">
                <h3>Alterar senha (opcional)</h3>
                <div className="form-group">
                  <label>Senha atual</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Sua senha atual"
                  />
                </div>
                
                <div className="form-group">
                  <label>Nova senha</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nova senha"
                  />
                </div>
                
                <div className="form-group">
                  <label>Confirmar nova senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme a nova senha"
                  />
                </div>
              </div>
              
              <div className="button-group">
                <button 
                  className="cancel-button"
                  onClick={handleCancelEdit}
                >
                  <FiX size={18} />
                  Cancelar
                </button>
                <button 
                  className="save-button"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <FiSave size={18} />
                  Salvar alterações
                </button>
              </div>
            </div>
          ) : (
            // Visualização do perfil
            <>
              <div className="profile-info">
                <div className="info-group">
                  <label>Nome</label>
                  <p>{profile?.nome}</p>
                </div>
                
                <div className="info-group">
                  <label>Email</label>
                  <p>{profile?.email}</p>
                </div>
                
                <div className="info-group">
                  <label>Conta criada em</label>
                  <p>{profile ? formatDate(profile.dataCriacao) : ''}</p>
                </div>
                
                <div className="info-group">
                  <label>Última atualização</label>
                  <p>{profile ? formatDate(profile.dataAtualizacao) : ''}</p>
                </div>
              </div>
              
              <div className="button-group">
                <button 
                  className="edit-button"
                  onClick={handleEdit}
                >
                  <FiEdit2 size={18} />
                  Editar perfil
                </button>
                <button 
                  className="delete-button"
                  onClick={handleToggleDeleteConfirmation}
                >
                  <FiTrash2 size={18} />
                  Excluir conta
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Profile; 