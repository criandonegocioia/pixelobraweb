#!/usr/bin/env bash
# =============================================================================
# Pixel Obra — Script de Inicialização Completa
# =============================================================================
# Uso: bash start.sh
# =============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}"
echo "╔═══════════════════════════════════════╗"
echo "║      🏗️  PIXEL OBRA — STARTUP         ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# 1. Verificar .env
if [ ! -f ".env" ]; then
  echo -e "${YELLOW}⚠️  Arquivo .env não encontrado. Copiando .env.example...${NC}"
  cp .env.example .env
  echo "✅ .env criado. Edite-o com suas credenciais antes de continuar."
  exit 1
fi

# 2. Subir containers
echo "🚀 Subindo containers..."
docker compose up -d --build

# 3. Aguardar MySQL
echo "⏳ Aguardando MySQL ficar pronto..."
until docker compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; do
  sleep 2
done
echo "✅ MySQL pronto!"

# 4. Rodar migrations
echo "🗄️  Rodando migrations do banco de dados..."
docker compose exec app pnpm db:push || echo "⚠️  Migrations falharam — verifique o .env"

# 5. Status final
echo ""
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}✅  PIXEL OBRA RODANDO!${NC}"
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo ""
echo "  🌐 App:           http://localhost:3000"
echo "  📱 Evolution API: http://localhost:8080"
echo "  🗄️  MySQL:         localhost:3306"
echo ""
echo "  📲 Conectar WhatsApp:"
echo "     http://localhost:8080/instance/connect/pixelobra"
echo ""
echo -e "${YELLOW}  Credenciais Evolution API:${NC}"
echo "     URL:  http://localhost:8080"
grep EVOLUTION_API_KEY .env | head -1
echo "     Instância: pixelobra"
echo ""
