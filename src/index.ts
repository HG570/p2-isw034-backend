import express, { Request, Response } from 'express';
import { sequelize } from './models/database';
import alunoRoutes from './routes/alunoRoutes';

const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true
}));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! Isso está funcionando :)');
});

app.listen(port, () => {
  console.log(`Rodando em http://localhost:${port}`);
});

app.get('/database', (req: Request, res: Response) => {
    (async () => {
        try {
          await sequelize.sync({ force: true });
          console.log('Tabelas geradas com sucesso!');
          res.send('Tabelas geradas com sucesso!');
        } catch (error) {
          console.error('Erro ao gerar tabelas:', error);
          res.send('Erro ao gerar tabelas');
        }
      })();
});
//npm install @react-navigation/native-stack 
app.use(express.json());
app.use('/aluno', alunoRoutes);