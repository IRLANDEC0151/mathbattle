if(process.env.NODE_ENV==='production'){
   //комент
    module.exports=require('./keys.prod')

}else{
    module.exports=require('./keys.dev')
} 