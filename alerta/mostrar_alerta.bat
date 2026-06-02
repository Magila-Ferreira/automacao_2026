@echo off

echo "Arquivos PDF salvos com sucesso!"
echo "Abrindo a pasta de destino... "

explorer "%~dp0..\..\arquivosPgr\pdf"

exit /b 0
