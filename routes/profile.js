const { Router } = require("express");
const router = Router();
//экспорт middleWare auth, для зашиты ссылки на профиль, если нет авторизации
const auth=require('../middleware/auth')
const User = require("../models/user");


router.get("/", auth.auth, (req, res) => {
    //рендерим эту страницу
    res.render("profile", {   
        title: "Профиль",
        isLogin: true, 
        user: req.user.toObject() ,
    }); 
});
  
router.post('/',auth.auth, async(req,res)=>{
    try {
        const user=await User.findById(req.user._id)
        const toChange={
            name: req.body.name
        }
        console.log(req.file);
        
        if(req.file){
            toChange.avatarUrl=req.file.path
        }

        Object.assign(user,toChange)
        await user.save()
        res.redirect('/profile')
    } catch (error) {
        console.log(error);
        
    }
})

router.get("/logout", (req, res) => {
     
    req.session.destroy(() => { 
        res.redirect("/auth/login#login"); 
        
    }); 
});
module.exports = router;
 