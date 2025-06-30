# Modelagem Entidade e Relacionamento

Este documento detalha o Modelo de Entidade e Relacionamento (MER) para a aplicação "Taskly", descrevendo as entidades (tabelas), seus atributos e os relacionamentos entre elas.

## 1. Descrição das Entidades (Tabelas)

### 1.1. Tabela `Usuario`

Responsável por armazenar as informações dos usuários do sistema.

* **`id`** (`UUID`, Chave Primária - PK): Identificador único universal do usuário. Gerado automaticamente.

* **`email`** (`VARCHAR(255)`, Único, Não Nulo): O endereço de e-mail do usuário. Cada e-mail deve ser único no sistema e é usado para login.

* **`nome`** (`VARCHAR(255)`, Não Nulo): O nome completo do usuário.

* **`senha`** (`VARCHAR(255)`, Não Nulo): A senha do usuário, armazenada em formato hash para segurança.

* **`data_criacao`** (`TIMESTAMP`, Não Nulo, Padrão: data/hora atual): Armazena o momento exato em que o registro do usuário foi criado.

* **`data_atualizacao`** (`TIMESTAMP`, Não Nulo, Padrão: data/hora atual): Armazena o último momento em que o registro do usuário foi atualizado.

### 1.2. Tabela `Tarefa`

Responsável por armazenar as tarefas criadas pelos usuários.

* **`id`** (`UUID`, Chave Primária - PK): Identificador único universal da tarefa. Gerado automaticamente.

* **`id_usuario`** (`UUID`, Chave Estrangeira - FK, Não Nulo): Referência ao `id` da tabela `Usuario`. Indica qual usuário é o proprietário da tarefa. É obrigatório que uma tarefa esteja associada a um usuário.

* **`nome`** (`VARCHAR(255)`, Não Nulo): O título ou nome curto da tarefa.

* **`descricao`** (`TEXT`, Pode ser Nulo): Uma descrição mais detalhada da tarefa.

* **`status`** (`VARCHAR(50)`, Não Nulo, Padrão: `'pendente'`): O estado atual da tarefa. Os valores permitidos são `'pendente'` ou `'concluída'`.

* **`categoria`** (`VARCHAR(100)`, Pode ser Nulo): Categoria ou tag para classificar e agrupar tarefas similares.

* **`data_criacao`** (`TIMESTAMP`, Não Nulo, Padrão: data/hora atual): Armazena o momento exato em que a tarefa foi criada.

* **`data_cumprimento`** (`TIMESTAMP`, Pode ser Nulo): Armazena a data em que a tarefa foi ou será cumprida. Utilizado principalmente para tarefas com status `'concluída'`.

* **`data_atualizacao`** (`TIMESTAMP`, Não Nulo, Padrão: data/hora atual): Armazena o último momento em que o registro da tarefa foi atualizado.

## 2. Relacionamento

Existe um relacionamento de **Um para Muitos (1:N)** entre `Usuario` e `Tarefa`:

* **Um `Usuario`** pode ter **zero ou muitas `Tarefas`** (cardinalidade 0..*)
* **Uma `Tarefa`** deve pertencer a **um e apenas um `Usuario`** (cardinalidade 1..1)

Este relacionamento é estabelecido pela Chave Estrangeira `id_usuario` na tabela `Tarefa`, que referencia a Chave Primária `id` na tabela `Usuario`. A cardinalidade 1..N significa que um usuário pode existir sem ter nenhuma tarefa associada, mas uma tarefa não pode existir sem estar associada a exatamente um usuário.

## 3. Mapeamento Objeto-Relacional (ORM)

O sistema utiliza TypeORM para mapear as entidades do banco de dados para objetos em TypeScript:

### 3.1. Classe `Usuario`

```typescript
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

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao!: Date;

  @UpdateDateColumn({ name: 'data_atualizacao' })
  dataAtualizacao!: Date;
}
```

### 3.2. Classe `Tarefa`

```typescript
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
  
  @Column({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
    name: 'data_cumprimento',
    nullable: true,
  })
  dataCumprimento?: Date;

  @UpdateDateColumn({ name: 'data_atualizacao' })
  dataAtualizacao!: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;
}
```

## 4. Observações Práticas de Implementação

### Campo `nome_usuario` na Tabela `Tarefa`

Embora não seja parte do modelo conceitual ER (pois representa redundância de dados), a implementação prática inclui o campo `nome_usuario` na tabela `Tarefa` por razões de conveniência:

* **Facilita consultas visuais** no banco de dados sem necessidade de joins
* **Melhora a legibilidade** ao visualizar registros de tarefas diretamente
* **Otimiza performance** para consultas que precisam exibir o nome do usuário junto com os dados da tarefa

Este é um exemplo de desnormalização controlada para fins práticos, embora conceitualmente o modelo ER puro não incluiria este campo.

## 5. Adaptações para Ambiente de Teste

Para compatibilidade com o banco de dados SQLite usado em testes:

* O campo `data_cumprimento` usa o tipo `datetime` em ambiente de teste (`NODE_ENV=test`) e `timestamp` em ambiente de produção/desenvolvimento.
* Esta adaptação é necessária porque o SQLite não suporta nativamente o tipo `timestamp` da mesma forma que o PostgreSQL.

Este documento serve como a base para a criação do seu banco de dados e para futuras referências sobre o esquema da aplicação.