import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PenTool, MessageCircle, Calendar, Heart, Eye, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/user`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`${API_URL}/blogs/${id}`);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full" style={{width: '3rem', height: '3rem', border: '2px solid transparent', borderTop: '2px solid var(--primary-600)'}}></div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-secondary">
          Continue your healing journey and share your progress with the community.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Link to="/blog/new" className="card p-6 hover:scale-105 transition">
          <div className="flex items-center gap-4">
            <div className="rounded-lg flex items-center justify-center" style={{width: '3rem', height: '3rem', backgroundColor: 'var(--primary-100)'}}>
              <PenTool style={{width: '1.5rem', height: '1.5rem'}} className="text-green" />
            </div>
            <div>
              <h3 className="font-semibold">Write New Blog</h3>
              <p className="text-sm text-secondary">Share your healing story</p>
            </div>
          </div>
        </Link>

        <Link to="/chatbot" className="card p-6 hover:scale-105 transition">
          <div className="flex items-center gap-4">
            <div className="rounded-lg flex items-center justify-center" style={{width: '3rem', height: '3rem', backgroundColor: 'var(--primary-100)'}}>
              <MessageCircle style={{width: '1.5rem', height: '1.5rem'}} className="text-green" />
            </div>
            <div>
              <h3 className="font-semibold">Chat with AI</h3>
              <p className="text-sm text-secondary">Get personalized support</p>
            </div>
          </div>
        </Link>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg flex items-center justify-center" style={{width: '3rem', height: '3rem', backgroundColor: 'var(--primary-100)'}}>
              <Heart style={{width: '1.5rem', height: '1.5rem'}} className="text-green" />
            </div>
            <div>
              <h3 className="font-semibold">Your Progress</h3>
              <p className="text-sm text-secondary">{blogs.length} stories shared</p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Blog Posts */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Stories</h2>
          <Link to="/blog/new" className="btn btn-primary">
            <PenTool style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}} />
            Write New Story
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <Heart style={{width: '4rem', height: '4rem'}} className="text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No stories yet
            </h3>
            <p className="text-secondary mb-6">
              Start sharing your healing journey with your first blog post.
            </p>
            <Link to="/blog/new" className="btn btn-primary">
              Write Your First Story
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {blogs.map((blog) => (
              <div key={blog._id} className="p-6 rounded-lg hover:shadow-md transition" style={{border: '1px solid var(--border-color)'}}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-secondary mb-4" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {blog.content.substring(0, 200)}...
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted">
                      <div className="flex items-center gap-1">
                        <Calendar style={{width: '1rem', height: '1rem'}} />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye style={{width: '1rem', height: '1rem'}} />
                        <span>{blog.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="p-2 text-secondary hover:text-green transition"
                    >
                      <Eye style={{width: '1rem', height: '1rem'}} />
                    </Link>
                    <Link
                      to={`/blog/edit/${blog._id}`}
                      className="p-2 text-secondary hover:text-green transition"
                    >
                      <Edit style={{width: '1rem', height: '1rem'}} />
                    </Link>
                    <button
                      onClick={() => deleteBlog(blog._id)}
                      className="p-2 text-secondary transition"
                      style={{color: '#dc2626'}}
                      onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      <Trash2 style={{width: '1rem', height: '1rem'}} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}