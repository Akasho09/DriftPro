# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# Install pg_isready tool for wait-for-postgres.sh
RUN apk add --no-cache postgresql-client

COPY package*.json ./
RUN npm install

COPY . .

# Copy wait script into container and make it executable
COPY wait-for-postgres.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/wait-for-postgres.sh

# ---- User App ----
FROM base AS userapp
CMD ["npm", "run", "start:user"]

# ---- Bankhook ----
FROM base AS bankhook
CMD ["npm", "run", "start:bankhook"]
