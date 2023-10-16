const movieRouter = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const {
  createMovie,
  deleteMovieById,
  getAllMovies,
} = require('../constrollers/movies');

movieRouter.get('/', getAllMovies);
movieRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().min(2),
      director: Joi.string().min(2),
      duration: Joi.number().required(),
      year: Joi.number().required(),
      description: Joi.string().min(2),
      image: Joi.string()
        .required()
        .pattern(
          /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
        ),
      trailerLink: Joi.string()
        .required()
        .pattern(
          /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
        ),
      thumbnail: Joi.string()
        .required()
        .pattern(
          /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
        ),
      movieId: Joi.number().required(),
      nameRU: Joi.string().min(2),
      nameEN: Joi.string().min(2),
    }),
  }),
  createMovie,
);
movieRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required().hex().length(24),
    }),
  }),
  deleteMovieById,
);
module.exports = { movieRouter };
