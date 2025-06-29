import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Usuario } from './Usuario';
  
  @Entity('tarefas')
  export class Tarefa {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column({ type: 'uuid', name: 'id_usuario' })
    idUsuario!: string;
  
    @Column({ type: 'varchar', length: 255, name: 'nome_usuario', nullable: true })
    nomeUsuario?: string;
  
    @Column({ type: 'varchar', length: 255 })
    nome!: string;
  
    @Column({ type: 'text', nullable: true })
    descricao?: string;
  
    @Column({ type: 'varchar', length: 50, default: 'pendente' })
    status!: 'pendente' | 'concluída';
  
    @Column({ type: 'varchar', length: 100, nullable: true })
    categoria?: string;
    
    @CreateDateColumn({ name: 'data_criacao' })
    dataCriacao!: Date;
    
    @Column({ type: 'timestamp', name: 'data_cumprimento', nullable: true })
    dataCumprimento?: Date;
  
    @UpdateDateColumn({ name: 'data_atualizacao' })
    dataAtualizacao!: Date;
  
    // Relacionamento Many-to-One com Usuario
    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuario' })
    usuario!: Usuario;
  }