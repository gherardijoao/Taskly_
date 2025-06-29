import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Auth.css';
import { userService } from '../../services/user.service';
import { authService } from '../../services/auth.service';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'fraca' | 'média' | 'forte' | ''>('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Verificar se o usuário já está autenticado
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Validador de senha
  const validatePassword = (password: string) => {
    const errors = [];
    let strength: '' | 'fraca' | 'média' | 'forte' = '';
    
    // Verificar comprimento mínimo
    if (password.length < 8) {
      errors.push('A senha deve ter pelo menos 8 caracteres');
    }
    
    // Verificar se tem pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }
    
    // Verificar se tem pelo menos uma letra minúscula
    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula');
    }
    
    // Verificar se tem pelo menos um número
    if (!/[0-9]/.test(password)) {
      errors.push('A senha deve conter pelo menos um número');
    }
    
    // Verificar se tem pelo menos um caractere especial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial');
    }
    
    // Definir força da senha
    if (errors.length === 0) {
      strength = 'forte';
    } else if (errors.length <= 2) {
      strength = 'média';
    } else {
      strength = 'fraca';
    }
    
    setPasswordErrors(errors);
    setPasswordStrength(password ? strength : '');
  };

  // Atualizar validação quando a senha mudar
  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    // Verificar se a senha atende aos requisitos mínimos
    if (passwordStrength === 'fraca') {
      setError('Sua senha é muito fraca. Clique no campo de senha para ver os requisitos.');
      return;
    }
    
    setIsLoading(true);

    try {
      // Usar o serviço de usuário para registrar
      await userService.register({
        nome: name.trim(),
        email: email.trim(),
        senha: password
      });
      
      // Redirecionar diretamente para login sem alerta
      navigate('/login', { state: { message: 'Cadastro realizado com sucesso!' } });
    } catch (err: any) {
      console.error('Erro no registro:', err);
      setError(err.message || 'Erro ao registrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
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
      transition: { duration: 0.3 }
    }
  };

  // Função para obter a cor do indicador de força da senha
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'fraca':
        return '#ff4d4d';
      case 'média':
        return '#ffcc00';
      case 'forte':
        return '#4caf50';
      default:
        return '#e0e0e0';
    }
  };

  // Função para gerar os requisitos da senha em texto único
  const getPasswordRequirementsText = () => {
    if (passwordErrors.length === 0) return '';
    
    // Requisitos comuns que podem faltar
    const requirements = [];
    if (password.length < 8) requirements.push('8+ caracteres');
    if (!/[A-Z]/.test(password)) requirements.push('letra maiúscula');
    if (!/[a-z]/.test(password)) requirements.push('letra minúscula');
    if (!/[0-9]/.test(password)) requirements.push('número');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) requirements.push('caractere especial');
    
    if (requirements.length === 0) return '';
    
    return `Requisitos: ${requirements.join(', ')}`;
  };

  return (
    <motion.div 
      className="auth-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="logo" variants={itemVariants}>TASKLY</motion.h1>
      <motion.p className="subtitle" variants={itemVariants}>
        Cadastre-se para ter acesso completo à plataforma
      </motion.p>

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

      <motion.form 
        onSubmit={handleSubmit} 
        className="auth-form"
        variants={itemVariants}
      >
        <motion.div className="form-group" variants={itemVariants}>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            required
          />
        </motion.div>

        <motion.div className="form-group" variants={itemVariants}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />
        </motion.div>

        <motion.div className="form-group" variants={itemVariants}>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
            onFocus={() => setShowPasswordHints(true)}
            onBlur={() => setShowPasswordHints(false)}
          />
          {password && (
            <div className="password-strength-container">
              <div className="password-strength-text">
                Força: <span style={{ color: getStrengthColor() }}>{passwordStrength}</span>
              </div>
              <div className="password-strength-bar">
                <div 
                  className="password-strength-fill" 
                  style={{
                    width: passwordStrength === 'forte' ? '100%' : passwordStrength === 'média' ? '50%' : '20%',
                    backgroundColor: getStrengthColor()
                  }}
                />
              </div>
            </div>
          )}
          {showPasswordHints && passwordErrors.length > 0 && (
            <div className="password-requirements-inline">
              {getPasswordRequirementsText()}
            </div>
          )}
        </motion.div>

        <motion.div className="form-group" variants={itemVariants}>
          <label htmlFor="confirmPassword">Confirme sua senha</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Digite novamente sua senha"
            required
          />
        </motion.div>

        <motion.button 
          type="submit" 
          disabled={isLoading}
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </motion.button>
      </motion.form>

      <motion.p className="auth-link" variants={itemVariants}>
        Já tem uma conta?{' '}
        <Link to="/login">Entrar</Link>
      </motion.p>
    </motion.div>
  );
};

export default Register; 