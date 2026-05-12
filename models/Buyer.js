/**
 * Buyer Model
 * Profile for crop buyers (individuals, companies, exporters)
 */
module.exports = (sequelize, DataTypes) => {
  const Buyer = sequelize.define('Buyer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    nrc: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ward: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true
    }
  }, {
    tableName: 'buyer_profiles',
    timestamps: true,
    underscored: true
  });

  Buyer.associate = function(models) {
    Buyer.belongsTo(models.User, { foreignKey: 'user_id' });
    Buyer.hasMany(models.Order, { foreignKey: 'buyer_id' });
  };

  return Buyer;
};