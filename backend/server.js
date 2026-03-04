const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/slots', require('./src/routes/slotRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/messages', require('./src/routes/messageRoutes'));
app.use('/api/reviews', require('./src/routes/reviewRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TravelX API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.IO for real-time messaging
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const { sendMessage } = require('./src/controllers/messageController');

// Track connected users
const userSockets = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins
  socket.on('user_join', (userId) => {
    userSockets[userId] = socket.id;
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Join order room for messaging
  socket.on('join_order', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`User joined order room: order_${orderId}`);
  });

  // Send message
  socket.on('send_message', async (data) => {
    try {
      const message = await sendMessage(data);
      
      // Emit to all users in the order room
      io.to(`order_${data.orderId}`).emit('receive_message', {
        success: true,
        data: message
      });
      
      // Notify receiver if online
      if (userSockets[data.receiverId]) {
        io.to(userSockets[data.receiverId]).emit('new_message_notification', {
          orderId: data.orderId,
          senderId: data.senderId,
          message: data.message
        });
      }
    } catch (error) {
      socket.emit('error', {
        success: false,
        message: 'Failed to send message'
      });
    }
  });

  // Order status update
  socket.on('order_status_change', (data) => {
    io.to(`order_${data.orderId}`).emit('order_updated', {
      orderId: data.orderId,
      status: data.status,
      updatedAt: new Date()
    });
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(`order_${data.orderId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: true
    });
  });

  socket.on('stop_typing', (data) => {
    socket.to(`order_${data.orderId}`).emit('user_typing', {
      userId: data.userId,
      isTyping: false
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    // Remove user from socket map
    Object.keys(userSockets).forEach(userId => {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
      }
    });
    console.log('User disconnected:', socket.id);
  });
});

module.exports = app;
