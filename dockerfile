# Etapa 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Instalamos dependencias del sistema mínimas
RUN apk add --no-cache python3 make g++

# Copiamos dependencias primero
COPY package.json package-lock.json ./
RUN npm ci

# Instalamos Ionic CLI (solo necesario para build/serve)
RUN npm install -g @ionic/cli

# Copiamos el resto del código
COPY . .

# Construimos el proyecto (esto genera dist/)
RUN npm run build

# Etapa 2: Imagen final (solo los archivos compilados)
FROM alpine:3.18

WORKDIR /app

# Copiamos la carpeta dist desde la etapa anterior
COPY --from=build /app/dist ./dist

# Solo para debug (luego lo quitas)
CMD ["ls", "-l", "/app/dist"]
