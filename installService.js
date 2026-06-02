import { Service } from 'node-windows';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho absoluto calculado automaticamente
const scriptPath = path.join(__dirname, 'index.js');

// Criando um novo serviço
const svc = new Service({
	name: "Automacao_2026", // Nome do serviço no Windows
	description: "Processamento de arquivos excel e geração de gráficos em PDF",
	script: scriptPath,
	nodeOptions: [
		"--harmony",
		"--max_old_space_size=4096" // Ajuste para uso de memória se necessário
	],
	wait: 2,
	grow: 0.5,
	maxRetries: 3
});
// Evento de instalação bem-sucedida
svc.on("install", () => {
	console.log("Serviço instalado com sucesso!");
	svc.start(); // Inicia o serviço automaticamente após a instalação
});
// Instalando o serviço
svc.install();
// "C:\\amb_sw\\automacao\\index.js"	--->	Local usado na instalação antiga do Guilherme