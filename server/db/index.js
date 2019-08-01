const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

const User = require("./models/user");
const SecurityKey = require("./models/securityKey");

const models = {
  User: User.init(sequelize),
  SecurityKey: SecurityKey.init(sequelize)
};

Object.values(models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models));

module.exports = {
  sequelize,
  ...models
};
