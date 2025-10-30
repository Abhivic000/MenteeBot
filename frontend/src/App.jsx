import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BlogEditor from './pages/BlogEditor';
import BlogView from './pages/BlogView';
import BlogList from './pages/BlogList';
import Chatbot from './pages/Chatbot';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full" style={{width: '3rem', height: '3rem', border: '2px solid transparent', borderTop: '2px solid var(--primary-600)'}}></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full" style={{width: '3rem', height: '3rem', border: '2px solid transparent', borderTop: '2px solid var(--primary-600)'}}></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen transition-colors">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/blog/new" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
              <Route path="/blog/edit/:id" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
              <Route path="/blog/:id" element={<BlogView />} />
              <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;