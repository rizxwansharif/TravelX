# TravelX Backend API

## Overview
TravelX backend is built with Node.js, Express, and MongoDB Atlas. It provides RESTful APIs and real-time messaging through Socket.IO for the peer-to-peer logistics platform.

## Features
- ✅ User authentication with JWT
- ✅ Role-based access control (Traveler, Sender)
- ✅ Travel slot management with ticket OCR verification
- ✅ Order creation and tracking
- ✅ Real-time messaging with Socket.IO
- ✅ User reviews and ratings
- ✅ File upload handling
- ✅ Verified-user gates for critical operations

## Prerequisites
- Node.js v14+
- MongoDB Atlas account
- npm/yarn

## Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Configure .env**
   ```env
   PORT=5001
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.bq1rypy.mongodb.net/travelx?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key
   PYTHON_SERVICE_URL=http://localhost:8000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

## Running the Server

**Development mode**
```bash
npm run dev
```

**Production mode**
```bash
npm start
```

Server will run on `http://localhost:5001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `PUT /api/users/profile` - Update profile (Protected)
- `POST /api/users/verify/cnic` - Upload CNIC (Protected)
- `POST /api/users/verify/live` - Live face verification (Protected)
- `GET /api/users/:id` - Get user details

### Slots
- `POST /api/slots` - Create travel slot (Protected, Verified)
- `GET /api/slots` - Get all active slots
- `GET /api/slots/:id` - Get slot details
- `GET /api/slots/my-slots` - Get traveler's slots (Protected)
- `PUT /api/slots/:id` - Update slot (Protected)
- `DELETE /api/slots/:id` - Delete slot (Protected)

### Orders
- `POST /api/orders` - Create order (Protected, Verified)
- `GET /api/orders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get order details (Protected)
- `PUT /api/orders/:id/status` - Update order status (Protected)
- `DELETE /api/orders/:id` - Cancel order (Protected)

### Messages
- `GET /api/messages/:orderId` - Get order messages (Protected)
- `GET /api/messages/unread/count` - Get unread count (Protected)

### Reviews
- `POST /api/reviews` - Create review (Protected)
- `GET /api/reviews/user/:userId` - Get user reviews
- `GET /api/reviews/stats/:userId` - Get review statistics

### File Upload
- `POST /api/upload/cnic` - Upload CNIC images (Protected)
- `POST /api/upload/ticket` - Upload e-ticket (Protected)
- `POST /api/upload/parcel` - Upload parcel images (Protected)

## Socket.IO Events

### Client to Server
- `user_join` - User connects (pass userId)
- `join_order` - Join order room (pass orderId)
- `send_message` - Send message (pass orderId, senderId, receiverId, message)
- `order_status_change` - Notify status change (pass orderId, status)
- `typing` - User is typing (pass orderId, userId)
- `stop_typing` - User stopped typing (pass orderId, userId)

### Server to Client
- `receive_message` - New message received
- `new_message_notification` - Message notification
- `order_updated` - Order status updated
- `user_typing` - User typing indicator

## Database Models

### User
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  userType: 'traveler' | 'sender' | 'both',
  mobileNumber: String,
  is_verified: Boolean,
  cnicData: { idNumber, extractedName, facialEmbedding },
  profileImage: String,
  rating: Number,
  completedDeliveries: Number,
  createdAt: Date
}
```

### Slot
```javascript
{
  traveler: ObjectId,
  departureCity: String,
  departureCountry: String,
  destinationCity: String,
  destinationCountry: String,
  departureDate: Date,
  availableWeight: Number,
  dimensions: { length, width, height },
  pricePerKg: Number,
  isNegotiable: Boolean,
  eTicket: String,
  is_ticket_verified: Boolean,
  extractedTicketData: { destination, date, flightNumber },
  status: 'pending' | 'active' | 'completed' | 'cancelled',
  createdAt: Date
}
```

### Order
```javascript
{
  sender: ObjectId,
  traveler: ObjectId,
  slot: ObjectId,
  recipientDetails: { name, address, contact },
  parcelDescription: String,
  estimatedWeight: Number,
  parcelImages: [String],
  agreedPrice: Number,
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'completed' | 'cancelled' | 'flagged',
  aiAnalysis: { flagged, reason, confidence },
  timeline: [{ status, timestamp, note }],
  createdAt: Date
}
```

### Message
```javascript
{
  orderId: ObjectId,
  sender: ObjectId,
  receiver: ObjectId,
  message: String,
  messageType: 'text' | 'notification' | 'system',
  read: Boolean,
  createdAt: Date
}
```

### Review
```javascript
{
  order: ObjectId,
  reviewer: ObjectId,
  reviewee: ObjectId,
  rating: Number (1-5),
  comment: String,
  categories: { communication, reliability, safety },
  createdAt: Date
}
```

## Authentication

### Register
```bash
POST /api/auth/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "userType": "traveler",
  "mobileNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "userType": "traveler",
    "is_verified": false,
    "token": "eyJhbGc..."
  }
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

## Protected Routes

Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Middleware

### Auth Middleware
- `protect` - Verifies JWT token
- `verifiedOnly` - Checks if user is biometrically verified

### Upload Middleware
- `uploadMiddleware` - Handles file uploads with validation
  - Max file size: 10MB
  - Allowed types: JPEG, PNG, PDF

## Integration with Python Service

The backend is configured to send requests to a Python microservice for:
- CNIC OCR processing
- Face recognition and verification
- Ticket verification
- Parcel content screening

Python service should be running on `http://localhost:8000`

## Testing

Test endpoints using cURL or Postman:

```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@travelx.com",
    "password": "Test123!",
    "userType": "traveler",
    "mobileNumber": "+1234567890"
  }'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@travelx.com",
    "password": "Test123!"
  }'
```

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<secure-random-key>
PYTHON_SERVICE_URL=<production-python-service>
FRONTEND_URL=<production-frontend>
```

### Recommended Hosting
- Backend: Heroku, DigitalOcean, AWS
- Database: MongoDB Atlas
- Storage: AWS S3 for file uploads

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9
```

### MongoDB Connection Issues
- Verify MongoDB Atlas credentials
- Check IP whitelist in MongoDB Atlas
- Ensure VPN is not blocking connection

### JWT Errors
- Token expired: User needs to login again
- Invalid token: Check token format in Authorization header

## Support

For issues and questions, please contact the development team.
