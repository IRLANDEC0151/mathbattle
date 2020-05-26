const { Router } = require("express");
const bcrypt = require("bcryptjs");
const router = Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");
const regEmail = require("../emails/registration");
const crypto = require("crypto");
const resetEmail = require("../emails/reset");
const mailgun = require("mailgun-js");
const { validationResult } = require("express-validator");
const { registerValidators } = require("../middleware/validators");
const { loginValidators } = require("../middleware/validators");
const { resetValidators } = require("../middleware/validators");
const mg = mailgun({
  apiKey: "5480804fcb699ec2eb4ae44c4cc8b408-e5e67e3e-0e9122f9",
  domain: "sandbox3856edfc68644f6184da0c6f32d41337.mailgun.org",
});

//переход на страницу логина
router.get("/login", auth.profile, (req, res) => {
  //рендерим эту страницу
  res.render("auth/login", {
    title: "Войти",
    isLogin: true,
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
    completeRegister: req.flash("completeRegister"),
    script: "/auth.js",
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
        registerError: req.flash("registerError"),
        script: "/auth.js",
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
    //существует ли пользователь?
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("registerError", errors.array()[0].msg);
      return res.status(422).render("auth/login", {
        title: "Войти",
        isLogin: true,
        loginError: req.flash("loginError"),
        registerError: req.flash("registerError"),
        script: "/auth.js",
        dataInput: {
          name: req.body.name,
          email: req.body.email,
        },
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      password: hashPassword,
      statistics: { items: [] },
    });
    await user.save();
    //отправка письма пользователю
    // await transporter.sendMail(regEmail(email));
    await mg.messages().send(regEmail(email), function (error, body) {
      console.log(body);
    });
    req.flash('completeRegister','Письмо с подтверждением отправлено на почту')
    console.log("отправилось ПИСЬМО");

    res.redirect("/auth/login#login");
  } catch (error) {
    console.log("Ooops...Регистрация провалена...");
    console.log(error);
  }
});

//переход на страницу сброса пароля
router.get("/reset", auth.profile, async (req, res) => {
  try {
    res.render("auth/reset", {
      title: "Восстановление пароля",
      error: req.flash("error"),
    });
  } catch (error) {
    console.log(error);
  }
});
//пользователь вводит email для восстановаления,
//ему отправляется письмо
//он переходит в окно логина
router.post("/reset", resetValidators, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array()[0].msg);
      return res.status(422).render("auth/reset", {
        title: "Восстановление пароля",
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
      await mg
        .messages()
        .send(resetEmail(candidate.email, token), function (error, body) {
          console.log(body);
        });
      res.redirect("/auth/login");
    });
  } catch (error) {
    console.log(error);
  }
});

//страница восстановления пароль (ссылка на нее в письме)
router.get("/password/:token", auth.profile, async (req, res) => {
  if (!req.params.token) {
    console.log("нет токена");

    return res.redirect("auth/login");
  }
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    });
    if (!user) {
      console.log("нет user");

      return res.redirect("auth/login");
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
