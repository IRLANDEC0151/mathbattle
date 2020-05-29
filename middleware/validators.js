const { body } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.registerValidators = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage(
      "Имя должно содержать только буквы и цифры"
    ),
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
  body(
    "password",
    "Слишком короткий пароль"
  )
    .isLength({ min: 6, max: 30 })
    .isAlphanumeric()
    .trim(),
  body("confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("пароли должны совпадать");
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
  body("password")
    .custom(async (value, { req }) => { 
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
    })
    .withMessage("!!!!!!!!!!!!!!!!"),
];
exports.resetValidators=[
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
    }) 
]
