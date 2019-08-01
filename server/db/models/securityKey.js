const Sequelize = require("sequelize");

class SecurityKey extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        credId: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        publicKey: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        counter: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: "securitykey",
        freezeTableName: true
      }
    );
  }

  static associate(models) {
    this.user = SecurityKey.belongsTo(models.User, { foreignKey: "userId" });
  }

  static async deleteAll(userId) {
    const keys = await SecurityKey.destroy({
      where: { userId }
    });

    return keys;
  }

  json() {
    return {
      id: this.id,
      name: this.name,
      credId: this.credId
    };
  }
}

module.exports = SecurityKey;
