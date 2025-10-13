# DriftPro – Paytm for Desktop

## ER Diagram
![alt text](Archi.png)


A secure desktop payment application designed to provide seamless transaction handling with a modern tech stack. DriftPro combines the reliability of PostgreSQL with Prisma ORM and the flexibility of Next.js in a monorepo architecture powered by Turborepo.

---
    
## 🚀 Features
- 💳 **Secure Transactions** – ACID-compliant handling of financial data with PostgreSQL + Prisma ORM. 
- 🔐 **OAuth Authentication** – Users can securely log in via Google or GitHub using NextAuth.js.
    ### 1. Google OAuth
    - Allows users to log in using their Google accounts.
    ### 2. GitHub OAuth
    - Allows users to log in using their GitHub accounts.
- 💸 **Wallet System** –
    - Add Money: Funds are credited after verification from a simulated/hard-coded bank webhook.
    - Send Money: Users can pseudo-transfer money to other registered users within the system.
- ⚡ **GitHub CI/CD** – Automatically builds, tests, and deploys the app on push or pull request:
    - Runs linting, tests, and build checks.
    - Deploys the Dockerized monorepo to your hosting environment (AWS).
    - Ensures that only passing commits are deployed, keeping production safe.
- ⚡ **Seamless Experience** – Built with Next.js for both frontend and backend logic.  
- 🛠 **Auxiliary Backend** – Express.js microservice for specialized operations.  
- 🏗 **Monorepo Architecture** – Turborepo for modular development and scalability.  
- 🎨 **Intuitive UI** – Tailwind CSS for a clean and responsive interface.  
- 🐳 **Dockerized** – Consistent deployment across environments.  
- 📜 **Transaction Pipelines** – Authentication, validation, and logging workflows integrated. 
 
---

## 🏗 Tech Stack
- **Frameworks:** Next.js, Express.js  
- **Architecture:** Turborepo (monorepo)  
- **Database:** PostgreSQL + Prisma ORM  
- **Languages:** TypeScript  
- **UI:** Tailwind CSS  
- **Deployment:** Docker  

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
- Node.js (>= 20)  
- PostgreSQL (>= 14)  
- Docker (optional but recommended)

### Clone Repository
```bash
git clone https://github.com/Akasho09/DriftPro
cd DriftPro
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

-  Add support for multiple payment gateways

-  Implement real-time notifications

-  Extend desktop support (Windows, macOS, Linux builds)

-  Add analytics dashboard for transactions




## steps
[text](steps.md)

      
 ##   <ReTr n={0}></ReTr> how ???