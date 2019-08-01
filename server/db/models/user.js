const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET = "" } = process.env;

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        username: {
          type: Sequelize.STRING,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          allowNull: true
        }
      },
      {
        indexes: [
          {
            unique: true,
            fields: ["username"]
          }
        ],
        hooks: {
          beforeCreate: async (user, options) => {
            user.password = await bcrypt.hash(
              user.password,
              bcrypt.genSaltSync(8)
            );
          }
        },
        sequelize,
        modelName: "user",
        freezeTableName: true
      }
    );
  }

  static associate(models) {
    User.hasMany(models.SecurityKey);
  }

  async authenticate(password) {
    return bcrypt.compare(password, this.password);
  }

  json() {
    return {
      id: this.id,
      username: this.username,
      ...(this.securitykeys !== undefined
        ? { securitykeys: this.securitykeys.map(k => k.json()) }
        : {})
    };
  }

  static verifyJwt(token) {
    return jwt.verify(token, JWT_SECRET);
  }

  getJwt() {
    return jwt.sign(
      {
        iss: "webauthn-demo-react-",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60, // 2 hour expiration time
        context: {
          user: this.json()
        }
      },
      JWT_SECRET
    );
  }

  static async findByUsername(username, opts = {}) {
    return User.findOne({ where: { username }, ...opts });
  }

  static async findById(id, opts = {}) {
    return User.findOne({ where: { id }, ...opts });
  }
}

module.exports = User;
