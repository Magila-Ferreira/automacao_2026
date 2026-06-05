import { exec } from 'child_process';

function alertarFimDoProcesso() {
	 exec('schtasks /run /tn "Alerta_Automacao_2026"', 
    (err, stdout, stderr) => {
        if (err) {
            console.error('Erro ao executar tarefa:', err);
            return;
        }
        console.log('Alerta disparado.');
    });
}
export { alertarFimDoProcesso };