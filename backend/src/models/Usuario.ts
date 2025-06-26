import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  @Column({ type: 'varchar', length: 255 })
  senha!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'data_criacao' })
  dataCriacao!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'data_atualizacao' })
  dataAtualizacao!: Date;
} 