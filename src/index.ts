import express, { Request, Response } from 'express';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen('0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
