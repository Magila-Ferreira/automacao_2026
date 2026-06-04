import { criarPDF, adicionarGrafico, adicionaInformacoesDoGrafico } from '../pdf/gerarPDF.js';
import { formatarPrimeiraPagina, formatarDescricaoArquivo, formatarTextoEscala } from '../pdf/formatacaoPDF.js';

const pdfDaEmpresa = async (dadosPDF, pastaDestino, nomeArquivo, tipoRelatorio, introducao, nomeDaEmpresa) => {
    const { pdf, caminhoArquivoPDF } = criarPDF(pastaDestino, nomeArquivo, tipoRelatorio);
    const titulo = 'RESULTADO DA ANÁLISE PRELIMINAR DE RISCOS PSICOSSOCIAIS';
    const definicao = 'Relatório da Empresa';
    const cabecalho = 'Empresa / Unidade Fabril:     ' + nomeDaEmpresa.charAt(0).toUpperCase() + nomeDaEmpresa.slice(1).toLowerCase();
    const descricaoDoArquivo = 'GRÁFICOS DA EMPRESA - Porcentagem de RESPOSTAS por categoria.';

    formatarPrimeiraPagina(pdf, titulo, definicao, cabecalho, introducao);

    for (let iFator = 1; iFator <= 10; iFator++) {
        const dadosFator = dadosPDF[`fator_${iFator}`] ?? [];
        if (dadosFator.length === 0) continue;

        const primeiraAvaliacao = dadosFator[0];
        if (primeiraAvaliacao) {
            const { escala } = primeiraAvaliacao;

            // Título - ESCALA
            if ([1, 3, 5, 8].includes(iFator)) {
                pdf.addPage();
                if (iFator === 1) {
                    formatarDescricaoArquivo(pdf, descricaoDoArquivo);
                }
                formatarTextoEscala(pdf, escala);
            }
        }
        await adicionarGrafico(pdf, dadosFator);
        await adicionaInformacoesDoGrafico(pdf, dadosFator);
    }
    pdf.end();
    return caminhoArquivoPDF;
};
export { pdfDaEmpresa };