const { Order, Supplier, Product } = require('../models');

exports.createFarmerOrder = async (req, res) => {
  try {
    const { supplier_id, product_name, quantity, total_price, delivery_location } = req.body;
    if (!supplier_id || !product_name || !quantity || !total_price) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const order = await Order.create({
      farmer_id: req.user.id,
      supplier_id,
      product_name,
      quantity,
      total_price,
      status: 'pending',
      payment_status: 'pending',
      delivery_location
    });
    res.status(201).json({ success: true, data: order, message: "Order placed. Awaiting supplier approval." });
  } catch (error) {
    console.error("Order error:", error.message);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
};

exports.getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ 
      where: { farmer_id: req.user.id },
      order: [['created_at','DESC']],
      limit: 20
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.update({ status: 'cancelled' }, { where: { id, farmer_id: req.user.id, status: 'pending' } });
    res.json({ success: true, message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cancel failed" });
  }
};
