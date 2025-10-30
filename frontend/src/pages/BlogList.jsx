import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Heart } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs`);
      setBlogs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blogs');
      setBlogs([]);
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

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load stories</h2>
          <p className="text-secondary mb-6">{error}</p>
          <button onClick={fetchBlogs} className="btn btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 animate-gradient" style={{backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent'}}>
          Healing Stories
        </h1>
        <p className="text-xl text-secondary">
          Read inspiring journeys of healing and hope from our community
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <Heart style={{width: '4rem', height: '4rem'}} className="text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            No stories yet
          </h3>
          <p className="text-secondary mb-6">
            Be the first to share your healing journey with the community.
          </p>
          <Link to="/blog/new" className="btn btn-primary">
            Share Your Story
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8" style={{maxWidth: '48rem', margin: '0 auto'}}>
          {blogs.map((blog) => (
            <article key={blog._id} className="card p-8 hover:scale-105 transition animate-fade-in">
              <div className="mb-6">
                <Link to={`/blog/${blog._id}`}>
                  <h2 className="text-2xl font-bold mb-3 hover:text-green transition">
                    {blog.title}
                  </h2>
                </Link>
                <p className="text-secondary leading-relaxed" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {blog.content.substring(0, 300)}...
                </p>
              </div>

              <div className="flex items-center justify-between pt-4" style={{borderTop: '1px solid var(--border-color)'}}>
                <div className="flex items-center gap-4 text-sm text-muted">
                  <div className="flex items-center gap-1">
                    <User style={{width: '1rem', height: '1rem'}} />
                    <span>{blog.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar style={{width: '1rem', height: '1rem'}} />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye style={{width: '1rem', height: '1rem'}} />
                    <span>{blog.views || 0} views</span>
                  </div>
                </div>
                <Link 
                  to={`/blog/${blog._id}`}
                  className="btn btn-secondary btn-sm"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}