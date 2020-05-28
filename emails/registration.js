const keys=require('../keys')
module.exports=function(email){
    return{
        to: email,
        from: keys.EMAIL_FROM,
        subject:'Акаунт создан',
        html:`<h1>Добро пожаловать:  ${email}</h1>
        <h2>Перейти на <a href="${keys.BASE_URL}"> Главную страницу</a></h2>`
    }
}