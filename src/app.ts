import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import request, { SuperAgentRequest } from 'superagent';
import { CustomError, NotFoundError, PublishFailError } from './errors';

const subscribers: Record<string, string[]> = {};
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(compression());

app.post('/publish/:topic', async (req, res) => {
  const { topic } = req.params;
  const requests: SuperAgentRequest[] = [];

  subscribers[topic]?.forEach((url) => {
    requests.push(request.post(url).send({ topic, data: req.body }));
  });

  try {
    await Promise.all(requests);
    res.send({ topic, data: req.body });
  } catch (error) {
    throw new PublishFailError(error.response.text);
  }
});

app.post('/subscribe/:topic', (req, res) => {
  const { topic } = req.params;
  const { url } = req.body;

  if (subscribers[topic]) {
    if (!subscribers[topic].includes(url)) subscribers[topic].push(url);
  } else subscribers[topic] = [url];

  console.log(subscribers);

  res.send({ topic, url });
});

app.all('*', (req, res) => {
  throw new NotFoundError();
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError)
    res.status(err.statusCode).send({ errors: err.message });
  else {
    console.error(err);
    res.status(400).send('Something went wrong');
  }
});

export default app;
