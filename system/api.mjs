import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compRouter from '../apis/components.mjs';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api/components',compRouter);
export default app;
