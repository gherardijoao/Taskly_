import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AppDataSource } from './database/data-source';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { setupSwagger } from './swagger';
import { updateExistingTasks, updateTarefasTable } from './database/update-existing-tasks';

const app = express();
const PORT = process.env.PORT || 3000;

setupSwagger(app);

// Configurações de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Necessário para o Swagger UI
      scriptSrc: ["'self'", "'unsafe-inline'"], // Necessário para o Swagger UI
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Necessário para o Swagger UI
}));

// Enable CORS for all requests
app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(authRoutes);
app.use(taskRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Banco de dados conectado');
    
    try {
      // Atualizar tarefas existentes
      await updateExistingTasks();
      
      // Atualizar estrutura da tabela de tarefas
      await updateTarefasTable();
    } catch (error) {
      console.error('❌ Erro ao atualizar o banco de dados:', error);
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar no banco:', err);
});