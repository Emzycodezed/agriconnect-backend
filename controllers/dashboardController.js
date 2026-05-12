/**
 * Dashboard Controller
 * Role-specific dashboard endpoints for different user types
 */
const { User, FarmerProfile, BuyerProfile, SupplierProfile, Product, Order, Transaction, Advisory, Report, Complaint, Message, Market } = require('../models');
const { Op } = require('sequelize');
const { generateAgriculturalAdvice } = require('../utils/geminiService');

exports.getDashboard = async (req, res, next) => {
  try {
    const user = req.user;
    let dashboardData = {};

    switch (user.role) {
      case 'farmer':
        dashboardData = await getFarmerDashboard(user.id);
        break;
      case 'buyer':
        dashboardData = await getBuyerDashboard(user.id);
        break;
      case 'supplier':
        dashboardData = await getSupplierDashboard(user.id);
        break;
      case 'extension':
        dashboardData = await getExtensionDashboard(user.id);
        break;
      case 'admin':
        dashboardData = await getAdminDashboard();
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
};

const mapOrdersWithProducts = async (orders) => {
  const productIds = [...new Set(orders.map(order => order.product_id).filter(Boolean))];

  if (!productIds.length) {
    return orders.map(order => ({ ...order.toJSON(), product: null }));
  }

  const products = await Product.findAll({
    where: { id: { [Op.in]: productIds } }
  });

  const productMap = new Map(products.map(product => [product.id, product]));
  return orders.map(order => ({
    ...order.toJSON(),
    product: productMap.get(order.product_id) || null
  }));
};

const getDefaultExtensionOfficerId = async () => {
  const extensionUser = await User.findOne({
    where: { role: 'extension' },
    attributes: ['id'],
    order: [['id', 'ASC']]
  });

  return extensionUser ? extensionUser.id : null;
};

const getFarmerDashboard = async (userId) => {
  const farmer = await FarmerProfile.findOne({ where: { user_id: userId } });

  const [productsCount, recentProducts, productIdRows, recentAdvisories] = await Promise.all([
    Product.count({
      where: { farmer_id: userId }
    }),
    Product.findAll({
      where: { farmer_id: userId },
      limit: 5,
      order: [['created_at', 'DESC']]
    }),
    Product.findAll({
      where: { farmer_id: userId },
      attributes: ['id']
    }),
    Advisory.findAll({
      where: {
        language: 'nyanja',
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      limit: 5,
      order: [['created_at', 'DESC']]
    })
  ]);

  const productIds = productIdRows.map(product => product.id);
  let ordersCount = 0;
  let recentOrdersRaw = [];

  if (productIds.length) {
    const whereClause = { product_id: { [Op.in]: productIds } };
    [ordersCount, recentOrdersRaw] = await Promise.all([
      Order.count({ where: whereClause }),
      Order.findAll({
        where: whereClause,
        limit: 5,
        order: [['created_at', 'DESC']]
      })
    ]);
  }

  const recentOrders = await mapOrdersWithProducts(recentOrdersRaw);

  return {
    profile: farmer,
    stats: {
      totalProducts: productsCount,
      activeOrders: ordersCount
    },
    recentProducts,
    recentOrders,
    advisories: recentAdvisories
  };
};

const getBuyerDashboard = async (userId) => {
  const buyer = await BuyerProfile.findOne({ where: { user_id: userId } });

  const [ordersCount, recentOrdersRaw, availableProducts, marketPrices] = await Promise.all([
    Order.count({ where: { buyer_id: userId } }),
    Order.findAll({
      where: { buyer_id: userId },
      limit: 5,
      order: [['created_at', 'DESC']]
    }),
    Product.findAll({
      limit: 10,
      order: [['created_at', 'DESC']]
    }),
    Market.findAll({
      limit: 10,
      order: [['created_at', 'DESC']]
    })
  ]);

  const recentOrders = await mapOrdersWithProducts(recentOrdersRaw);

  return {
    profile: buyer,
    stats: {
      totalOrders: ordersCount
    },
    recentOrders,
    availableProducts,
    marketPrices
  };
};

const getSupplierDashboard = async (userId) => {
  const supplier = await SupplierProfile.findOne({ where: { user_id: userId } });
  
  const [transactionsCount, recentTransactions] = await Promise.all([
    Transaction.count({ where: { user_id: userId } }),
    Transaction.findAll({ 
      where: { user_id: userId },
      limit: 5,
      order: [['created_at', 'DESC']]
    })
  ]);

  return {
    profile: supplier,
    stats: {
      totalTransactions: transactionsCount
    },
    recentTransactions
  };
};

const getExtensionDashboard = async (userId) => {
  const [reportsCount, pendingReports, farmersCount, recentReports] = await Promise.all([
    Report.count({ where: { extension_id: userId } }),
    Report.count({ where: { extension_id: userId, status: 'pending' } }),
    User.count({ where: { role: 'farmer' } }),
    Report.findAll({ 
      where: { extension_id: userId },
      include: [
        { model: User, as: 'farmer' }
      ],
      limit: 5,
      order: [['created_at', 'DESC']]
    })
  ]);

  return {
    stats: {
      totalReports: reportsCount,
      pendingReports,
      totalFarmers: farmersCount
    },
    recentReports
  };
};

const getAdminDashboard = async () => {
  const [
    totalUsers,
    farmersCount,
    buyersCount,
    suppliersCount,
    extensionCount,
    productsCount,
    ordersCount,
    transactionsCount,
    pendingComplaints,
    recentUsers,
    recentOrdersRaw
  ] = await Promise.all([
    User.count(),
    User.count({ where: { role: 'farmer' } }),
    User.count({ where: { role: 'buyer' } }),
    User.count({ where: { role: 'supplier' } }),
    User.count({ where: { role: 'extension' } }),
    Product.count(),
    Order.count(),
    Transaction.count(),
    Complaint.count({ where: { status: 'pending' } }),
    User.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'phone', 'role', 'created_at']
    }),
    Order.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'buyer' }]
    })
  ]);

  const recentOrders = await mapOrdersWithProducts(recentOrdersRaw);

  return {
    stats: {
      totalUsers,
      farmers: farmersCount,
      buyers: buyersCount,
      suppliers: suppliersCount,
      extensionOfficers: extensionCount,
      products: productsCount,
      orders: ordersCount,
      transactions: transactionsCount,
      pendingComplaints
    },
    recentUsers,
    recentOrders
  };
};

