# 💸 DriftPro 
![DriftPro Architecture Banner](arch2.png)

[![Build](https://img.shields.io/github/actions/workflow/status/Akasho09/DriftPro/ci.yml?branch=main&logo=github)](https://github.com/)
[![Docker](https://img.shields.io/docker/cloud/build/yourorg/driftpro)](#)
[![Next.js](https://img.shields.io/badge/Next.js-13-black?logo=next.js)](https://nextjs.org/)
[![Postgres](https://img.shields.io/badge/Postgres-13-316192?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-6-DC382D?logo=redis)](https://redis.io/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-deploy-black?logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-deploy-4AB3F4?logo=render)](https://render.com/)

> A secure digital wallet platform. Modern, modular and production-ready.

---

## Table of Contents
1. [Demo User](#demo-user)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Monorepo Structure](#monorepo-structure)  
5. [Installation & Setup](#installation--setup)  
6. [Running with Docker](#running-with-docker)  
7. [Security](#security)  
8. [Wallet Flow](#wallet-flow)  
9. [Roadmap](#roadmap)  
10. [Architecture](#architecture)  
11. [Contributing & License](#contributing--license)

---

## 👤 Demo User
- username : 9103597816
- password : Aakash@9103597809

---

## 🧩 ER Diagram
![alt text](arch2.png)
![alt text](Archi.png)

---

## 🚀 Features

### 💳 Secure Transactions  
- ACID-safe money operations using PostgreSQL + Prisma
- Reliable handling of Add Money & Send Money
- Full transaction audit logs

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

### 🛡️ Rate Limiting
- IP-based Rate Limiting using Upstash. 

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

<table> <tr><th>Category</th><th>Technology</th></tr> <tr> <td><b>Full-Stack Framework</b></td> <td> <img src="https://skillicons.dev/icons?i=nextjs" width="26"/> Next.js (App Router) </td> </tr> <tr> <td><b>Microservice</b></td> <td> <img src="https://skillicons.dev/icons?i=express" width="26"/> Express.js (Bank Webhook Service) </td> </tr> <tr> <td><b>Database</b></td> <td> <img src="https://skillicons.dev/icons?i=postgres" width="26"/> PostgreSQL </td> </tr> <tr> <td><b>ORM</b></td> <td> <img src="https://skillicons.dev/icons?i=prisma" width="26"/> Prisma ORM </td> </tr> <tr> <td><b>Caching / Rate Limiting</b></td> <td> <img src="https://skillicons.dev/icons?i=redis" width="26"/> Redis (IoRedis + Upstash) </td> </tr> <tr> <td><b>Validation</b></td> <td> <img src="https://raw.githubusercontent.com/colinhacks/zod/master/logo.svg" width="26"/> Zod </td> </tr> <tr> <td><b>UI / Icons</b></td> <td> <img src="https://skillicons.dev/icons?i=react" width="26"/> React Icons </td> </tr> <tr> <td><b>Notifications</b></td> <td> 🔥 React Hot Toast </td> </tr> <tr> <td><b>Language</b></td> <td> <img src="https://skillicons.dev/icons?i=ts" width="26"/> TypeScript </td> </tr> <tr> <td><b>Styling</b></td> <td> <img src="https://skillicons.dev/icons?i=tailwind" width="26"/> Tailwind CSS </td> </tr> <tr> <td><b>Monorepo Architecture</b></td> <td> <img src="https://skillicons.dev/icons?i=turbo" width="26"/> Turborepo </td> </tr> <tr> <td><b>Authentication</b></td> <td> <img src="https://skillicons.dev/icons?i=google" width="26"/> OAuth (Google) &nbsp; + &nbsp; <img src="https://skillicons.dev/icons?i=github" width="26"/> GitHub OAuth </td> </tr> <tr> <td><b>Deployment</b></td> <td> <img src="https://skillicons.dev/icons?i=vercel" width="26"/> Vercel (Frontend + API) <br/> <img src="https://skillicons.dev/icons?i=render" width="26"/> Render (BankHook Microservice) </td> </tr> <tr> <td><b>Containerization</b></td> <td> <img src="https://skillicons.dev/icons?i=docker" width="26"/> Docker </td> </tr> <tr> <td><b>CI/CD</b></td> <td> <img src="https://skillicons.dev/icons?i=githubactions" width="26"/> GitHub Actions </td> </tr> </table>

---

## 📂 Monorepo Structure
```yml
Drift2/
│
├─ apps/                       # All runnable applications
│   ├─ web/                    # Next.js App Router (Main app)
│   └─ bankhook/               # Express.js Bank Webhook Microservice
│
├─ packages/                   # Shared libraries for the monorepo
│   ├─ ui/                     # Reusable UI components (Buttons, Inputs, Cards)
│   ├─ db/                     # All db logic and prisma
│
├─ docker/                     # Docker configs (per-service)
│
├─ .vercel/                    # Vercel deployment metadata (auto-generated)
├─ .github/                    # GitHub Actions workflow files
│
├─ readme.md                   # Project documentation
│
├─ .env                        # Environment variables (root)
│
├─ Dockerfile                  # Root Dockerfile (for Next.js app)
├─ docker-compose.yml          # Local dev composition (web + bankhook + postgres)
│
└─ wait-for-postgres.sh        # Script to ensure Postgres is ready before services run
```
---

## ⚙️ Installation & Setup

## Manual Installation
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

## Run with Docker
1. 
```bash
   docker compose build
```
2. 
```bash
   docker compose up -d 
```
3. 
```bash
   docker exec -it  drift2-web-1 sh
```
4. 
```bash
   npm run db:migrate
```


### 🔐 Security
- OAuth via NextAuth.js – Users can log in securely using Google or GitHub accounts.

- Implements ACID-compliant transactions using PostgreSQL.

- Sensitive data is encrypted at rest and in transit.

- Prisma ensures safe and validated database queries.

- 🛡️ 1. IP-Based Rate Limiting (Upstash Ratelimit)
   - Implemented at the middleware level using Upstash Redis
   - Prevents excessive requests from a single IP
   - Redirects users to a cooldown page (/rate-limit?retry=10)
- 📱 2. Mobile Number Rate Limiting (ioredis)
   - Limit Login attempts

### 💸 Wallet Transactions

- Add Money – Funds are added to the wallet after verification from the bankHook service, simulating a bank webhook verification.

- Send Money – Users can transfer money to other registered users internally (pseudo-transactions).

- Transaction Logs – All wallet operations are logged and auditable.


### 📈 Roadmap
- Add Redis pub/sub for real-time balance updates and transaction streaming
- Add WebSockets for live transaction status
- Add notifications (email / SMS)
- Integrate Razorpay / Stripe test mode
- Integrate monitoring via Prometheus + Grafana

### 🧾 Architecture
See ARCHITECTURE.md
 for complete architecture diagrams, sequence flows and deployment notes.

### 🤝 Contributing
- Fork → Branch → PR
- Run npm run lint, add tests and maintainers will review.

## steps
[text](steps.md)

      
 ##   <ReTr n={0}></ReTr> how ???