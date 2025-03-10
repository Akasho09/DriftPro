## steps

### Bootstrap 

#### Turbo 
npx create-turbo@latest

#### Tailwind css 
cd apps/user-app
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
.config ans g.css
##### make sure 
- 
add this to .config
"../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}"

#### add prisma 
npm init -y
npx tsc --init
- update package.json 
{
    "name": "@repo/db",
    "version": "0.0.0",
    "dependencies": {
        "@prisma/client": "^5.11.0"
    },
    "devDependencies": {
        "prisma": "5.11.0"
    },
    "exports": {
        "./client": "./index.ts"
    }
}
- updatr tsconfig.json
{
    "extends": "@repo/typescript-config/react-library.json",
    "compilerOptions": {
      "outDir": "dist"
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist"]
  }
- npx prisma init
- docker run -e POST    S_PASSWORD=akash1234 -d -p 5432:5432 postgres
docker exec -it 699d79c42f12 bin/bash
psql -U postgres
- npx prisma migrate dev --name init 
update package.json of db and user-app & run npm install in root again.
- npx prisma generate
- - npm install prisma @prisma/client

- UPDATE db.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma


#### add recoil/store module
- cd packages
mkdir store
npm init -y
npx tsc --init
- npm i recoil


## add Next auth
- npm install next-auth
- app/api/auth/[...nextauth].route.ts= {
```javascript
import NextAuth from 'next-auth';

import AuthOptions from '../../../../lib/auth';

const handler = NextAuth(AuthOptions());

export const GET = handler;
export const POST = handler;
```
}




## update schema.prisma
model OnRampTransaction {
  id        Int          @id @default(autoincrement())
  status    OnRampStatus
  token     String       @unique
  provider  String
  amount    Int
  startTime DateTime
  userId    Int
  user      User         @relation(fields: [userId], references: [id])
}

## seed 
- "prisma": {
    "seed": "ts-node prisma/seed.ts"
}
- npx prisma db seed


## run multiple postgres containers 
change ports
docker run -d --name postgres1 -e POSTGRES_USER=user1 -e POSTGRES_PASSWORD=pass1 -p 5432:5432 postgres
docker run -d --name postgres2 -e POSTGRES_USER=user2 -e POSTGRES_PASSWORD=pass2 -p 5433:5432 postgres


## add locks in db when sending money 