# Script para parar todos os serviços PAM
# Autor: Emmanuel Menezes
# Data: 2025-11-03

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Red
Write-Host "  PAM - PARANDO TODOS OS SERVIÇOS" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

# Portas dos microserviços - Range 9000
$ports = @(9001, 9002, 9003, 9004, 9005, 9006, 9007, 9008, 9009, 9010, 9011, 9012, 9026, 9028)

$stoppedCount = 0

foreach ($port in $ports) {
    Write-Host "🔍 Verificando porta $port..." -ForegroundColor Cyan
    
    try {
        $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        
        if ($connection) {
            $processIds = $connection | Select-Object -ExpandProperty OwningProcess -Unique
            
            foreach ($pid in $processIds) {
                $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                
                if ($process) {
                    Write-Host "  ⏹️  Parando processo: $($process.ProcessName) (PID: $pid)" -ForegroundColor Yellow
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    $stoppedCount++
                    Write-Host "  ✅ Processo parado!" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "  ℹ️  Nenhum processo rodando nesta porta" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "  ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Red
Write-Host "  📊 RESUMO" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "  ⏹️  Processos parados: $stoppedCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Todos os serviços PAM foram parados!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Red
