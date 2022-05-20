const { DataTypes } = require('sequelize');

const UserModel = (sequelize) => {
    const attributes = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
    };

    return sequelize.define('User', attributes);
}

module.exports = UserModel