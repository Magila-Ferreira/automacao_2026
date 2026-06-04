import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import notifier from 'node-notifier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pastaPDF = path.resolve(__dirname, '..', '..', 'arquivosPgr', 'pdf');

const alertarFimDoProcesso = () => {
    notifier.notify({
        title: 'Análise concluída',
        message: 'Os PDFs foram gerados com sucesso!',
    });
    exec(`explorer "${pastaPDF}"`);
}
export { alertarFimDoProcesso };