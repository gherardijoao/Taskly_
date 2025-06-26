import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Usuario } from '../models/Usuario';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true, // Em produção, use migrations!
  logging: false,
  entities: [Usuario],
  migrations: ['src/database/migrations/**/*.ts'],
}); 