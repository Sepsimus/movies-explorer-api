const Movie = require('../Models/movie');
const { NotFoundError } = require('../components/NotFoundError');
const { NotValidData } = require('../components/NotValidData');
const { MethodNotAllowed } = require('../components/MethodNotAllowed');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => next(err));
};

module.exports.postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((err) => {
      res.send(err);
      if (err.name === 'ValidationError') {
        throw new NotValidData('Переданы неккоретные данные');
      }
      next(err);
    })
    .catch((err) => next(err));
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найдена');
      }
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new MethodNotAllowed('Метод не дозволен');
      } else {
        return movie.remove().then(() => res.status(200).send({ message: 'Фильм удален' }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidData('Переданы неккоретные данные');
      }
      next(err);
    })
    .catch((err) => next(err));
};
