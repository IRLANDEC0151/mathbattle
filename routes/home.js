const { Router } = require("express");
const router = Router();


router.get("/", (req, res) => {
      //рендерим эту страницу
      res.render("home", {
        title: "Главная",
    });
  });
  

module.exports=router