const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi-oid');
const { getMovies, postMovie, deleteMovie } = require('../Controllers/movie');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^(ftp|http|https):\/\/[^ "]+$/),
    trailer: Joi.string().required().pattern(/^(ftp|http|https):\/\/[^ "]+$/),
    thumbnail: Joi.string().required().pattern(/^(ftp|http|https):\/\/[^ "]+$/),
    movieId: Joi.objectId().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.objectId(),
  }),
}), deleteMovie);

module.exports = router;
