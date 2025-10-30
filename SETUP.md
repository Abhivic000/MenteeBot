# MenteeBot Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Install locally](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Groq API Key** - [Get one FREE here](https://console.groq.com/keys) (optional for enhanced chatbot)

### 1. Install All Dependencies
```bash
# From the root directory
npm run install-all
```

### 2. Configure Environment Variables

#### Backend Configuration
Create `backend/.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/menteebot
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
JWT_EXPIRE=7d
GROQ_API_KEY=your-groq-api-key-here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Configuration
The `frontend/.env` file is already configured:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB
- **Local MongoDB:** Start your MongoDB service
- **MongoDB Atlas:** Use the connection string in MONGODB_URI

### 4. Add Mental Health Resources (Optional)
Place PDF files in `backend/uploads/` directory for the RAG chatbot to use as knowledge base.

### 5. Start the Application

#### Option A: Start Both Servers Together
```bash
npm run dev
```

#### Option B: Start Servers Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

#### Option C: Use Windows Batch Script
Double-click `start-dev.bat` (Windows only)

## 🌐 Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 🔧 Configuration Details

### MongoDB Setup Options

#### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/menteebot`

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Use: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/menteebot`

### Groq API Key Setup (FREE)
1. Visit [Groq Console](https://console.groq.com/keys)
2. Create a free account (no billing required)
3. Generate an API key
4. Add to `backend/.env`: `GROQ_API_KEY=your-key-here`

**Note:** The chatbot will work with basic responses even without Groq API key.

### JWT Secret
Generate a secure JWT secret:
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Use online generator
# Visit: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

## 📁 Project Structure

```
MenteeBot/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts (Auth, Theme)
│   │   ├── pages/           # Page components
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js + Express backend
│   ├── config/              # Database configuration
│   ├── middleware/          # Express middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── uploads/             # PDF files for RAG
│   └── package.json
├── package.json             # Root package.json
├── start-dev.bat           # Windows startup script
└── README.md
```

## 🎯 Features Overview

### ✅ Implemented Features
- **Authentication System**
  - User registration and login
  - JWT-based authentication
  - Protected routes
  
- **Blog System**
  - Create, edit, delete blog posts
  - Personal dashboard
  - Blog viewing with metadata
  
- **AI Chatbot**
  - Real-time chat interface
  - Context-aware responses
  - Crisis detection
  - Chat history storage
  - RAG integration ready
  
- **UI/UX**
  - Dark/Light mode toggle
  - Responsive design
  - Green theme
  - Modern interface with Tailwind CSS

### 🔄 RAG Chatbot Enhancement
To enhance the chatbot with your PDF knowledge base:

1. **Add PDF Files:**
   ```bash
   # Place your mental health PDFs in:
   backend/uploads/your-mental-health-book.pdf
   ```

2. **Restart Backend:**
   The RAG system will automatically process new PDFs on startup.

3. **Test Enhanced Responses:**
   The chatbot will now use your PDF content for more informed responses.

## 🚨 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running locally or check your Atlas connection string.

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process using the port or change the PORT in `.env`.

#### Groq API Error
```
Error: Invalid API key
```
**Solution:** Check your Groq API key from console.groq.com/keys.

#### Frontend Build Issues
```
Error: Cannot resolve dependency
```
**Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install`.

### Reset Database
To start fresh:
```bash
# Connect to MongoDB and drop the database
mongosh
use menteebot
db.dropDatabase()
```

## 🔒 Security Notes

### Production Deployment
Before deploying to production:

1. **Change JWT Secret:** Use a strong, random secret
2. **Update CORS Origins:** Set specific domains in `server.js`
3. **Environment Variables:** Never commit `.env` files
4. **HTTPS:** Use SSL certificates
5. **Rate Limiting:** Adjust limits based on usage
6. **MongoDB:** Use authentication and proper network security

### API Security Features
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers

## 📞 Support

If you encounter issues:
1. Check this setup guide
2. Review the main README.md
3. Check console logs for error messages
4. Ensure all prerequisites are installed
5. Verify environment variables are set correctly

## 🎉 Next Steps

Once everything is running:
1. Register a new account at http://localhost:5173
2. Write your first healing story
3. Chat with the AI companion
4. Add your mental health PDF resources
5. Customize the theme and features as needed

Happy coding! 🚀