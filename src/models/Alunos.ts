import { Sequelize, sequelize } from './database';

const Alunos = sequelize.define('alunos', {
    id_aluno: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome_completo: {
        type: Sequelize.STRING(128),
        allowNull: false
    },
    usuario_acesso: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    senha_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    email_aluno: {
        type: Sequelize.STRING(64),
        unique: true,
        validate: {
            isEmail: true
        }
    },
    observacao: {
        type: Sequelize.STRING(128),
        allowNull: true
    },
    data_cadastro: {
        type: Sequelize.DATE(),
        defaultValue: Sequelize.NOW,
    }
}, { freezeTableName: true });

export default Alunos;