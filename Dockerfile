# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm@latest --quiet

# Copia manifests E patches (necessário para pnpm install funcionar)
COPY package.json pnpm-lock.yaml* ./
COPY patches/ ./patches/

# Instala todas as dependências (dev + prod) para poder fazer o build
RUN pnpm install --no-frozen-lockfile

# Copia o restante do código
COPY . .

# Gera o build (Vite frontend + esbuild server)
RUN pnpm build

# ── Runner stage ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copia node_modules do builder (evita re-instalar com lockfile)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/agente-pixelobra/PIXEL.md ./agente-pixelobra/PIXEL.md
COPY --from=builder /app/package.json ./

RUN mkdir -p /app/logs

EXPOSE 3000

CMD ["node", "dist/index.js"]
