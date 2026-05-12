/**
 * Crop Model
 * Tracks crops registered by farmers
 */
module.exports = (sequelize, DataTypes) => {
  const Crop = sequelize.define('Crop', {
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
    crop_type: {
      type: DataTypes.ENUM('maize', 'soybean', 'wheat', 'cassava', 'groundnut', 'cotton', 'sorghum', 'rice', 'sunflower', 'other'),
      allowNull: false
    },
    variety: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    planting_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    expected_harvest_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    quantity_kg: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Expected or actual quantity in kilograms'
    },
    status: {
      type: DataTypes.ENUM('planted', 'growing', 'ready_for_harvest', 'harvested', 'sold', 'failed'),
      defaultValue: 'planted'
    },
    quality_grade: {
      type: DataTypes.ENUM('grade_a', 'grade_b', 'grade_c', 'rejected'),
      allowNull: true
    },
    price_per_kg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    is_available_for_sale: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    location_lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    location_lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    ai_recommendations: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Store Gemini AI advice for this crop'
    }
  }, {
    tableName: 'crops',
    timestamps: true,
    underscored: true
  });

  return Crop;
};