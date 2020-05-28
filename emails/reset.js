const keys = require("../keys");

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Восстановление пароля",
    html: `<h1>Вы забыли пароль?  </h1>
        <h2>Если нет, то проигнорируйте это письмо </h1>
        <p>Иначе нажмите на ссылку ниже для восстановления пароля </p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}"> Восстановить доступ</a></p>`,
  };
};
