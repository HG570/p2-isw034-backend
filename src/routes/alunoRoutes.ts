import express from 'express';
import { adicionarAluno, loginAluno, mostrarAluno, todosAlunos } from '../controllers/alunoController';

const router = express.Router();

router.post('/add', adicionarAluno);

router.post('/login', loginAluno);

router.get('/show/:id', mostrarAluno);

router.get('/all', todosAlunos);

export default router;