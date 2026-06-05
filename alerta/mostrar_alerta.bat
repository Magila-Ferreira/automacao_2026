@echo off

echo =================================================
echo    PDFS GERADOS COM SUCESSO
echo    Abrindo a pasta de destino... em 2 segundos.
echo =================================================

timeout /t 2 >nul
explorer "%~dp0..\..\arquivosPgr\pdf"

exit /b 0