const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
    //рендерим эту страницу
    res.render("fastMatch", {
        title: "Быстрый матч",
        isFastMatch: true,
        script: '/fastMatch.js',
        style: '/fastMatch.css',
    });
});

module.exports = router;
