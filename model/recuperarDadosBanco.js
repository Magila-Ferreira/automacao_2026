import { gerenciadorDeConexoesBD, USUARIO_BD} from '../config/configBanco.js';

async function verificarSeOBancoExiste(nomeDoBanco) {
	const db = gerenciadorDeConexoesBD(null, USUARIO_BD);
	
	try { 
		const [rows] = await db.query('SHOW DATABASES LIKE ?', [nomeDoBanco]);
		return rows.length > 0;
	} catch (err) {
		console.error(`[ERRO] Falha ao verificar existência do banco: ${err.message}`);
		return false;
	} finally {
		await db.end();
	}
}
export { verificarSeOBancoExiste };
