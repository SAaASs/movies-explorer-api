const userRouter = require("express").Router(); // создали роутер
const { getCurrentUser, patchCurrentUser } = require("../constrollers/users");
const { celebrate, Joi } = require("celebrate");
userRouter.get("/me", getCurrentUser);
userRouter.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
    }),
  }),
  patchCurrentUser
);
module.exports = { userRouter };
