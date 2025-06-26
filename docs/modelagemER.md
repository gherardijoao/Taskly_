# Modelagem Entidade e Relacionamento

Este documento detalha o Modelo de Entidade e Relacionamento (MER) para a aplicação "Taskly", descrevendo as entidades (tabelas), seus atributos e os relacionamentos entre elas.

## 1. Descrição das Entidades (Tabelas)

### 1.1. Tabela `Usuario`

Responsável por armazenar as informações dos usuários do sistema.

* **`id`** (`UUID`, Chave Primária - PK): Identificador único universal do usuário. Gerado automaticamente.

* **`email`** (`VARCHAR(255)`, Único, Não Nulo): O endereço de e-mail do usuário. Cada e-mail deve ser único no sistema e é usado para login.

* **`nome`** (`VARCHAR(255)`, Não Nulo): O nome completo do usuário.

* **`senha`** (`VARCHAR(255)`, Não Nulo): A senha do usuário, armazenada em formato hash para segurança.

* **`data_criacao`** (`TIMESTAMP WITH TIME ZONE`, Não Nulo, Padrão: data/hora atual): Armazena o momento exato em que o registro do usuário foi criado.

* **`data_atualizacao`** (`TIMESTAMP WITH TIME ZONE`, Não Nulo, Padrão: data/hora atual): Armazena o último momento em que o registro do usuário foi atualizado.

### 1.2. Tabela `Tarefa`

Responsável por armazenar as tarefas criadas pelos usuários.

* **`id`** (`UUID`, Chave Primária - PK): Identificador único universal da tarefa. Gerado automaticamente.

* **`id_usuario`** (`UUID`, Chave Estrangeira - FK, Não Nulo): Referência ao `id` da tabela `Usuario`. Indica qual usuário é o proprietário da tarefa. É obrigatório que uma tarefa esteja associada a um usuário.

* **`nome`** (`VARCHAR(255)`, Não Nulo): O título ou nome curto da tarefa.

* **`descricao`** (`TEXT`, Pode ser Nulo): Uma descrição mais detalhada da tarefa.

* **`status`** (`VARCHAR(50)`, Não Nulo, Padrão: `'pendente'`): O estado atual da tarefa. Os valores permitidos são `'pendente'` ou `'concluída'`.

* **`data_criacao`** (`TIMESTAMP WITH TIME ZONE`, Não Nulo, Padrão: data/hora atual): Armazena o momento exato em que a tarefa foi criada.

* **`data_atualizacao`** (`TIMESTAMP WITH TIME ZONE`, Não Nulo, Padrão: data/hora atual): Armazena o último momento em que o registro da tarefa foi atualizado.

## 2. Relacionamento

Existe um relacionamento de **Um para Muitos (1:N)** entre `Usuario` e `Tarefa`:

* **Um `Usuario`** pode ter **zero ou muitas `Tarefas`**.

* **Uma `Tarefa`** deve pertencer a **um e apenas um `Usuario`**.

Este relacionamento é estabelecido pela Chave Estrangeira `id_usuario` na tabela `Tarefa`, que referencia a Chave Primária `id` na tabela `Usuario`.

Este documento serve como a base para a criação do seu banco de dados e para futuras referências sobre o esquema da aplicação.