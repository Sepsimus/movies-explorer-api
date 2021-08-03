const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const { NotValidData } = require('../components/NotValidData');
const { Unauthorized } = require('../components/Unauthorized');
const { Conflict } = require('../components/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err));
};

module.exports.patchMe = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new Conflict('Пользователь с таким email уже создан');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidData('Переданы неккоретные данные');
      }
      next(err);
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    throw new NotValidData('Переданы неккоретные данные');
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email, password: hash, name: req.body.name,
    }))
    .then(() => res.status(200).send({ message: 'Пользователь создан' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidData('Переданы неккоретные данные');
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new Conflict('Пользователь с таким email уже создан');
      }
      next(err);
    })
    .catch((err) => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'Enigma', { expiresIn: '7d' });
          res.status(200).send({ token });
          return token;
        });
    })
    .catch((err) => next(err));
};
