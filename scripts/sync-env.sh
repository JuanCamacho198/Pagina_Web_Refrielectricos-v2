#!/bin/bash

# Script para sincronizar variables de entorno con Railway
# Uso: ./scripts/sync-env.sh [backend|frontend] [push|pull]

set -e

PROJECT=$1
ACTION=$2

if [ -z "$PROJECT" ] || [ -z "$ACTION" ]; then
  echo "Uso: ./scripts/sync-env.sh [backend|frontend] [push|pull]"
  echo ""
  echo "Ejemplos:"
  echo "  ./scripts/sync-env.sh backend push   # Subir .env del backend a Railway"
  echo "  ./scripts/sync-env.sh frontend pull  # Descargar vars de Railway al frontend"
  exit 1
fi

# Configurar directorio según proyecto
if [ "$PROJECT" = "backend" ]; then
  DIR="backend"
  ENV_FILE="backend/.env"
elif [ "$PROJECT" = "frontend" ]; then
  DIR="frontend/refrielectricos"
  ENV_FILE="frontend/refrielectricos/.env.local"
else
  echo "❌ Proyecto inválido. Use 'backend' o 'frontend'"
  exit 1
fi

cd "$DIR"

# Verificar que Railway CLI esté instalado
if ! command -v railway &> /dev/null; then
  echo "❌ Railway CLI no está instalado"
  echo "Instálalo con: npm install -g @railway/cli"
  exit 1
fi

# Verificar que el proyecto esté vinculado
if [ ! -f ".railway" ] && [ ! -f "railway.json" ]; then
  echo "⚠️  Proyecto no vinculado a Railway"
  echo "Ejecuta: railway link"
  exit 1
fi

if [ "$ACTION" = "push" ]; then
  echo "📤 Subiendo variables de entorno a Railway..."
  
  # Leer .env y subir cada variable
  if [ -f "../${ENV_FILE#*/}" ]; then
    while IFS='=' read -r key value; do
      # Ignorar líneas vacías y comentarios
      if [[ ! -z "$key" ]] && [[ ! "$key" =~ ^# ]]; then
        # Remover espacios y comillas
        key=$(echo "$key" | xargs)
        value=$(echo "$value" | xargs | sed 's/^"//' | sed 's/"$//')
        
        echo "  Setting: $key"
        railway variables set "$key=$value"
      fi
    done < "../${ENV_FILE#*/}"
    
    echo "✅ Variables subidas exitosamente a Railway"
  else
    echo "❌ Archivo $ENV_FILE no encontrado"
    exit 1
  fi

elif [ "$ACTION" = "pull" ]; then
  echo "📥 Descargando variables de entorno desde Railway..."
  
  # Backup del .env actual
  if [ -f "../${ENV_FILE#*/}" ]; then
    cp "../${ENV_FILE#*/}" "../${ENV_FILE#*/}.backup"
    echo "  📋 Backup creado: ${ENV_FILE}.backup"
  fi
  
  # Descargar variables en formato KEY=VALUE
  railway variables --kv > "../${ENV_FILE#*/}"
  
  echo "✅ Variables descargadas exitosamente desde Railway"
  echo "  📄 Guardadas en: $ENV_FILE"

else
  echo "❌ Acción inválida. Use 'push' o 'pull'"
  exit 1
fi
