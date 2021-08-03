require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { celebrate, errors } = require('celebrate');
const Joi = require('joi-oid');
const { createUser, login } = require('./Controllers/user');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./components/NotFoundError');
const { errorHandler } = require('./middlewares/centralizedErrorHandler');

const { DB_LINK, NODE_ENV } = process.env;

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

/* app.use((req, res, next) => {
  req.user = { _id: '60ec06074109d1432c904425' };
  next();
}); */

app.use(auth, require('./Routes/user'));

app.use(auth, require('./Routes/movie'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

mongoose.connect(NODE_ENV === 'production' ? DB_LINK : 'mongodb://localhost:27017/movie-explorer', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(3000);
