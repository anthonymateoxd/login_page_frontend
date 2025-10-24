# # Etapa 1: Build
# FROM node:18-alpine AS build

# WORKDIR /app

# # Instalamos dependencias del sistema mínimas
# RUN apk add --no-cache python3 make g++

# # Copiamos dependencias primero
# COPY package.json package-lock.json ./
# RUN npm ci

# # Instalamos Ionic CLI (solo necesario para build/serve)
# RUN npm install -g @ionic/cli

# # Copiamos el resto del código
# COPY . .

# # Construimos el proyecto (esto genera dist/)
# RUN npm run build

# # Etapa 2: Imagen final (solo los archivos compilados)
# FROM alpine:3.18

# WORKDIR /app

# # Copiamos la carpeta dist desde la etapa anterior
# COPY --from=build /app/dist ./dist

# # Solo para debug (luego lo quitas)
# CMD ["ls", "-l", "/app/dist"]

# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]