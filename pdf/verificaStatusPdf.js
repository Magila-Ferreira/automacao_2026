import fs from 'fs';

/**
 * Verifica se um arquivo está bloqueado por outro processo.
 * Retorna true quando o arquivo está em uso.
 * @param {string} caminhoArquivo 
 * @returns {boolean} true se estiver em uso
 */
function pdfAberto(caminhoArquivo) {
	try {
		// Tenta renomear o arquivo temporariamente
		const tempPath = caminhoArquivo + '.tmp';
		fs.renameSync(caminhoArquivo, tempPath);
		fs.renameSync(tempPath, caminhoArquivo); // Renomeia de volta

		return false; // Se renomeou com sucesso, não está em uso
	} catch (err) {
		if (err.code === 'EPERM' || err.code === 'EBUSY') {
			return true; // Arquivo em uso
		}
		throw err; // Outro erro inesperado
	}
}
export { pdfAberto };
