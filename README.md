 TravelX - Peer-to-Peer Logistics Platform


 About TravelX

TravelX is a secure, AI-enhanced digital platform designed to connect frequent international travelers (Porters) with individuals or businesses (Senders) who need to deliver parcels across borders efficiently and affordably. It operates by leveraging the unused weight and luggage capacity of travelers, creating a mutually beneficial cross-border logistics solution.

Key Features

-  **Biometric Verification**: Two-step facial recognition with government-issued ID
-  **AI Content Screening**: Advanced image classification to detect prohibited items
-  **Ticket OCR Proof**: Smart OCR technology validates flight tickets
-  **Flexible Pricing**: Direct negotiation between travelers and senders
-  **Global Network**: Connect with travelers heading to 120+ countries
-  **Real-Time Tracking**: Live updates and instant messaging

##  Tech Stack

### Frontend
- **React.js** - Interactive UI and user experience
- **React Router** - Navigation
- **Socket.IO Client** - Real-time messaging
- **React Icons** - Icon library
- **Axios** - API requests

### Backend
- **Node.js & Express.js** - REST API and business logic
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **Socket.IO** - Real-time communication
- **Multer** - File uploads

### AI/ML Services (Coming Soon)
- **Python (Flask/FastAPI)** - Microservice for AI processing
- **face_recognition** - Biometric verification
- **Tesseract-OCR** - Ticket validation
- **TensorFlow/Keras** - Image classification

## 📁 Project Structure

```
TravelX/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.js
    └── package.json
```

##  Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rizxwan01/TravelX.git
   cd TravelX
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up Environment Variables**

   Backend (.env):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/travelx
   JWT_SECRET=your_jwt_secret_key
   PYTHON_SERVICE_URL=http://localhost:8000
   NODE_ENV=development
   ```

   Frontend (.env):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Run the Application**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000


##  Author

**Rizwan**
- GitHub: [@rizxwan01](https://github.com/rizxwan01)



⭐ Star this repo if you find it useful!
