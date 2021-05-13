/* eslint-disable import/no-cycle */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routes from './routes';
import HelperMethods from '../utils';

dotenv.config();

const port = process.env.PORT || 2003;
const app = express();

// Don't log to the console when running integration tests
if (app.get('env') !== 'test') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, }));

app.use(cors());

app.set('x-powered-by', false);

routes(app);

app.all('*', (req, res) => res.status(404).json({
  success: false,
  message: 'The page you are looking for does not exist'
}));

app.use(HelperMethods.checkExpressErrors);

app.listen(port, () => {
  console.info(`Server is up and listening on port ${port}`);
});

export default app;
