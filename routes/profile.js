const { Router } = require("express");
const router = Router();
//экспорт middleWare auth, для зашиты ссылки на профиль, если нет авторизации
const auth = require("../middleware/auth");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { profileValidators } = require("../middleware/validators");

router.get("/", auth.auth, (req, res) => {
  //рендерим эту страницу
  res.render("profile/profile", {
    title: "Профиль",
    style: "/profile.css",
    isLogin: true,
    user: req.user.toObject(),
  });
});

router.get("/setting", auth.auth, (req, res) => {
  //рендерим эту страницу
  res.render("profile/setting", {
    title: "Настройки профиля",
    isLogin: true,
    style: "/profile-setting.css",
    user: req.user.toObject(),
  });
});

router.post("/setting", auth.auth, profileValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("settingError", errors.array()[0].msg);
      return res.status(422).render("profile/setting", {
        title: "Настройки профиля",
        isLogin: true,
        style: "/profile-setting.css",
        user: req.user.toObject(),
        settingError: req.flash("settingError"),
        isInput: true,
        dataInput: {
          name: req.body.name,
          bio: req.body.bio,
          city: req.body.city,
          school: req.body.school,
        },
      });
    }
    const user = await User.findById(req.user._id);
    const toChange = {
      name: req.body.name,
      bio: req.body.bio,
      city: req.body.city,
      school: req.body.school,
      lookstat: req.body.lookstat !== undefined ? true : false,
    };
    if (req.file) {
      toChange.avatarUrl = req.file.path;
    }

    Object.assign(user, toChange);
    await user.save();
    console.log("Профиль успешно изменен");

    req.flash("completeSetting", "Профиль успешно изменен!");
    res.render("profile/setting", {
      title: "Настройки профиля",
      isLogin: true,
      style: "/profile-setting.css",
      user: user.toObject(),
      completeSetting: req.flash("completeSetting"),
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/progress", auth.auth, (req, res) => {
  //рендерим эту страницу
  res.render("profile/progress", {
    title: "Профиль",
    isLogin: true,
    user: req.user.toObject(),
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});
module.exports = router;
