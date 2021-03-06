const { Router } = require("express");
const bcrypt = require("bcryptjs");
const router = Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const regEmail = require("../emails/registration");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const resetEmail = require("../emails/reset");
const keys = require("../keys");
const { validationResult } = require("express-validator");
const { registerValidators } = require("../middleware/validators");
const { loginValidators } = require("../middleware/validators");
const { resetValidators } = require("../middleware/validators");
sgMail.setApiKey(keys.SENDGRID_API_KEY);

//переход на страницу логина
router.get("/login", auth.profile, (req, res) => {
  //рендерим эту страницу
  res.render("auth/login", {
    title: "Войти",
    isLogin: true,
    loginError: req.flash("loginError"),
    style: "/login.css",
  });
});
//переход на страницу регистрации
router.get("/register", auth.profile, (req, res) => {
  //рендерим эту страницу
  res.render("auth/register", {
    title: "Регистрация",
    isRegister: true,
    registerError: req.flash("registerError"),
    completeRegister: req.flash("completeRegister"),
    style: "/register.css",
  });
});

//обработка захода пользователя
router.post("/login", loginValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("loginError", errors.array()[0].msg);
      return res.status(422).render("auth/login", {
        title: "Войти",
        isLogin: true,
        loginError: req.flash("loginError"),
        script: "/auth.js",
        style: "/login.css",
        dataInput: {
          email: req.body.email,
        },
      });
    }
    const candidate = await User.findOne({ email: req.body.email });
    req.session.user = candidate;
    req.session.isAuthenticated = true;
    req.session.save((err) => {
      if (err) throw err;
      res.redirect("/modes");
    });
  } catch (error) {
    console.log(error);
  }
});

//обработка регистрации пользователя
router.post("/register", registerValidators, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("registerError", errors.array()[0].msg);
      return res.status(422).render("auth/register", {
        title: "Регистрация",
        isLogin: true,
        style: "/register.css",
        registerError: req.flash("registerError"),
        dataInput: {
          name: name,
          email: email,
        },
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      password: hashPassword,
    });
    await user.save();
    //отправка письма пользователю
    await sgMail.send(regEmail(email));

    console.log("отправилось ПИСЬМО");
    req.flash(
      "completeRegister",
      "Письмо с подтверждением отправлено на почту"
    );
    res.render("auth/register", {
      title: "Регистрация",
      isLogin: true,
      style: "/register.css",
      completeRegister: req.flash("completeRegister"),
    });
  } catch (error) {
    console.log("Ooops...Регистрация провалена...");
    console.log(error);
  }
});

//переход на страницу сброса пароля
router.get("/reset",  async (req, res) => {
  try {
    res.render("auth/reset", {  
      title: "Восстановление пароля",
      style: "/reset.css",
      error: req.flash("error"),
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/reset", resetValidators, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array()[0].msg);
      return res.status(422).render("auth/reset", {
        title: "Восстановление пароля",
        style: "/reset.css",
        error: req.flash("error"),
        dataInput: {
          email: req.body.email,
        },
      });
    }
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("error", "Что-то пошло не так, повторите попытку");
        return res.redirect("/auth/reset");
      }
      const candidate = await User.findOne({ email: req.body.email });
      const token = buffer.toString("hex");
      candidate.resetToken = token;
      candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
      await candidate.save();
      //отправка письма пользователю для восстановления пароля
      await sgMail.send(resetEmail(candidate.email, token));
      console.log("Письмо для сброса пароля отправлено");
      req.flash("completeReset", "Письмо для восстановления отправлено");
      res.render("auth/reset", {
        title: "Восстановление пароля",
        style: "/reset.css", 
        error: req.flash("error"),
        completeRegister: req.flash("completeReset"),

        dataInput: {
          email: req.body.email,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
});

//страница восстановления пароль (ссылка на нее в письме)
router.get("/password/:token", auth.profile, async (req, res) => {
  if (!req.params.token) {
    console.log("нет токена");

    return res.redirect("auth/reset");
  }
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    });
    if (!user) {
      console.log("нет user");

      return res.redirect("auth/reset");
    } else {
      res.render("auth/password", {
        title: "Восстановить доступ",
        error: req.flash("error"),
        userId: user._id.toString(),
        token: req.params.token,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//пользователь вводит новый пароль и переходит в окно логина
router.post("/password", async (req, res) => {
  try {
    //сначала проверяем правильность пароля
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("registerError", errors.array()[0].msg);
      return res.status(422).render("/password/:token", {
        title: "Восстановление пароля",
        registerError: req.flash("registerError"),
      });
    }
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    }); 
    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect("/auth/login"); 
    } else {
      req.flash("error", "Время жизни токена истекло");
      res.redirect("/auth/login");
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
