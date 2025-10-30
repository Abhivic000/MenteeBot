import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Calendar, User, Edit, Heart } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
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

  if (error || !blog) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Blog post not found
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isAuthor = user && user._id === blog.author._id;

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-secondary hover:text-green transition"
        >
          <ArrowLeft style={{width: '1rem', height: '1rem'}} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <article className="card p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {blog.title}
          </h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-secondary">
              <div className="flex items-center gap-2">
                <User style={{width: '1rem', height: '1rem'}} />
                <span>{blog.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar style={{width: '1rem', height: '1rem'}} />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>
            
            {isAuthor && (
              <Link
                to={`/blog/edit/${blog._id}`}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Edit style={{width: '1rem', height: '1rem'}} />
                <span>Edit</span>
              </Link>
            )}
          </div>
        </header>

        <div className="text-lg leading-relaxed">
          <div className="whitespace-pre-wrap text-secondary">
            {blog.content}
          </div>
        </div>

        <footer className="mt-12 pt-8" style={{borderTop: '1px solid var(--border-color)'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-secondary">
              <Heart style={{width: '1.25rem', height: '1.25rem', color: '#dc2626'}} />
              <span className="text-sm">
                Thank you for sharing your story and inspiring others on their healing journey.
              </span>
            </div>
          </div>
        </footer>
      </article>

      {/* Encouragement Section */}
      <div className="mt-8 card p-6 animate-gradient">
        <div className="text-center">
          <Heart style={{width: '2rem', height: '2rem', color: 'white'}} className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2" style={{color: 'white'}}>
            Every story matters
          </h3>
          <p style={{color: 'rgba(255, 255, 255, 0.9)'}}>
            Your journey of healing and growth inspires others to keep going. Thank you for being brave enough to share.
          </p>
        </div>
      </div>
    </div>
  );
}