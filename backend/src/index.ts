import 'dotenv/config';
import express from 'express';
import { AppDataSource } from './database/data-source';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { setupSwagger } from './swagger';
import { updateExistingTasks } from './database/update-existing-tasks';

const app = express();
const PORT = process.env.PORT || 3000;

setupSwagger(app);

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
    
    // Atualizar tarefas existentes
    await updateExistingTasks();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar no banco:', err);
  });