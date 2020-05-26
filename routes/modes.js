const { Router } = require("express");
const router = Router();


router.get("/", (req, res) => {

    //рендерим эту страницу
    res.render("modes", {
       title: "Режимы",
       isModes: true,
       style: '/modes.css',
   });
  });
  

  module.exports=router