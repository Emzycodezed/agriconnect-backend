module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    farmer_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(150), allowNull: false },
    quantity: { type: DataTypes.STRING(50), allowNull: false },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    image_url: { type: DataTypes.STRING(512), allowNull: true }
  }, {
    tableName: 'products',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: false
  });
  return Product;
};
