const keys=require('../keys')
module.exports=function(email){
    return{
        from: keys.EMAIL_FROM,
        to: email,
        subject:'Акаунт создан',
        html:`<h1>Добро пожаловать ${email}</h1>
        <h1>Добро пожаловать: <a href="${keys.BASE_URL}"> Главная страница</a></h1>`
    }
}