const Order = require('../models/Order');
const Slot = require('../models/Slot');
const User = require('../models/User');
const axios = require('axios');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Verified users only)§
const createOrder = async (req, res) => {
  try {
    const {
      slotId,
      recipientDetails,

      parcelDescription,
      estimatedWeight,
      dimensions,
      parcelImages,
      agreedPrice
    } = req.body;

    // Validation
    if (!slotId || !recipientDetails || !parcelDescription || 
        !estimatedWeight || !parcelImages || !agreedPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Verify user is a sender
    const user = await User.findById(req.user.id);
    if (user.userType !== 'sender' && user.userType !== 'both') {
      return res.status(403).json({
        success: false,
        message: 'Only senders can create orders'
      });
    }

    // Check if slot exists and is available
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    if (slot.status !== 'active') {
      return res.status(400).json({
        success: false,  
        message: 'Slot is not available'
      });
    }

    if (estimatedWeight > slot.availableWeight) {
      return res.status(400).json({
        success: false,
        message: 'Parcel weight exceeds available capacity'
      });
    

    // Create order
    const order = await Order.create({
      sender: req.user.id,
      traveler: slot.traveler,
      slot: slotId,
      recipientDetails,
      parcelDescription,
      estimatedWeight,
      dimensions,
      parcelImages,
      agreedPrice,
      timeline: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed'
      }]
    });

    // In production, send parcel images to Python service for AI screening
    try {
      // const pythonResponse = await axios.post(
      //   `${process.env.PYTHON_SERVICE_URL}/api/screen-parcel`,
      //   { images: parcelImages }
      // );

      // Mock AI screening response
      const aiAnalysis = {
        flagged: false,
        reason: null,
        confidence: 0.95
      };

      order.aiAnalysis = aiAnalysis;
      order.contentVerified = !aiAnalysis.flagged;

      if (aiAnalysis.flagged) {
        order.status = 'flagged';
        order.timeline.push({
          status: 'flagged',
          timestamp: new Date(),
          note: `Flagged: ${aiAnalysis.reason}`
        });
      }

      await order.save();
    } catch (error) {
      console.error('AI screening error:', error);
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('sender', 'fullName email mobileNumber')
      .populate('traveler', 'fullName email rating completedDeliveries')
      .populate('slot');

    res.status(201).json({
      success: true,
      message: order.status === 'flagged' 
        ? 'Order created but flagged for review' 
        : 'Order created successfully',
      data: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all orders for user
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const { status } = req.query;

    // Build query based on user type
    let query = {
      $or: [
        { sender: req.user.id },
        { traveler: req.user.id }
      ]
    };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('sender', 'fullName email mobileNumber profileImage')
      .populate('traveler', 'fullName email rating completedDeliveries profileImage')
      .populate('slot')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('sender', 'fullName email mobileNumber profileImage')
      .populate('traveler', 'fullName email rating completedDeliveries profileImage mobileNumber')
      .populate('slot');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.sender._id.toString() !== req.user.id && 
        order.traveler._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.sender.toString() !== req.user.id && 
        order.traveler.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Validate status transitions
    const validStatuses = ['pending', 'confirmed', 'in_transit', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Update status
    order.status = status;
    order.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`
    });

    // If completed, update user stats
    if (status === 'completed') {
      await User.findByIdAndUpdate(order.traveler, {
        $inc: { completedDeliveries: 1 }
      });
    }

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('sender', 'fullName email')
      .populate('traveler', 'fullName email')
      .populate('slot');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: populatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only sender can cancel
    if (order.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only sender can cancel order'
      });
    }

    // Can't cancel if already in transit or delivered
    if (['in_transit', 'delivered', 'completed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order at this stage'
      });
    }

    order.status = 'cancelled';
    order.timeline.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: 'Order cancelled by sender'
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};


