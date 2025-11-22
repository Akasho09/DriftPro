# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# Copy root files and workspace structure
COPY package*.json ./
COPY turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install

RUN npm run db:generate

FROM base AS userapp
CMD ["npm", "run", "dev", "--", "--filter=userapp"]

FROM base AS bank-webhook
CMD ["npm", "run", "dev", "--", "--filter=bank-webhook"]