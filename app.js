require("dotenv").config();
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const bodyParser = require("body-parser");
require("events").EventEmitter.defaultMaxListeners = 20;
const { celebrate, Joi } = require("celebrate");
const cookieParser = require("cookie-parser");
const express = require("express");
const { login, createUser } = require("./constrollers/users");
const { userRouter } = require("./routes/users");
const { errHandler } = require("./middlewares/errHandler");
const { auth } = require("./middlewares/auth");
const { movieRouter } = require("./routes/movies");
const { errHandler } = require("./middlewares/errHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const {
  createUserValidator,
  loginUserValidator,
} = require("./middlewares/errHandler");
// Слушаем 3000 порт
const { PORT = 3001 } = process.env;
mongoose.connect("mongodb://127.0.0.1:27017/movieexplorerdb");
const app = express();
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // для приёма веб-страниц внутри POST-запроса
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser
);
app.use(auth);
app.use("/users/", userRouter);
app.use("/movies/", movieRouter);
app.use(errorLogger);
app.use(errors());
app.use(errHandler);
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
