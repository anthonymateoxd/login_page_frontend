# --- Fase de construcción (usando Node) ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar dependencias y configuraciones primero (para cachear eficientemente)
COPY package.json package-lock.json ./
COPY vite.config.ts ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del proyecto
COPY . .

# Construir la aplicación para producción
RUN npm run build

# --- Fase de producción (usando Nginx) ---
FROM nginx:alpine 

# Copiar los archivos construidos desde la fase anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración personalizada de Nginx para React (SPA)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Exponer el puerto 80 (puerto por defecto de Nginx)
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

# Build React app
# React build container (only builds)
# FROM node:18-alpine

# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm ci

# COPY . .

# RUN npm run build