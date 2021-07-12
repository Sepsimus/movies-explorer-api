require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, errors } = require('celebrate');
const Joi = require('joi-oid');
const { createUser, login } = require('./Controllers/user');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./components/NotFoundError');

const app = express();

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

app.use('/users', auth, require('./Routes/user'));

app.use('/movies', auth, require('./Routes/movie'));

app.use(errorLogger);

app.use(errors());

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка Сервера' : message });
  next();
});

mongoose.connect('mongodb://localhost:27017/movie-explorer', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(3000);
