import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoBat = path.join(__dirname, 'mostrar_alerta.bat');

function alertarFimDoProcesso() {
	exec(`"${caminhoBat}"`, (error) => {
    if (error) {
        console.error('Erro ao executar BAT:', error);
        return;
    }
    console.log('Alerta PDF, executada com sucesso');
});
}
export { alertarFimDoProcesso };