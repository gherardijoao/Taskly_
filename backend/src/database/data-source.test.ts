import { DataSource } from 'typeorm';
import { Usuario } from '../models/Usuario';
import { Tarefa } from '../models/Tarefa';

export const TestDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [Usuario, Tarefa],
  synchronize: true,
  dropSchema: true,
  logging: false
});

// Executar uma query para desabilitar a verificação de chaves estrangeiras no SQLite
export const disableForeignKeysCheck = async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.query('PRAGMA foreign_keys = OFF;');
  }
};

export const initializeTestDataSource = async () => {
  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
    await disableForeignKeysCheck();
  }
  return TestDataSource;
};

export const closeTestDataSource = async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
};

export const clearDatabase = async () => {
  if (TestDataSource.isInitialized) {
    const entities = TestDataSource.entityMetadatas;
    
    for (const entity of entities) {
      const repository = TestDataSource.getRepository(entity.name);
      await repository.clear();
    }
  }
};

describe('TestDataSource', () => {
  it('should be defined', () => {
    expect(TestDataSource).toBeDefined();
  });
}); 