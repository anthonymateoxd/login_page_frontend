# Imagen build-only (no sirve archivos)
FROM node:18-alpine

WORKDIR /app

# Copiar dependencias
COPY package.json package-lock.json ./

RUN npm ci

# Copiar el código completo
COPY . .

# Construir el dist de producción
RUN npm run build

# Exporta el build en /app/dist