// Market prices endpoint
exports.getMarketPrices = async (req, res, next) => {
  try {
    const { product } = req.query;
    const whereClause = product ? { product: { [Op.like]: `%${product}%` } } : {};
    
    const marketPrices = await Market.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: 50
    });

    res.json({
      success: true,
      data: marketPrices
    });
  } catch (error) {
    next(error);
  }
};

// User profile management
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });

    let profile = null;
    switch (user.role) {
      case 'farmer':
        profile = await FarmerProfile.findOne({ where: { user_id: user.id } });
        break;
      case 'buyer':
        profile = await BuyerProfile.findOne({ where: { user_id: user.id } });
        break;
      case 'supplier':
        profile = await SupplierProfile.findOne({ where: { user_id: user.id } });
        break;
    }

    res.json({
      success: true,
      data: {
        user,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, language, lat, lng, profileData } = req.body;
    const userId = req.user.id;

    // Update user
    await User.update(
      { name, email, language, lat, lng },
      { where: { id: userId } }
    );

    // Update role-specific profile
    const user = await User.findByPk(userId);
    switch (user.role) {
      case 'farmer':
        await FarmerProfile.update(profileData, { where: { user_id: userId } });
        break;
      case 'buyer':
        await BuyerProfile.update(profileData, { where: { user_id: userId } });
        break;
      case 'supplier':
        await SupplierProfile.update(profileData, { where: { user_id: userId } });
        break;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Products Management
exports.getProducts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const products = await Product.findAll({
      where: { farmer_id: userId },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, quantity, price, stock_quantity, price_per_unit, image_url } = req.body;
    const normalizedQuantity = quantity ?? (stock_quantity !== undefined ? String(stock_quantity) : null);
    const normalizedPrice = price ?? price_per_unit;

    if (!name || normalizedQuantity === null || normalizedPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'name, quantity (or stock_quantity), and price (or price_per_unit) are required'
      });
    }

    const product = await Product.create({
      farmer_id: userId,
      name,
      quantity: String(normalizedQuantity),
      price: Number(normalizedPrice),
      image_url: image_url || ''
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, quantity, price, stock_quantity, price_per_unit, image_url } = req.body;

    const product = await Product.findOne({
      where: { id, farmer_id: userId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (quantity !== undefined || stock_quantity !== undefined) {
      updateData.quantity = String(quantity ?? stock_quantity);
    }
    if (price !== undefined || price_per_unit !== undefined) {
      updateData.price = Number(price ?? price_per_unit);
    }
    if (image_url !== undefined) updateData.image_url = image_url;

    await product.update(updateData);

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, farmer_id: userId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// AI Advisory
exports.getAIAdvice = async (req, res, next) => {
  try {
    const { query, crop } = req.body;
    const userId = req.user.id;
    const fallbackAdvice = `AI assistant is temporarily unavailable.
Here are quick, generally safe farming checks:
- Inspect leaves for pests/disease and remove affected parts early.
- Keep soil evenly moist; avoid waterlogging roots.
- Apply balanced NPK fertilizer lightly if plants look pale.
- Mulch to retain moisture and suppress weeds.
- If issue persists, contact your local extension officer.`;

    // Get farmer context
    const farmer = await FarmerProfile.findOne({ where: { user_id: userId } });
    
    // Create context-aware prompt for Gemini
    const context = farmer ? 
      `As an agricultural expert for Zambia, provide advice for a farmer in ${farmer.district || 'Zambia'} who grows ${farmer.crops || 'various crops'} on ${farmer.farm_size_ha || 'unknown'} hectares.` :
      'As an agricultural expert for Zambia, provide farming advice.';

    const prompt = `${query}${crop ? ` (regarding: ${crop})` : ''}.
Consider Zambian climate conditions, common crops in Zambia, and local farming practices.
Provide practical, actionable advice in a clear, concise format.`;

    const aiResponse = await generateAgriculturalAdvice(prompt, context);

    // Save advisory to database
    await Advisory.create({
      created_by: userId,
      title: `AI Advice: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`,
      content: aiResponse,
      language: 'english',
      crop_tag: crop || null
    });

    res.json({
      success: true,
      data: {
        query,
        advice: aiResponse,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.warn('AI advisory failed, returning fallback advice:', error.message);
    res.status(503).json({
      success: true,
      data: {
        query: req.body?.query,
        advice: `AI fallback:\n${fallbackAdvice}`,
        timestamp: new Date()
      },
      message: 'AI is busy; sent fallback advice.'
    });
  }
};

// Reports Management
exports.getReports = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const whereClause = userRole === 'extension'
      ? { extension_id: userId }
      : { farmer_id: userId };

    const reports = await Report.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

exports.createReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { extension_id, farmer_id, report_text, description, title } = req.body;
    const resolvedReportText = report_text || description || title || '';

    if (!resolvedReportText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'report_text (or description/title) is required'
      });
    }

    let payload = null;
    if (req.user.role === 'extension') {
      if (!farmer_id) {
        return res.status(400).json({
          success: false,
          message: 'farmer_id is required for extension reports'
        });
      }
      payload = {
        extension_id: userId,
        farmer_id,
        report_text: resolvedReportText
      };
    } else {
      const resolvedExtensionId = extension_id || await getDefaultExtensionOfficerId();
      if (!resolvedExtensionId) {
        return res.status(400).json({
          success: false,
          message: 'No extension officer available. Please provide extension_id.'
        });
      }
      payload = {
        extension_id: resolvedExtensionId,
        farmer_id: userId,
        report_text: resolvedReportText
      };
    }

    const report = await Report.create(payload);

    res.status(201).json({
      success: true,
      data: report,
      message: 'Report created successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getReportDetail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const report = await Report.findOne({
      where: {
        id,
        [Op.or]: [
          { extension_id: userId },
          { farmer_id: userId }
        ]
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// Complaints Management
exports.getComplaints = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const complaints = await Complaint.findAll({
      where: isAdmin ? {} : { user_id: userId },
      include: [{ model: User, as: 'complainant', attributes: ['id', 'name', 'role', 'phone'] }],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

exports.createComplaint = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { message, description } = req.body;
    const resolvedMessage = (message || description || '').trim();

    if (!resolvedMessage) {
      return res.status(400).json({
        success: false,
        message: 'Complaint message is required'
      });
    }

    const complaint = await Complaint.create({
      user_id: userId,
      message: resolvedMessage,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: complaint,
      message: 'Complaint submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.resolveComplaint = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can resolve complaints'
      });
    }

    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    await complaint.update({
      status: 'resolved',
      resolved_by: req.user.id,
      resolved_at: new Date()
    });

    res.json({
      success: true,
      data: complaint,
      message: 'Complaint resolved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Messaging
exports.getMessageContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { role } = req.query;
    const whereClause = {
      id: { [Op.ne]: userId },
      is_active: true
    };

    if (role) {
      whereClause.role = role;
    }

    const contacts = await User.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'phone', 'role'],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { box = 'inbox' } = req.query;
    const whereClause = box === 'sent'
      ? { user_id: userId }
      : { recipient_id: userId };

    const messages = await Message.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'phone', 'role'] },
        { model: User, as: 'recipient', attributes: ['id', 'name', 'phone', 'role'] }
      ],
      order: [['created_at', 'DESC']],
      limit: 100
    });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { recipient_id, content, channel } = req.body;
    const recipientId = Number(recipient_id);
    const resolvedContent = (content || '').trim();

    if (!recipientId || !resolvedContent) {
      return res.status(400).json({
        success: false,
        message: 'recipient_id and content are required'
      });
    }

    if (recipientId === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot message yourself'
      });
    }

    const recipient = await User.findOne({ where: { id: recipientId, is_active: true } });
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    const message = await Message.create({
      user_id: userId,
      recipient_id: recipientId,
      direction: 'out',
      channel: ['sms', 'voice', 'app'].includes(channel) ? channel : 'app',
      content: resolvedContent,
      status: 'sent'
    });

    const populatedMessage = await Message.findByPk(message.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'phone', 'role'] },
        { model: User, as: 'recipient', attributes: ['id', 'name', 'phone', 'role'] }
      ]
    });

    res.status(201).json({
      success: true,
      data: populatedMessage,
      message: 'Message sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessageDetail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const message = await Message.findOne({
      where: {
        id,
        [Op.or]: [
          { user_id: userId },
          { recipient_id: userId }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'phone', 'role'] },
        { model: User, as: 'recipient', attributes: ['id', 'name', 'phone', 'role'] }
      ]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};
