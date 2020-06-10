const { Router } = require("express");
const router = Router();
//экспорт middleWare auth, для зашиты ссылки на профиль, если нет авторизации
const auth = require("../middleware/auth");
const User = require("../models/user");
const Statistic = require("../models/statistic");
const statService = require("../statisticsService");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { profileValidators } = require("../middleware/validators");
const { resetPasswordValidators } = require("../middleware/validators");
let date = new Date();

let isInput = false;
let dataInput = {};

router.get("/", auth.auth, async (req, res) => {
  let stat = await Statistic.findOne({ userId: req.user });
  //рендерим эту страницу
  res.render("profile/profile", {
    title: "Профиль",
    style: "/profile.css",
    script: "/profile.js",
    isLogin: true,
    user: req.user.toObject(),
    allStat: statService.statisticToProfile(stat),
    stat: stat.toObject(),
  });
});
router.get("/getStatistic", async (req, res) => {
  let stat = await Statistic.findOne({ userId: req.user });
  console.log("статистика отправлена");
  res.json(stat); 
});


router.get("/setting", auth.auth, (req, res) => {
  //рендерим эту страницу
  res.render("profile/setting", {
    title: "Настройки профиля",
    isLogin: true,
    style: "/profile-setting.css",
    user: req.user.toObject(),
    settingLinkActive: "active",
    settingContentShow: "show active",
    completeSetting: req.flash("completeSetting"),
    settingError: req.flash("settingError"),
    completeUpdatePassword: req.flash("completeUpdatePassword"),
    isInput,
    dataInput,
  });
  isInput = false;
});

//изменение профиля
router.post("/setting", auth.auth, profileValidators, async (req, res) => {
  dataInput = {
    name: req.body.name,
    bio: req.body.bio,
    city: req.body.city,
    school: req.body.school,
  };
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      isInput = true;
      req.flash("settingError", errors.array()[0].msg);
      return res.status(422).redirect("/profile/setting");
    }
    isInput = false;

    const user = await User.findById(req.user._id);
    const toChange = {
      ...dataInput,
      lookstat: req.body.lookstat !== undefined ? true : false,
    };

    if (req.file) {
      toChange.avatarUrl = req.file.path;
    }

    Object.assign(user, toChange);
    await user.save();
    console.log("Профиль успешно изменен");

    req.flash("completeSetting", "Профиль успешно изменен!");
    res.redirect("/profile/setting");
  } catch (error) {
    console.log(error);
  }
});

//изменение пароля в настройках
router.post(
  "/updatePassword",
  auth.auth,
  resetPasswordValidators,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);

        req.flash("updatePasswordError", errors.array()[0].msg);
        return res.status(422).render("profile/setting", {
          title: "Настройки профиля",
          isLogin: true,
          style: "/profile-setting.css",
          user: req.user.toObject(),
          privateLinkActive: "active",
          privateContentShow: "show active",
          updatePasswordError: req.flash("updatePasswordError"),
        });
      }
      const user = await User.findById(req.user._id);
      user.password = await bcrypt.hash(req.body.newPassword, 10);

      await user.save();
      console.log("Пароль успешно изменен");

      req.flash("completeUpdatePassword", "Пароль успешно изменен!");
      res.redirect("/profile/setting");
    } catch (error) {
      console.log(error);
    }
  }
);

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
