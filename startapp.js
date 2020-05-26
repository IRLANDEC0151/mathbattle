const path = require("path");
const express = require("express");
//шаблонизатор
const exphbs = require("express-handlebars");
//сессия пользователя
const session = require("express-session");
//сессии в mongoDB
const MongoStore = require("connect-mongodb-session")(session);
//экспорт роутеров
const homeRoutes = require("./routes/home");
const fastMatchRoutes = require("./routes/fastMatch");
const modesRoutes = require("./routes/modes");
const leaderboardRoutes = require("./routes/leaderboard");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const standardMatchRouters = require("./routes/modes/standardModes");
//подключаем middleware
const varMiddleWare = require("./middleware/variables");
const userMiddleWare = require("./middleware/user");
//проверка аватарки
const fileMiddleWare = require("./middleware/file");
//mongoose
const mongoose = require("mongoose");
//для защиты frontend
const csrf = require("csurf");
//для ошибок в auth
const flash = require("connect-flash");

//экспорт ключей
const keys = require("./keys");
const PORT = process.env.PORT || 8000

const app = express();
//ошибка 404
const errorHandler = require("./middleware/error404");
//защита helmet
const helmet=require('helmet')
//сжатие файлов
const compression=require('compression')
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

const store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI,
});
//регистрируем движок
app.engine("hbs", hbs.engine);
//используем движок
app.set("view engine", "hbs");
//место где лежат наши шаблоны
app.set("views", "views");

//регистрируем доступ к  css и js
app.use(
  express.static(path.join(__dirname, "public", "css")),
  express.static(path.join(__dirname, "public", "img")),
  express.static(path.join(__dirname, "public", "js"))
);
app.use('/images',express.static(path.join(__dirname, "images")),)
//чтобы работал req.body
app.use( 
  express.urlencoded({
    extended: true,
  })
);
//сессия пользователя 
app.use(
  session({
    secret: keys.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(fileMiddleWare.single("avatar"));
app.use(csrf());
app.use(flash());
app.use(helmet())
app.use(compression()) 
app.use(varMiddleWare);
app.use(userMiddleWare);

app.use("/", homeRoutes);
app.use("/fastMatch", fastMatchRoutes);
app.use("/modes", modesRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/modes", standardMatchRouters);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongoose запущен");

    app.listen(PORT, () => {
      console.log(`Сервер запущен: ${PORT} `);
    });
  } catch (error) {
    console.log("Ooops");
    console.log(error);
  }
}

start();

//TODO: @root. переменная глобальная в hbs
