import { AppDataSource } from './data-source';

/**
 * Este script é executado para atualizar tarefas existentes antes da implementação de nomeUsuario
 */
export async function updateExistingTasks() {
  try {
    // Verifica se a conexão já está inicializada
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Conexão com o banco de dados estabelecida');
    }

    // Verifica se a coluna nomeUsuario existe
    const nomeUsuarioExists = await AppDataSource.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='tarefas' AND column_name='nome_usuario'
    `);

    if (nomeUsuarioExists.length === 0) {
      console.log('Coluna nome_usuario não existe na tabela tarefas. Nada a fazer.');
      return;
    }

    // Busca tarefas sem nome de usuário
    const tarefasSemNome = await AppDataSource.query(`
      SELECT t.id, t.id_usuario, u.nome as nome_usuario
      FROM tarefas t
      JOIN usuarios u ON t.id_usuario = u.id
      WHERE t.nome_usuario IS NULL OR t.nome_usuario = ''
    `);

    if (tarefasSemNome.length === 0) {
      console.log('Não há tarefas sem nome de usuário. Nada a fazer.');
      return;
    }

    console.log(`Encontradas ${tarefasSemNome.length} tarefas sem nome de usuário.`);

    // Atualiza cada tarefa
    for (const tarefa of tarefasSemNome) {
      await AppDataSource.query(`
        UPDATE tarefas
        SET nome_usuario = $1
        WHERE id = $2
      `, [tarefa.nome_usuario, tarefa.id]);
    }

    console.log('Atualização de tarefas concluída com sucesso.');
  } catch (error) {
    console.error('Erro ao atualizar tarefas:', error);
  }
}

/**
 * Este script adiciona as novas colunas 'categoria' e 'data_cumprimento' à tabela de tarefas
 */
export async function updateTarefasTable() {
  try {
    // Verifica se a conexão já está inicializada
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Conexão com o banco de dados estabelecida');
    }

    // Verifica se a coluna 'categoria' já existe
    const categoriaExists = await AppDataSource.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='tarefas' AND column_name='categoria'
    `);

    if (categoriaExists.length === 0) {
      console.log('Adicionando coluna categoria à tabela tarefas');
      await AppDataSource.query(`
        ALTER TABLE tarefas 
        ADD COLUMN categoria VARCHAR(100) NULL
      `);
      console.log('Coluna categoria adicionada com sucesso');
    } else {
      console.log('Coluna categoria já existe');
    }

    // Verifica se a coluna 'data_cumprimento' já existe
    const dataCumprimentoExists = await AppDataSource.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='tarefas' AND column_name='data_cumprimento'
    `);

    if (dataCumprimentoExists.length === 0) {
      console.log('Adicionando coluna data_cumprimento à tabela tarefas');
      await AppDataSource.query(`
        ALTER TABLE tarefas 
        ADD COLUMN data_cumprimento TIMESTAMP NULL
      `);
      console.log('Coluna data_cumprimento adicionada com sucesso');
      
      // Atualiza data_cumprimento para tarefas já concluídas
      console.log('Atualizando data_cumprimento para tarefas concluídas');
      await AppDataSource.query(`
        UPDATE tarefas 
        SET data_cumprimento = data_atualizacao 
        WHERE status = 'concluída' AND data_cumprimento IS NULL
      `);
      console.log('Data de cumprimento atualizada para tarefas concluídas');
    } else {
      console.log('Coluna data_cumprimento já existe');
    }

    console.log('Atualização da tabela de tarefas concluída com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar a tabela de tarefas:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  (async () => {
    try {
      await AppDataSource.initialize();
      await updateExistingTasks();
      await updateTarefasTable();
    } catch (error) {
      console.error('Erro durante a atualização:', error);
    } finally {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log('Conexão com o banco de dados encerrada');
      }
    }
  })();
} 