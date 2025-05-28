import { Request, Response } from 'express';
import Aluno from '../models/Alunos'
import { Sequelize, sequelize } from '../models/database';
import bcrypt from 'bcrypt';

const SECRET_KEY = 'w1fll5i3s3ob02ri3icrj7jb7qxw4tou3fiiwvvn25asctmoa8rqix1ugj2v5udkrkn8ywdl0nyp58jb7r89u8t5sh5xh7h2w29goqrfd0g3pd6g98o4o61o2iehd8f4';

export const adicionarAluno = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { nome_completo, usuario_acesso, senha, email_aluno, observacao } = req.body;
        if (
            !nome_completo ||
            !usuario_acesso ||
            !senha ||
            !email_aluno
        ) {
            await transaction.rollback();
            res.status(400).json({ error: 'Campos obrigatórios faltando' });
            return;
        }
        if (nome_completo.length > 128) {
            await transaction.rollback();
            res.status(400).json({ error: 'Nome completo excede o limite de 128 caracteres' });
            return;
        }

        if (usuario_acesso.length > 64) {
            await transaction.rollback();
            res.status(400).json({ error: 'Usuário de acesso excede o limite de 64 caracteres' });
            return;
        }
        const validarEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validarEmail.test(email_aluno)) {
            await transaction.rollback();
            res.status(400).json({ error: 'E-mail inválido' });
            return;
        }

        const usuarioExistente = await Aluno.findOne({ where: { usuario_acesso }, transaction });
        const emailExistente = await Aluno.findOne({ where: { email_aluno }, transaction });

        if (usuarioExistente) {
            await transaction.rollback();
            res.status(400).json({ error: 'Usuário de acesso já cadastrado' });
            return;
        }

        if (emailExistente) {
            await transaction.rollback();
            res.status(400).json({ error: 'E-mail já cadastrado' });
            return;
        }
        const senha_hash = await bcrypt.hash(senha, 10);
        await Aluno.create({ nome_completo, usuario_acesso, senha_hash, email_aluno, observacao }, { transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Cadastrado com sucesso!' });
    } catch (error: any) {
        await transaction.rollback();
        res.status(500).json({ error: 'Erro ao adicionar aluno', details: error.message });
    }
}

export const loginAluno = async (req: Request, res: Response) => {
    try {
        const { usuario_acesso, senha } = req.body;
        const buscarAluno = await Aluno.findOne({ where: { usuario_acesso } });
        if (!buscarAluno) {
            res.status(401).json({ error: 'Usuário ou senha incorretos' });
            return;
        }
        const passwordMatch = await bcrypt.compare(senha, buscarAluno.senha_hash);
        if ( !passwordMatch) {
            res.status(401).json({ error: 'Usuário ou senha incorretos' });
            return;
        }

        res.status(200).json({ message: 'Login bem-sucedido', buscarAluno });
    } catch (error) {
        res.status(500).json({ error: `Erro ao encontrar o aluno ${req.params.id}` })
    }
}

export const mostrarAluno = async (req: Request, res: Response) => {
    try {
        const aluno = await Aluno.findByPk(req.params.id);
        if (!aluno) {
            res.status(400).json({ error: 'Aluno não encontrado' });
        }
        res.status(200).json(aluno);
    } catch (error) {
        res.status(500).json({ error: `Erro ao encontrar o aluno ${req.params.id}` })
    }
};

export const todosAlunos = async (req: Request, res: Response) => {
    try {
        const alunos = await Aluno.findAll();
        res.status(200).json(alunos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar todos os alunos!' });
    }
};
