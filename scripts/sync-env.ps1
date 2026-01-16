# Script para sincronizar variables de entorno con Railway
# Uso: .\scripts\sync-env.ps1 -Project [backend|frontend] -Action [push|pull]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("backend", "frontend")]
    [string]$Project,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("push", "pull")]
    [string]$Action
)

# Obtener la ruta raíz del proyecto (un nivel arriba del directorio scripts)
$RootDir = Split-Path -Parent $PSScriptRoot

# Configurar directorio según proyecto
$Dir = ""
$EnvFile = ""

if ($Project -eq "backend") {
    $Dir = Join-Path $RootDir "backend"
    $EnvFile = ".env"
} elseif ($Project -eq "frontend") {
    $Dir = Join-Path $RootDir "frontend\refrielectricos"
    $EnvFile = ".env.local"
}

# Verificar que Railway CLI esté instalado
if (!(Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Railway CLI no está instalado" -ForegroundColor Red
    Write-Host "Instálalo con: npm install -g @railway/cli" -ForegroundColor Yellow
    exit 1
}

# Cambiar al directorio del proyecto
Push-Location $Dir

# Verificar que el proyecto esté vinculado intentando ejecutar railway status
$railwayStatus = railway status 2>&1
if ($LASTEXITCODE -ne 0 -and $railwayStatus -match "not linked") {
    Write-Host "⚠️  Proyecto no vinculado a Railway" -ForegroundColor Yellow
    Write-Host "Ejecuta desde este directorio: railway link" -ForegroundColor Cyan
    Pop-Location
    exit 1
}

if ($Action -eq "push") {
    Write-Host "📤 Subiendo variables de entorno a Railway..." -ForegroundColor Cyan
    
    # Ruta completa al archivo .env
    $EnvPath = Join-Path $Dir $EnvFile
    
    if (Test-Path $EnvPath) {
        Get-Content $EnvPath | ForEach-Object {
            $line = $_.Trim()
            
            # Ignorar líneas vacías y comentarios
            if ($line -and !$line.StartsWith("#")) {
                $parts = $line -split '=', 2
                if ($parts.Count -eq 2) {
                    $key = $parts[0].Trim()
                    $value = $parts[1].Trim().Trim('"')
                    
                    Write-Host "  Setting: $key" -ForegroundColor Gray
                    railway variables set "$key=$value"
                }
            }
        }
        
        Write-Host "✅ Variables subidas exitosamente a Railway" -ForegroundColor Green
    } else {
        Write-Host "❌ Archivo $EnvFile no encontrado en $Dir" -ForegroundColor Red
        Pop-Location
        exit 1
    }

} elseif ($Action -eq "pull") {
    Write-Host "📥 Descargando variables de entorno desde Railway..." -ForegroundColor Cyan
    
    $EnvPath = Join-Path $Dir $EnvFile
    
    # Backup del .env actual
    if (Test-Path $EnvPath) {
        Copy-Item $EnvPath "$EnvPath.backup"
        Write-Host "  📋 Backup creado: $EnvFile.backup" -ForegroundColor Gray
    }
    
    # Descargar variables en formato KEY=VALUE
    railway variables --kv | Out-File -FilePath $EnvPath -Encoding UTF8NoBOM
    
    Write-Host "✅ Variables descargadas exitosamente desde Railway" -ForegroundColor Green
    Write-Host "  📄 Guardadas en: $EnvPath" -ForegroundColor Gray
}

Pop-Location
