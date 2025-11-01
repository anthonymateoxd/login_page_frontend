# Etapa 1: Build
FROM node:18-alpine AS build

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci

RUN npm install -g @ionic/cli

COPY . .

RUN npm run build

# Etapa 2: Servir el frontend
FROM node:18-alpine

WORKDIR /app

# Instalamos un servidor estático simple
RUN npm install -g http-server

COPY --from=build /app/dist ./dist

EXPOSE 8081

# Servimos la carpeta dist en el puerto 8081
CMD ["http-server", "dist", "-p", "8081"]
