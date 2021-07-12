const router = require('express').Router();
const { getMovies, postMovie, deleteMovie } = require('../Controllers/movie');

router.get('/', getMovies);

router.post('/', postMovie);

router.delete('/:movieId', deleteMovie);

module.exports = router;
