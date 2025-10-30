import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Heart, LogOut, User, MessageCircle, PenTool, BookOpen } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar shadow-lg">
      <div className="container">
        <div className="flex justify-between items-center" style={{height: '4rem'}}>
          <Link to="/" className="flex items-center gap-2 text-primary">
            <Heart style={{width: '2rem', height: '2rem'}} className="text-green" />
            <span className="text-xl font-bold">MenteeBot</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/blogs"
              className={`nav-link ${isActive('/blogs') ? 'active' : ''}`}
            >
              <BookOpen style={{width: '1rem', height: '1rem'}} />
              <span>Stories</span>
            </Link>
            
            <div 
              onClick={toggleTheme}
              className="theme-toggle cursor-pointer"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
            </div>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  <User style={{width: '1rem', height: '1rem'}} />
                  <span>Dashboard</span>
                </Link>
                
                <Link
                  to="/blog/new"
                  className={`nav-link ${isActive('/blog/new') ? 'active' : ''}`}
                >
                  <PenTool style={{width: '1rem', height: '1rem'}} />
                  <span>Write</span>
                </Link>
                
                <Link
                  to="/chatbot"
                  className={`nav-link ${isActive('/chatbot') ? 'active' : ''}`}
                >
                  <MessageCircle style={{width: '1rem', height: '1rem'}} />
                  <span>Chat</span>
                </Link>

                <div className="flex items-center gap-2 text-sm text-secondary">
                  <span>Hi, {user.name}</span>
                </div>

                <button
                  onClick={logout}
                  className="nav-link" 
                  style={{color: '#dc2626'}}
                >
                  <LogOut style={{width: '1rem', height: '1rem'}} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}