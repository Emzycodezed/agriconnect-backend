/**
 * Farmer Model
 * Extended profile for farmers including farm details
 */
module.exports = (sequelize, DataTypes) => {
  const Farmer = sequelize.define('Farmer', {
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
    district: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ward: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    farm_size_ha: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    crops: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'farmer_profiles',
    timestamps: true,
    underscored: true
  });

  Farmer.associate = function(models) {
    Farmer.belongsTo(models.User, { foreignKey: 'user_id' });
    Farmer.hasMany(models.Product, { foreignKey: 'farmer_id' });
    Farmer.hasMany(models.Report, { foreignKey: 'farmer_id' });
  };

  return Farmer;
};