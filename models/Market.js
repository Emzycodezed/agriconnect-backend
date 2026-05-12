/**
 * Market Model
 * Market information for crop prices
 */
module.exports = (sequelize, DataTypes) => {
  const Market = sequelize.define('Market', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    buyer_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    product: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    price_per_kg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    quantity_kg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'markets',
    timestamps: false,
    underscored: true
  });

  return Market;
};
