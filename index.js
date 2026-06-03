import { inicializarPrograma } from './service/monitorarPasta.js';
import { agendarLimpezaMensal } from './service/agendarDelecaoDB.js';

function main () {
    try {
		inicializarPrograma();
		agendarLimpezaMensal(); // Inicia o agendamento
    }
    catch (error) {
        console.error("Erro ao iniciar o programa: ", error);
    }
}
main();