# 💸 DriftPro – Paytm for Desktop

**A secure and modern desktop payment platform** designed for seamless digital transactions.  
Built with **Next.js**, **Express.js**, **PostgreSQL**, **Redis**, and **Prisma ORM**, all organized in a scalable **Turborepo monorepo** architecture.  

DriftPro ensures high performance, strong data consistency (ACID compliance), and a clean user experience powered by a modern TypeScript stack.

---

## 🧩 ER Diagram
![alt text](Archi.png)

---

## Demo user : 
- username : 9103597809
- password : Aakash@9103597809
---

## 🚀 Features

### 💳 Secure Transactions  
- ACID-compliant database operations with **PostgreSQL** + **Prisma ORM**.  
- Ensures transactional integrity during send/receive money operations.  

### 🔐 OAuth Authentication  
- Secure login through **NextAuth.js** with multiple providers:  
  - **Google OAuth**
  - **GitHub OAuth**

### 💸 Wallet System  
- **Add Money:** Funds are credited after verification from a simulated **bank webhook** (`bankHook` service).  
- **Send Money:** Transfer virtual funds between registered users securely.  
- **Transaction Logs:** All transactions are recorded and auditable.

### ⚙️ Redis Integration  
- **Caching Layer:** Accelerates data retrieval and reduces PostgreSQL load.  
- **Session Management:** Stores active user sessions for faster authentication.  
- **Data Access Control:** Implements role-based access and key-based data isolation for multi-user operations.

### 🧱 Monorepo Architecture (Turborepo)  
- Modular codebase for scalability and maintainability.  
- Shared packages for UI, configs, and utilities across all apps.

### 🛠 Auxiliary Backend  
- **Express.js microservice (`bankHook`)** handles webhook verifications and specialized payment logic.

### 🧰 CI/CD with GitHub Actions  
- Lint, test, and build pipelines on every push or PR.  
- Automated Docker-based deployment to production (e.g., AWS / Render / Vercel).  
- Ensures only stable commits reach production.

### 🖥 Seamless Experience  
- Built with **Next.js** for unified frontend and backend logic.  
- Responsive UI using **Tailwind CSS**.  
- Optimized for **desktop use** with future cross-platform build plans.

### 🐳 Dockerized for Consistency  
- One-command deployment using Docker Compose.  
- Identical environments across development, staging, and production.

---

## 🏗 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend/Backend** | Next.js (App Router) |
| **Microservice** | Express.js (`bankHook`) |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Cache / Access Control** | Redis |
| **Language** | TypeScript |
| **UI Framework** | Tailwind CSS |
| **Architecture** | Turborepo |
| **Auth** | NextAuth.js (Google, GitHub) |
| **Deployment** | Docker + GitHub Actions |

---

## 📂 Monorepo Structure
```yml
driftpro/
├── apps/
│   ├── user-app/        # Next.js frontend + backend logic
│   └── bankHook/    # Auxiliary backend service
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── utils/              # Shared utilities
│   └── config/             # Shared configs (e.g., DB, linting)
├── prisma/                 # Prisma schema & migrations
├── docker/                 # Docker setup & orchestration
└── turbo.json              # Turborepo configuration
```

---

## ⚙️ Installation & Setup
### Prerequisites
- **Node.js** ≥ 20  
- **PostgreSQL** ≥ 14  
- **Redis** ≥ 7  
- **Docker** *(optional but recommended)*

### Clone Repository
```bash
git clone https://github.com/Akasho09/DriftPro
cd DriftPro
```

- Setup Environment
1. Create .env in the user-app folder:
- Path: DriftPro/apps/user-app/.env

```bash
clientId=your_google_oauth_client_id
clientSecret=your_google_oauth_secret
githubId="your_github_oauth_client_id"
githubSecret="your_github_oauth_secret"
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=redis_password
REDIS_PORT=11113
```

2. Create .env in the db folder: 
- Path: DriftPro/packages/db/.env

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/driftpro"
```

- Install Dependencies
npm install

- Setup Database
npx prisma migrate dev

- Run Development Server
npm run dev

### Run with Docker
docker-compose up --build


### 🔐 Security
- OAuth via NextAuth.js – Users can log in securely using Google or GitHub accounts.

- Implements ACID-compliant transactions using PostgreSQL.

- Sensitive data is encrypted at rest and in transit.

- Prisma ensures safe and validated database queries.

### 💸 Wallet Transactions

- Add Money – Funds are added to the wallet after verification from the bankHook service, simulating a bank webhook verification.

- Send Money – Users can transfer money to other registered users internally (pseudo-transactions).

- Transaction Logs – All wallet operations are logged and auditable.


### 📈 Roadmap
- Implement rate limiting and request throttling using Redis
- Add Redis pub/sub for real-time balance updates and transaction streaming
-  Add support for multiple payment gateways
-  Add analytics dashboard for transactions
- Two-factor authentication (2FA)
- Full CI/CD with GitHub Actions (lint → test → deploy → Docker)
- Integrate monitoring via Prometheus + Grafana

## steps
[text](steps.md)

      
 ##   <ReTr n={0}></ReTr> how ???