![Brain Agriculture Logo](https://github.com/user-attachments/assets/e0adb880-1f82-49bc-a076-5b2110d3696b)

# Brain Agriculture

Este projeto é um teste técnico desenvolvido para a **Brain Agriculture**. Ele consiste em uma API backend que gerencia produtores rurais, fazendas e suas respectivas culturas.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no lado do servidor.
- **Docker**: Utilizado para criar ambientes isolados e consistentes.
- **Prisma**: ORM para o gerenciamento e consulta ao banco de dados.
- **Fastify**: Framework web rápido e leve para Node.js.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes requisitos instalados:

- [Node.js](https://nodejs.org/pt/download/package-manager)
- [Docker](https://www.docker.com/)

## Configuração e Execução da API

Para rodar o projeto localmente, siga os passos abaixo:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/brain-agriculture.git
   cd brain-agriculture
   ```

2. **Suba os serviços do Docker**:
   ```bash
   docker-compose up -d
   ```

3. **Instale as dependências**:
   ```bash
   npm install
   ```

4. **Realize as migrações do banco de dados**:
   ```bash
   npx prisma migrate deploy
   ```

5. **Execute o servidor**:
   ```bash
   npm run dev
   ```

## Endpoints da API

### Produtores Rurais

#### Listar Produtores Rurais

**Descrição**: Recupera uma lista de produtores rurais cadastrados.

- **Rota**: `GET /farmer`
- **Parâmetros de Query Opcionais**:
  - `cpfCnpj`: Filtra os fazendeiros pelo CPF ou CNPJ.
  - `state`: Filtra os fazendeiros por estado.
  - `is_active`: Filtra por fazendeiros ativos ou inativos.
  - `page`: Define a página de resultados (padrão é 1).
  - `limit`: Define o limite de resultados por página (padrão é 100).
- **Exemplo de Resposta**:
  ```json
  [
    {
        "cpf_cnpj": "568.219.950-28",
        "name": "lucas",
        "email": "string@teste.com",
        "state": "ce",
        "city": "string",
        "address": "string",
        "is_active": false,
        "last_modified_by": "string",
        "created_at": "2024-09-04T12:58:20.832Z",
        "updated_at": "2024-09-04T14:59:26.723Z",
        "farms": [
            {
                "id": 1,
                "name": "Fazenda Nova",
                "farmer_cpf_cnpj": "568.219.950-28",
                "state": "SP",
                "city": "Ribeirão Preto",
                "address": "Estrada da Fazenda, Km 10",
                "total_area": "250",
                "arable_area": "200",
                "vegetation_area": "50",
                "is_active": true,
                "last_modified_by": "Lucas",
                "created_at": "2024-09-04T13:00:01.571Z",
                "updated_at": "2024-09-04T13:34:17.397Z",
                "CultureByFarm": [
                    {
                        "id": 1,
                        "farm_id": 1,
                        "culture_id": 1,
                        "planted_area": "50",
                        "last_modified_by": "Lucas",
                        "created_at": "2024-09-04T13:00:01.571Z",
                        "updated_at": "2024-09-04T13:34:17.397Z",
                        "culture": {
                            "id": 1,
                            "type": "Soja",
                            "subtype": "Convencional",
                            "last_modified_by": "Lucas",
                            "created_at": "2024-09-04T09:58:50.270Z",
                            "updated_at": "2024-09-04T09:58:46.369Z"
                        }
                    },
                    {
                        "id": 2,
                        "farm_id": 1,
                        "culture_id": 2,
                        "planted_area": "50",
                        "last_modified_by": "Lucas",
                        "created_at": "2024-09-04T13:00:01.571Z",
                        "updated_at": "2024-09-04T13:34:17.397Z",
                        "culture": {
                            "id": 2,
                            "type": "Soja",
                            "subtype": "RR",
                            "last_modified_by": "Lucas",
                            "created_at": "2024-09-04T09:59:13.718Z",
                            "updated_at": "2024-09-04T09:59:08.354Z"
                        }
                    }
                ]
            }
        ]
    }
  ]
  ```

#### Cadastrar Produtor Rural

**Descrição**: Cadastra um novo produtor rural no sistema.

- **Rota**: `POST /farmer`
- **Corpo da Requisição**:
  ```json
  {
    "cpfCnpj": "56821995028",
    "name": "João Silva",
    "email": "joao@silva.com",
    "state": "CE",
    "city": "Fortaleza",
    "address": "Rua Exemplo, 123",
    "user": "admin"
  }
  ```

#### Editar Produtor Rural

**Descrição**: Edita as informações de um produtor rural existente.

- **Rota**: `PATCH /farmer`
- **Corpo da Requisição**:
  ```json
  {
    "cpfCnpj": "56821995028",
    "name": "João Silva Atualizado",
    "email": "joao@silva.com",
    "state": "CE",
    "city": "Fortaleza",
    "address": "Rua Exemplo, 123",
    "user": "admin"
  }
  ```

#### Excluir Produtor Rural

**Descrição**: Exclui (desativa) um produtor rural.

- **Rota**: `DELETE /farmer`
- **Exemplo de Requisição**:
  ```
  DELETE /farmer?cpfCnpj=56821995028
  ```

**Observação**: Em vez de deletar o registro, o status `is_active` é atualizado para `false`, mantendo o histórico do produtor no sistema.

### Fazendas

#### Listar Fazendas

**Descrição**: Recupera uma lista de fazendas cadastradas.

- **Rota**: `GET /farm`
- **Parâmetros de Query Opcionais**:
  - `cpfCnpj`: Filtra as fazendas pelo CPF ou CNPJ do produtor.
  - `state`: Filtra as fazendas por estado.
  - `is_active`: Filtra por fazendas ativas ou inativas.
  - `page`: Define a página de resultados (padrão é 1).
  - `limit`: Define o limite de resultados por página (padrão é 1000).
- **Exemplo de Resposta**:
  ```json
  [
    {
      "cpfCnpj": "56821995028",
      "name": "Fazenda Exemplo",
      "state": "CE",
      "city": "Fortaleza",
      "address": "Estrada Exemplo, 456",
      "total_area": 1000,
      "arable_area": 600,
      "vegetation_area": 400,
      "cultures": [
        {
          "culture_id": 1,
          "planted_area": 300
        }
      ],
      "user": "admin"
    }
  ]
  ```

#### Cadastrar Fazenda

**Descrição**: Cadastra uma nova fazenda associada a um produtor.

- **Rota**: `POST /farm`
- **Corpo da Requisição**:
  ```json
  {
    "cpfCnpj": "56821995028",
    "name": "Fazenda Exemplo",
    "state": "CE",
    "city": "Fortaleza",
    "address": "Estrada Exemplo, 456",
    "total_area": 1000,
    "arable_area": 600,
    "vegetation_area": 400,
    "cultures": [
      {
        "culture_id": 1,
        "planted_area": 300
      }
    ],
    "user": "admin"
  }
  ```

#### Editar Fazenda

**Descrição**: Edita os dados de uma fazenda já existente.

- **Rota**: `PATCH /farm`
- **Parâmetro de Query Obrigatório**:
  - `farmId`: ID da fazenda que será atualizada.
- **Corpo da Requisição**:
  ```json
  {
    "cpfCnpj": "56821995028",
    "name": "Fazenda Exemplo Atualizada",
    "state": "CE",
    "city": "Fortaleza",
    "address": "Estrada Exemplo, 456",
    "total_area": 1000,
    "arable_area": 600,
    "vegetation_area": 400,
    "cultures": [
      {
        "culture_id": 1,
        "planted_area": 300
      }
    ],
    "user": "admin"
  }
  ```

#### Excluir Fazenda

**Descrição**: Exclui (desativa) uma fazenda existente.

- **Rota**: `DELETE /farm`
- **Parâmetros de Query Obrigatórios**:
  - `farmId`: ID da fazenda que será excluída.
  - `user`: Identificação do usuário que está realizando a exclusão.
- **Exemplo de Requisição**:
  ```
  DELETE /farm?farmId=1&user=admin
  ```

## Validações Importantes

- **CPF/CNPJ**: A validação dos campos de CPF e CNPJ é feita utilizando uma biblioteca específica do Node.js.
- **Áreas da Fazenda**: A soma das áreas agrícolas e vegetativas não pode ser maior que a área total da fazenda.

## Estrutura do Projeto

- `src/`: Contém o código fonte da API, incluindo rotas, serviços e repositórios.
- `prisma/`: Configuração do Prisma, com o esquema de banco de dados e migrações.

## Arquitetura do Sistema

A API segue uma arquitetura organizada em camadas:

1. **Rotas**: São responsáveis por receber as requisições e direcioná-las aos serviços.
2. **Serviços**: Contêm a lógica de negócios, validando dados e interagindo com os repositórios.
3. **Repositórios**: Responsáveis pela comunicação direta com o banco de dados via Prisma.

## Decisões Técnicas

1. **Separação de Cadastro de Fazendas e Produtores**: Optei por manter o cadastro de fazendas separado do cadastro de produtores para garantir maior flexibilidade e independência entre os dados, mesmo que isso aumente a complexidade do código.

2. **Manutenção de Dados ao Invés de Exclusão**: Em vez de deletar os registros de produtores e fazendas, o sistema apenas desativa o cadastro, mantendo o histórico de dados e evitando perda de informações importantes.

3. **Gerenciamento de Culturas**: Cada produtor pode associar múltiplas culturas a suas fazendas, e a soma da área plantada deve respeitar os limites da área total da fazenda.
