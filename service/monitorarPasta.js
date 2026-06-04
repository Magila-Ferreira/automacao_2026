import chokidar from 'chokidar';
import path from 'path';
import { fileURLToPath } from 'url';
import { processarArquivoEntrada } from './lerArquivos.js';
import { salvarRegistrosNoBanco } from '../model/operacoesBanco.js';
import { disponibilizarPDF } from '../operacional/disponibilizarPDF.js';
import { disponibilizarPDFGerencial } from '../gerencial/disponibilizarPDFGerencial.js';
import { alertarFimDoProcesso } from '../alerta/alerta.js';
import { verificarSeOBancoExiste } from '../model/recuperarDadosBanco.js';

// Configurações para obter o diretório atual - ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inicializarPrograma = () => {
	// service -> automacao_2026 -> DEV_2026 -> arquivosPgr	
	const pastaEntrada = path.resolve(__dirname, '..', '..', 'arquivosPgr', 'excel_csv');
	const pastaSaida = path.resolve(__dirname, '..', '..', 'arquivosPgr', 'pdf');

	// Define o nome das colunas no banco - tabela 'identificacao'
	const identificacaoCols = ['id', 'termo', 'area_setor', 'idade', 'escolaridade', 'estadoCivil', 'genero']; 
	
	// Cria um array com o nome das colunas do arquivo excel, para os dados que serão salvos na tabela 'questao_resposta'
	const colunasDasRespostasExcel = Array.from({ length: 46 }, (_, i) => `q${i + 1}`); 

	console.log("\n\n----------------------------------------------------------------------------------------------\n\n");
	console.log("PROGRAMA INICIADO COM SUCESSO!!!");

	chokidar.watch(pastaEntrada, { persistent: true, ignored: /(^|[/\\])~\$.*/ }).on('add', async (filePath) => {
		// Define o nome do banco (nome do arquivo ou nome padrão)
		const { nomeDoBanco, nome: nomeDaEmpresa } = higienizaNomeDoBancoEPDF(filePath); 
		
		console.log("MONITORANDO PASTA...");

		if (nomeDaEmpresa.toUpperCase().startsWith("RECUPERAR_")) {
			const nomeDoBancoARecuperar = nomeDoBanco.slice(10); 
			const nomeDaEmpresaARecuperar = nomeDaEmpresa.slice(10); 
			await gerarPdfComOsDadosSalvosNoBanco(nomeDoBancoARecuperar, pastaSaida, nomeDaEmpresaARecuperar);
			return;
		}		

		try {
			if (!isArquivoValido(filePath)) return;
			console.log(`ARQUIVO COM FORMATO VÁLIDO ENCONTRADO --> ${nomeDoBanco}\n`);

			const dadosTratados = await processarArquivoEntrada(filePath);
			console.log("ARQUIVO PROCESSADO!\n");

			await salvarRegistrosNoBanco(dadosTratados, nomeDoBanco, identificacaoCols, colunasDasRespostasExcel);
			await gerarOuRecuperarPDF(nomeDoBanco, pastaSaida, nomeDaEmpresa);

		} catch (err) {
			console.error(`${err}\n`);
		}	
	});
	console.log("\n\n----------------------------------------------------------------------------------------------\n\n");
};

// Verifica se o nome do banco é válido e o higieniza
const higienizaNomeDoBancoEPDF = (filePath) => {
	if (!filePath || typeof filePath !== "string" || !filePath.trim()) {
		return {
			// Nome padrão, em caso de erro ou nome inválido
			nomeDoBanco: "analise_pgr",
    		nome: "analise_pgr",
		}; 
	}
	// Substituir caracteres inválidos e garantir um nome válido
	const nome = path.basename(filePath.trim(), path.extname(filePath.trim())).toLowerCase().replace(/[^a-zA-Z0-9_]/g, "_").substring(0, 64) || "nome_empresa";
	const ext = path.extname(filePath.trim()).replace('.', '_'); // Obtém a extensão e troca o ponto por "_"
	const nomeDoBanco = `${nome}${ext}`.replace(/[^a-zA-Z0-9_]/g, "_").substring(0, 64) || "nome_banco";

	return { nomeDoBanco, nome };
};

// Recuperar os dados do banco e gerar o PDF
async function gerarPdfComOsDadosSalvosNoBanco(nomeDoBancoARecuperar, pastaSaida, nomeDaEmpresaARecuperar) {
	try {
		const bancoExiste = await verificarSeOBancoExiste(nomeDoBancoARecuperar);
		
		if (!bancoExiste) { 
			console.warn(`\n[MODO RECUPERAÇÃO] => Banco de dados "${nomeDoBancoARecuperar}" não encontrado. Operação CANCELADA.`);

			console.log("MONITORANDO PASTA...\n");
			return;
		}
		console.log(`\n[MODO RECUPERAÇÃO] => Arquivo com prefixo RECUPERAR_ detectado.`); 
		console.log(`Iniciando geração de PDF com os dados salvos no banco "${nomeDoBancoARecuperar}"\n`);

		await gerarOuRecuperarPDF(nomeDoBancoARecuperar, pastaSaida, nomeDaEmpresaARecuperar);

	} catch (error) {
		console.error(`Erro ao gerar PDF com os dados RECUPERADOS do banco: ${error.message}`);
	}
}

// Evita redundância na chamada das funções
async function gerarOuRecuperarPDF(nomeDoBanco, pastaSaida, nomeDaEmpresa) {
	await disponibilizarPDF(nomeDoBanco, pastaSaida, nomeDaEmpresa);
	await disponibilizarPDFGerencial(nomeDoBanco, pastaSaida, nomeDaEmpresa);
	await alertarFimDoProcesso(); // FIM
}

// Verifica se o arquivo é válido:
const isArquivoValido = (filePath) => {
	return (
		!path.basename(filePath).startsWith('~$') // Se não for uma cópia temporária
		&& (filePath.endsWith('.csv') || filePath.endsWith('.xlsx')) // Se for csv ou xlsx
	);
};
export { inicializarPrograma };