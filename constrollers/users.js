require("dotenv").config();
const Mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const ForbidenError = require("../errors/ForbidenError");
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create(
        [
          {
            email,
            password: hash,
            name,
          },
        ],
        {
          runValidators: true,
        }
      )
        .then((user) => {
          res.send({
            _id: user[0]._id,
            name: user[0].name,
            email: user[0].email,
          });
        })
        .catch((err) => {
          if (err.code == 11000) {
            next(new ConflictError(err.message));
            return;
          }
          if (err.name === "ValidationError") {
            next(new ForbidenError(err.message));
            return;
          }
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(process.env.JWT_SECRET);
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token: token });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.getCurrentUser = (req, res, next) => {
  const { email, password } = req.body;
  res.status(200).send(req.user);
};
module.exports.patchCurrentUser = (req, res, next) => {
  const { name } = req.body;
  const updMaterial = {};
  updMaterial.name = name;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, updMaterial, { runValidators: true, new: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ForbidenError(err.message));
        return;
      }
      next(err);
    });
};
