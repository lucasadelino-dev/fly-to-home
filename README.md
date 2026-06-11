# FlytoHome

Aplicação web fullstack para gerenciar criação e competição de pombos, com funcionalidades completas de cadastro, acompanhamento de saúde, registros de acasalamento e resultados de competições.

## Tecnologias

- **Frontend:** React 19 + TypeScript + Vite + Axios + React Router DOM + Recharts
- **Backend:** .NET 8 (C#) + Entity Framework Core + ASP.NET Core
- **Banco de dados:** SQL Server LocalDB
- **Gerenciamento de estado:** React Hooks

## Funcionalidades

- Cadastrar e gerenciar pombos (nome, anilha, sexo, origem, etc)
- Registrar genealogia de pombos (pai e mãe)
- Acompanhar saúde dos pombos (vacinas, tratamentos)
- Registrar acasalamentos e previsão de nascimentos
- Cadastrar competições e resultados
- Visualizar dados com gráficos e estatísticas
- API REST com Swagger para documentação

## Estrutura do projeto

```
FlytoHome/
├── FlytoHome/                           # API REST em .NET 8
│   ├── Controllers/                     # Endpoints da API
│   ├── Models/                          # Modelos de dados
│   ├── Data/                            # Contexto do banco de dados (DbContext)
│   ├── Migrations/                      # Migrações do Entity Framework
│   ├── Program.cs                       # Configuração da aplicação
│   ├── appsettings.json                 # Configuração de conexão (LocalDB)
│   └── FlytoHome.csproj                 # Definição do projeto .NET
├── sgc-frontend/                        # Interface em React
│   ├── src/
│   │   ├── pages/                       # Páginas da aplicação
│   │   ├── components/                  # Componentes React
│   │   ├── App.tsx                      # Componente raiz
│   │   └── main.tsx                     # Ponto de entrada
│   ├── package.json                     # Dependências Node.js
│   ├── vite.config.ts                   # Configuração Vite
│   └── tsconfig.json                    # Configuração TypeScript
└── README.md
```

## Como rodar localmente

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)
- [SQL Server LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb)
- [Git](https://git-scm.com)

### 1. Clone o repositório

```bash
git clone https://github.com/BernardoLomas/FlytoHome.git
cd FlytoHome
```

### 2. Configure e rode o backend

```bash
cd FlytoHome
```

**Nota:** O arquivo `appsettings.json` já está configurado para usar SQL Server LocalDB:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=FlytoHomeSGC;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

Se você instalou SQL Server Express em vez de LocalDB, edite a conexão para:
```json
"DefaultConnection": "Server=(local)\\SQLEXPRESS;Database=FlytoHomeSGC;Trusted_Connection=True;MultipleActiveResultSets=true"
```

Restaure dependências e rode a API:

```bash
dotnet restore
dotnet build
dotnet run
```

**Verificar a porta da API:**

A porta padrão da API é `http://localhost:5297`. Quando você executar `dotnet run`, verifique no console qual porta foi atribuída (geralmente aparece uma mensagem como "Now listening on: http://localhost:5297").

**Importante:** Se a porta for diferente de 5297, você precisa atualizar o arquivo `sgc-frontend/vite.config.ts`:

```typescript
// Em sgc-frontend/vite.config.ts, mude a linha:
target: 'http://localhost:SUA_PORTA_AQUI',  // substitua SUA_PORTA_AQUI pela porta correta
```

Por exemplo, se a API estiver em `http://localhost:5000`, altere para:
```typescript
target: 'http://localhost:5000',
```

**Documentação Swagger:** `http://localhost:5297/swagger` (ou a porta correta que sua API está usando)

A criação do banco de dados e as migrations são executadas automaticamente ao iniciar a aplicação.

### 3. Configure e rode o frontend

Em um **novo terminal**, navegue para a pasta frontend:

```bash
cd sgc-frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## Estrutura da API

### Modelos Principais

- **Pombos:** Cadastro de pombos com genealogia (pai/mãe)
- **Competicoes:** Registro de competições e distâncias
- **Acasalamentos:** Acompanhamento de reprodução e nascimentos
- **RegistrosSaude:** Histórico de saúde, vacinas e tratamentos
- **ResultadosCompeticao:** Posições e tempos de voo

### Tabelas do Banco de Dados

| Tabela | Descrição |
|--------|-----------|
| Pombos | Dados dos pombos cadastrados |
| Competicoes | Competições e eventos |
| Acasalamentos | Registros de reprodução |
| RegistrosSaude | Histórico de saúde e vacinas |
| ResultadosCompeticao | Resultados de competições |

## Scripts disponíveis

### Frontend

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Compila para produção
npm run lint     # Executa o ESLint
npm run preview  # Visualiza o build de produção localmente
```

### Backend

```bash
dotnet run                    # Executa a aplicação
dotnet build                  # Compila o projeto
dotnet ef migrations add      # Cria nova migration
dotnet ef database update     # Aplica migrations ao banco
```

## Solução de problemas

### LocalDB não encontrado

Se receber erro sobre LocalDB não instalado:

1. Verifique se SQL Server LocalDB está instalado:
   ```powershell
   sqllocaldb info
   ```

2. Se não estiver, instale via:
   - [SQL Server LocalDB 2025](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb)
   - Ou use SQL Server Express e altere a connection string

3. Se usar SQL Server Express, altere `appsettings.json`:
   ```json
   "Server=(local)\\SQLEXPRESS;Database=FlytoHomeSGC;Trusted_Connection=True;MultipleActiveResultSets=true"
   ```

### Porta já em uso

- **Backend (5001/5000):** Mude em `Properties/launchSettings.json`
- **Frontend (5173):** O Vite escolhe automaticamente a próxima porta disponível

### Banco de dados não criado

O banco é criado automaticamente na primeira execução via Entity Framework migrations. Se houver erro:

```bash
cd FlytoHome
dotnet ef database drop --force
dotnet ef database update
```


## Licença

Este projeto está sob a licença de Pontifícia Universidade Católica de Minas Gerais.
