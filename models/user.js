const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UnauthorisedError = require("../errors/UnauthorisedError");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: "Жак-Ив Кусто",
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Username alraedy available"],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Это не email"], //Это уже валидирует Joi
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false }
);
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorisedError("Неправильные почта или пароль")
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorisedError("Неправильные почта или пароль")
          );
        }

        return user; // теперь user доступен
      });
    });
};
module.exports = mongoose.model("User", userSchema);
