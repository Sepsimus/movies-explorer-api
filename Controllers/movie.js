const Movie = require('../Models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((err) => res.status(500).send({ message: 'Ошибка сервера' }));
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
//  const { owner } = req.user._id;
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
    .catch((err) => res.status(500).send(err));
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        res.status(500).send({ message: 'Ошибка сервера' });
        return;
      }
      if (movie.owner != req.user._id) {
        res.status(500).send({ message: 'Ошибка сервера' });
        return;
      }else{
      Movie.findByIdAndRemove(req.params.movieId)
        .then(() => res.status(200).send({ message: 'Фильм удален' }));
      }
    })
    .catch((err) => res.status(500).send({ message: 'Ошибка сервера' }));
};
