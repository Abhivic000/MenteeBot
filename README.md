# MenteeBot - Mental Health Support Platform

A comprehensive mental health platform that allows users to share their healing stories and interact with an AI-powered mental health companion.

## Features

### Frontend (React + Vite)
- 🌓 **Dark/Light Mode Toggle** with green theme
- 🔐 **Authentication & Authorization** (JWT-based)
- 📱 **Responsive Design** for all devices
- 🏠 **Landing Page** with feature highlights
- ✍️ **Blog System** for sharing healing stories
- 🤖 **AI Chatbot** for mental health support
- 🎨 **Modern UI** with Tailwind CSS

### Backend (Node.js + Express)
- 🔒 **Secure Authentication** with JWT
- 📊 **MongoDB Database** with Mongoose ODM
- 🛡️ **Security Middleware** (Helmet, CORS, Rate Limiting)
- 📝 **Blog CRUD Operations**
- 🤖 **RAG Chatbot** with LangChain integration
- 📄 **PDF Knowledge Base** support
- ⚡ **Production-Ready** with error handling

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- LangChain for RAG
- Groq Integration (Free)
- PDF Processing

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- OpenAI API Key (for chatbot)

### Installation

1. **Clone and setup the project:**
   ```bash
   cd MenteeBot
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   
   # Copy and configure environment variables
   cp .env.example .env
   # Edit .env with your MongoDB URI and OpenAI API key
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   
   # Start development server
   npm run dev
   ```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/menteebot
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
OPENAI_API_KEY=your-openai-api-key-here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Usage

### 1. User Registration & Authentication
- Users can register with name, email, and password
- Secure login with JWT tokens
- Protected routes for authenticated users

### 2. Blog System
- Create, edit, and delete personal healing stories
- Rich text editor for blog content
- View personal blog dashboard
- Read individual blog posts

### 3. AI Mental Health Chatbot
- Real-time chat interface
- Context-aware responses
- Crisis detection and appropriate resources
- Chat history storage
- RAG integration with PDF knowledge base

### 4. PDF Knowledge Base Setup
1. Create an `uploads` folder in the backend directory
2. Add your mental health PDF resources
3. The RAG system will automatically process and index them
4. Chatbot will use this knowledge for more informed responses

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Blogs
- `GET /api/blogs/user` - Get user's blogs
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

### Chat
- `POST /api/chat` - Send message to chatbot
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/new-session` - Start new chat session

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Error handling middleware

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set secure JWT secret
4. Configure proper CORS origins
5. Use PM2 or similar for process management

### Frontend
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Update API URL in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Crisis Resources

This application includes crisis detection and provides appropriate resources:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Emergency Services: 911

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note:** This application is designed to provide support and resources but is not a replacement for professional mental health care. Users experiencing mental health crises should seek immediate professional help.