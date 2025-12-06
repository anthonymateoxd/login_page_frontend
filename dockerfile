# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODO (incluye Vite)
RUN npm ci

# Copiar proyecto completo
COPY . .

# Generar build
RUN npm run build


# ---------- Stage 2: Runtime ----------
FROM node:18-alpine AS runner

WORKDIR /app

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar build generado
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]
