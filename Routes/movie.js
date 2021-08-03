const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi-oid');
const { isURL } = require('validator');
const { getMovies, postMovie, deleteMovie } = require('../Controllers/movie');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка image');
    }),
    trailer: Joi.string().required(),
    /* .custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка trailer');
    }), */
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка thumbnail');
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.objectId(),
  }),
}), deleteMovie);

module.exports = router;
