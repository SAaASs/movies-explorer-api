const { celebrate, Joi } = require("celebrate");

module.exports.createUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});
module.exports.patchUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
  }),
});
module.exports.loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
module.exports.errHandler = (err, req, res, next) => {
  if (err.statusCode == 500 || !err.statusCode) {
    res.status(500).send({ message: "Неизвестная ошибка сервера" });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
};
