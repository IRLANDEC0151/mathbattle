const { body } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.registerValidators = [
  body("name")
    .trim()
    .isAlpha()
    .withMessage("Имя должно содержать только буквы")
    .isLength({ min: 2 }),
  body("email")
    .isEmail()
    .withMessage("Некорректный email")
    .custom(async (value, req) => {
      try {
        const candidate = await User.findOne({ email: value });
        if (candidate) {
          return Promise.reject("Пользователь с таким email уже существует");
        }
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail(),
  body("password", "Слишком короткий пароль").isLength({ min: 6 }).trim(),
  body("confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Пароли должны совпадать");
    }
    return true;
  }),
];
exports.loginValidators = [
  body("email")
    .custom(async (value) => {
      try {
        const candidate = await User.findOne({ email: value });
        if (!candidate) {
          return Promise.reject("Неверный email или пароль");
        }
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail(),
  body("password").custom(async (value, { req }) => {
    try {
      const candidate = await User.findOne({ email: req.body.email });
      if (!candidate) {
        return Promise.reject("Неверный email или пароль");
      }
      const pass = await bcrypt.compare(value, candidate.password);

      if (!pass) {
        return Promise.reject("Неверный email или пароль");
      }
    } catch (error) {
      console.log(error);
    }
  }),
];
exports.resetValidators = [
  body("email")
    .isEmail()
    .withMessage("Некорректный email")
    .custom(async (value, req) => {
      try {
        const candidate = await User.findOne({ email: value });

        if (!candidate) {
          return Promise.reject("Такой пользователь не зарегистрирован");
        }
      } catch (error) {
        console.log(error);
      }
    }),
];

exports.profileValidators = [
  body("name")
    .isAlpha()
    .withMessage("Имя должно содержать только буквы")
    .isLength({ min: 2 })
    .withMessage("Слишком короткое имя")
    .trim(),
];

exports.resetPasswordValidators = [
  body("userPassword").custom(async (value, { req }) => {
    const candidate = await User.findOne({ email: req.user.email });
    const pass = await bcrypt.compare(value, candidate.password);
    if (!pass) {
      return Promise.reject("Вы ввели неверный пароль");
    }
  }),
  body("newPassword", "Слишком короткий пароль").isLength({ min: 6 }).trim(),
  body("confirmNewPassword")
    .custom(async (value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Пароли должны совпадать");
      }
      const candidate = await User.findOne({ email: req.user.email });
      const pass = await bcrypt.compare(value, candidate.password);
      if (pass) {
        throw new Error("Новый пароль совпадает с текущим");
      }
      return true;
    })
    .trim(),
];
