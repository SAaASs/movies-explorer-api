const Mongoose = require("mongoose");
const Movie = require("../models/movie");
const NotFoundError = require("../errors/NotFoundError");
const ForbidenError = require("../errors/ForbidenError");
const BadRequestError = require("../errors/BadRequestError");

module.exports.getAllMovies = (req, res, next) => {
  console.log("req.user", req.user);
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.deleteMovieById = (req, res, next) => {
  const sees = req.params.movieId;
  const currentUser = req.user._id;
  Movie.findById(sees)
    .then((movie) => {
      if (movie != null) {
        console.log("movie.owner", movie.owner, "currentUser", currentUser);
        if (movie.owner.toString() == currentUser.toString()) {
          Movie.findByIdAndRemove(sees)
            .then((movie) => {
              res.send(movie);
            })
            .catch((err) => {
              next(err);
            });
        } else {
          next(
            new ForbidenError("Это не ваща карточка, вы не можете ее удалить")
          );
        }
      } else {
        next(new NotFoundError("Карточки с такми id не существует"));
      }
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create(
    [
      {
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        thumbnail,
        movieId,
        nameRU,
        nameEN,
        owner,
      },
    ],
    { runValidators: true }
  )
    .then((movie) => {
      res.send(movie[0]);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ForbidenError(err.message));
        return;
      }
      next(err);
    });
};
