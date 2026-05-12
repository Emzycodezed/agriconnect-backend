module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    buyer_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.STRING(50), allowNull: false },
    total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed'), defaultValue: 'pending' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'orders', timestamps: false, underscored: true });
};