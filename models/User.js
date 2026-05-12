/**
 * User Model - Matching Existing Schema
 */
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role: {
      type: DataTypes.ENUM('farmer', 'buyer', 'supplier', 'extension', 'admin'),
      allowNull: false,
      defaultValue: 'farmer'
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    language: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'nyanja'
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: false, // Using custom timestamp fields
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          const salt = await bcrypt.genSalt(12);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      }
    }
  });

  User.prototype.checkPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
  };

  return User;
};