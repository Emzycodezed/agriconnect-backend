const models = require('../models');

exports.createProduct = async (req, res) => {
  try {
    const { name, quantity, price, image_url } = req.body;
    if (!name || !quantity || !price) {
      return res.status(400).json({ success: false, message: "Name, quantity, and price required" });
    }
    const Product = models.Product;
    if (!Product) throw new Error("Product model not loaded");
    
    const product = await Product.create({
      farmer_id: req.user.id,
      name,
      quantity,
      price,
      image_url: image_url?.trim() || null
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Product creation error:", error.message);
    res.status(500).json({ success: false, message: "Failed to add product: " + error.message });
  }
};

exports.getFarmerProducts = async (req, res) => {
  try {
    const Product = models.Product;
    if (!Product) throw new Error("Product model not loaded");
    
    const products = await Product.findAll({ 
      where: { farmer_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Fetch products error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};
