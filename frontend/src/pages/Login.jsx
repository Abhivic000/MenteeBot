import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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
      await login(formData.email, formData.password);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full" style={{maxWidth: '28rem'}}>
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center">
            <Heart style={{width: '3rem', height: '3rem'}} className="text-green" />
          </div>
          <h2 className="mt-6 text-3xl font-bold">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Continue your healing journey
          </p>
        </div>

        <div className="card p-8 animate-fade-in">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 flex items-center gap-2 rounded-lg" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)'}}>
                <AlertCircle style={{width: '1.25rem', height: '1.25rem', color: '#dc2626'}} />
                <span className="text-sm" style={{color: '#dc2626'}}>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <div className="relative">
                <Mail style={{position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem'}} className="text-muted" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input"
                  style={{paddingLeft: '2.5rem'}}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <Lock style={{position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem'}} className="text-muted" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input"
                  style={{paddingLeft: '2.5rem'}}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex justify-center items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full" style={{width: '1.25rem', height: '1.25rem', border: '2px solid transparent', borderTop: '2px solid white'}}></div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-secondary">
                Don't have an account?{' '}
                <Link to="/register" className="text-green font-medium hover:opacity-75 transition">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}