require("dotenv").config();
const jwt = require("jsonwebtoken");
const UnauthorisedError = require("../errors/UnauthorisedError");
const User = require("../models/user");
const user = require("../models/user");
module.exports.auth = (req, res, next) => {
  const authorization = req.headers.authorisation;
  if (!authorization) {
    console.log("1st err");
    next(new UnauthorisedError("Необходима авторизация"));
    return;
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log("2nd err");
    next(new UnauthorisedError("Неправильный логин или пароль"));
    return;
  }
  console.log(payload._id);
  User.findById(payload._id).then((user) => {
    req.user = user;
    console.log(req.user);
    next();
  });
  // пропускаем запрос дальше
};
