/**
 * FRA Record Model
 * Government maize purchases and strategic reserves
 */
module.exports = (sequelize, DataTypes) => {
  const FraRecord = sequelize.define('FraRecord', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    farmer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'farmers',
        key: 'id'
      }
    },
    season: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'e.g., 2023-2024'
    },
    quantity_mt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Quantity in metric tonnes'
    },
    price_per_mt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Price per metric tonne in ZMW'
    },
    total_value: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    grade: {
      type: DataTypes.ENUM('grade_a', 'grade_b', 'grade_c', 'rejected'),
      allowNull: false
    },
    moisture_content: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
      comment: 'Percentage'
    },
    delivery_depot: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    purchase_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('delivered', 'inspection_pending', 'accepted', 'rejected', 'paid'),
      defaultValue: 'delivered'
    },
    receipt_number: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    }
  }, {
    tableName: 'fra_records',
    timestamps: true,
    underscored: true
  });

  return FraRecord;
};