# Como Rodar o FlytoHome Localmente

## Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)
- [SQL Server LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb)
- [Git](https://git-scm.com)

---

## 1. Clone o repositório

```bash
git clone https://github.com/BernardoLomas/FlytoHome.git
cd FlytoHome
```

---

## 2. Backend

```bash
cd FlytoHome
dotnet restore
dotnet build
dotnet run
```

> A API estará disponível em `http://localhost:5297`  
> Swagger: `http://localhost:5297/swagger`

> ⚠️ Se a porta exibida no console for diferente de `5297`, edite `sgc-frontend/vite.config.ts` e atualize o `target` com a porta correta.

---

## 3. Frontend

Em um **novo terminal**, a partir da raiz do projeto:

```bash
cd sgc-frontend
npm install
npm run dev
```

> O frontend estará disponível em `http://localhost:5173`