exports.auth=function (req,res,next){
    if(!req.session.isAuthenticated){
        return res.redirect('/auth/login')
    }
    next()
}

exports.profile=function(req,res,next){
    if(req.session.isAuthenticated){
        return res.redirect('/profile')
    }
    next()
}