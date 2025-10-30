import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id, isEditing]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${id}`);
      setFormData({
        title: response.data.title,
        content: response.data.content
      });
    } catch (error) {
      setError('Failed to load blog post');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/blogs/${id}`, formData);
      } else {
        await axios.post(`${API_URL}/blogs`, formData);
      }
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

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

      <div className="card p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Your Story' : 'Share Your Healing Story'}
          </h1>
          <p className="text-secondary mt-2">
            Your journey matters. Share your experiences to inspire and help others.
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-lg" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)'}}>
            <span className="text-sm" style={{color: '#dc2626'}}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="form-group">
            <label htmlFor="title" className="label">
              Story Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="input"
              placeholder="Give your story a meaningful title..."
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="label">
              Your Story
            </label>
            <textarea
              id="content"
              name="content"
              required
              className="input textarea"
              style={{minHeight: '20rem'}}
              placeholder="Share your healing journey... What challenges did you face? What helped you? What would you tell someone going through something similar?"
              value={formData.content}
              onChange={handleChange}
            />
            <p className="text-sm text-muted mt-2">
              Be authentic and honest. Your story could be exactly what someone else needs to hear.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6" style={{borderTop: '1px solid var(--border-color)'}}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full" style={{width: '1rem', height: '1rem', border: '2px solid transparent', borderTop: '2px solid white'}}></div>
              ) : (
                <>
                  <Save style={{width: '1rem', height: '1rem'}} />
                  <span>{isEditing ? 'Update Story' : 'Publish Story'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}