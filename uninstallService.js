import { Service } from 'node-windows';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho absoluto calculado automaticamente
const scriptPath = path.join(__dirname, 'index.js');

const svc = new Service({
	name: "Automacao_2026",
	script: scriptPath // Caminho do script usado na instalação
});

svc.on("uninstall", () => {
	console.log("Serviço removido com sucesso!");
});
svc.uninstall();
// "C:\\amb_sw\\automacao\\index.js"	--->	Local usado na instalação antiga do Guilherme