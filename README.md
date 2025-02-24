## DRIFTPRO 
Paytm.
npx prisma studio

## ER Diagram
![alt text](image.png)

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