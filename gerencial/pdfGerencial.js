import { criarPDF, adicionarGrafico, adicionaInformacoesDoGraficoGerencial } from '../pdf/gerarPDF.js';
import { formatarPrimeiraPagina, formatarDescricaoArquivo, formatarTextoSetor, espacamentoVertical } from '../pdf/formatacaoPDF.js';

const pdfDaEmpresa = async (dadosPDF, pastaDestino, nomeArquivo, tipoRelatorio, introducao, nomeDaEmpresa) => {
    const { pdf, caminhoArquivoPDF } = criarPDF(pastaDestino, nomeArquivo, tipoRelatorio);

    const titulo = 'RESULTADO DA ANÁLISE PRELIMINAR DE RISCOS PSICOSSOCIAIS';
    const definicao = `Relatório Gerencial - POR EMPRESA`;
    const cabecalho = 'Empresa / Unidade Fabril:     ' + nomeDaEmpresa.charAt(0).toUpperCase() + nomeDaEmpresa.slice(1).toLowerCase();
    const descricaoDoArquivo = 'GRÁFICO DA EMPRESA - Porcentagem ponderada de RISCO PSICOSSOCIAL por fator.';

    formatarPrimeiraPagina(pdf, titulo, definicao, cabecalho, introducao);
    formatarDescricaoArquivo(pdf, descricaoDoArquivo);

    // Itera sobre a chave 'escala'
    for (const dados of Object.values(dadosPDF)) {
        // Verifica se a escala é válida
        if (!dados || dados.length === 0) continue;

        // Adiciona o gráfico
        await adicionarGrafico(pdf, dados, null, tipoRelatorio);
        await adicionaInformacoesDoGraficoGerencial(pdf, dados);
    }
    pdf.end();
    return caminhoArquivoPDF;
};
const pdfPorSetor = async (dadosSetores, pastaDestino, nomeArquivo, tipoRelatorio, introducao, nomeDaEmpresa) => {
    const { pdf, caminhoArquivoPDF } = criarPDF(pastaDestino, nomeArquivo, tipoRelatorio);
    const titulo = 'RESULTADO DA ANÁLISE PRELIMINAR DE RISCOS PSICOSSOCIAIS';
    const definicao = 'Relatório por setor';
    const cabecalho = 'Empresa / Unidade Fabril:     ' + nomeDaEmpresa.charAt(0).toUpperCase() + nomeDaEmpresa.slice(1).toLowerCase();
    const descricaoDoArquivo = 'GRÁFICOS DO SETOR - Porcentagem ponderada de RISCO PSICOSSOCIAL por setor e fator.';

    formatarPrimeiraPagina(pdf, titulo, definicao, cabecalho, introducao);

    if (Object.keys(dadosSetores).length === 0) {
		pdf.end();
		return caminhoArquivoPDF; // Verifica se há setores para processar
	} 

    for (const setor in dadosSetores) {
        pdf.x = 30;
        pdf.addPage();
        formatarDescricaoArquivo(pdf, descricaoDoArquivo);
        formatarTextoSetor(pdf, `Setor de trabalho: ${setor.toUpperCase()}`);

        if (Object.keys(dadosSetores[setor]).length === 0) continue; // Verifica se o setor possui dados

        for (const escala in dadosSetores[setor]) {
            const fatores = dadosSetores[setor][escala];
            await adicionarGrafico(pdf, fatores, setor, tipoRelatorio);
            await adicionaInformacoesDoGraficoGerencial(pdf, fatores);
            espacamentoVertical(pdf, 1);
        }
    }
    pdf.end();
    return caminhoArquivoPDF;
};
export { pdfDaEmpresa, pdfPorSetor };