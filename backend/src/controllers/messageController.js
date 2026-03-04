const Message = require('../models/Message');
const Order = require('../models/Order');

// @desc    Get messages for an order
// @route   GET /api/messages/:orderId
// @access  Private
const getOrderMessages = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    // Check authorization
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.sender.toString() !== req.user.id && 
        order.traveler.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these messages'
      });
    }

    const messages = await Message.find({ orderId })
      .populate('sender', 'fullName profileImage')
      .populate('receiver', 'fullName profileImage')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Mark messages as read
    await Message.updateMany(
      { orderId, receiver: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages.reverse()
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Send message (via Socket.IO)
// @route   Socket event: send_message
const sendMessage = async (data) => {
  try {
    const { orderId, senderId, receiverId, message } = data;

    const messageDoc = await Message.create({
      orderId,
      sender: senderId,
      receiver: receiverId,
      message,
      messageType: 'text'
    });

    const populatedMessage = await messageDoc
      .populate('sender', 'fullName profileImage')
      .populate('receiver', 'fullName profileImage');

    return populatedMessage;
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiver: req.user.id,
      read: false
    });

    res.status(200).json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getOrderMessages,
  sendMessage,
  getUnreadCount
};
