import { AppDataSource } from './data-source';
import { Tarefa } from '../models/Tarefa';
import { Usuario } from '../models/Usuario';

export async function updateExistingTasks() {
  try {
    console.log('🔄 Atualizando tarefas existentes...');
    
    // Buscar todas as tarefas que não têm nome_usuario
    const tarefas = await AppDataSource.getRepository(Tarefa)
      .createQueryBuilder('tarefa')
      .leftJoin('tarefa.usuario', 'usuario')
      .select(['tarefa.id', 'tarefa.idUsuario', 'usuario.nome'])
      .where('tarefa.nomeUsuario IS NULL')
      .getMany();
    
    console.log(`📋 Encontradas ${tarefas.length} tarefas para atualizar`);
    
    // Atualizar cada tarefa
    for (const tarefa of tarefas) {
      if (tarefa.usuario?.nome) {
        await AppDataSource.getRepository(Tarefa)
          .update(tarefa.id, { nomeUsuario: tarefa.usuario.nome });
        console.log(`✅ Tarefa ${tarefa.id} atualizada com nome: ${tarefa.usuario.nome}`);
      } else {
        console.log(`⚠️ Tarefa ${tarefa.id} não tem usuário associado`);
      }
    }
    
    console.log('🎉 Atualização concluída!');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar tarefas:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  updateExistingTasks();
} 