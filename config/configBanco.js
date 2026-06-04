import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const NOME_BANCO_CONTROLE = 'controle_bancos';
export const USUARIO_BD = 'root';

// Obtém um pool de conexões com o banco
const gerenciadorDeConexoesBD = (database, usuario) => {
    // Seleciona as credenciais com base no usuário
    const configUsuarios = {
        root: {
            host: process.env.DB_ROOT_HOST,
            user: process.env.DB_ROOT_USER,
            password: process.env.DB_ROOT_PASSWORD,
        },
        adm: {
            host: process.env.DB_ADM_HOST,
            user: process.env.DB_ADM_USER,
            password: process.env.DB_ADM_PASSWORD,
        },
        user: {
            host: process.env.DB_USER_HOST,
            user: process.env.DB_USER_USER,
            password: process.env.DB_USER_PASSWORD,
        },
        readonly_user: {
            host: process.env.DB_READONLY_USER_HOST,
            user: process.env.DB_READONLY_USER_USER,
            password: process.env.DB_READONLY_USER_PASSWORD,
        },
    };

    if (database !== null && (typeof database !== 'string' || !database.trim())) {
        throw new Error('Nome do banco inválido.');
    }

    if (!configUsuarios[usuario]) {
        throw new Error(`Usuário de banco inválido: ${usuario}`);
    }

    const credenciais = configUsuarios[usuario];

    const configPool = {
        ...credenciais,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    };

    if (database) {
        configPool.database = database;
    }
    return mysql.createPool(configPool);
};
export { gerenciadorDeConexoesBD };