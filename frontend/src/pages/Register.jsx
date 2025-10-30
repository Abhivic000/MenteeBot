import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, User, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
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
            Start Your Journey
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Join our supportive community today
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
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <div className="relative">
                <User style={{position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem'}} className="text-muted" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input"
                  style={{paddingLeft: '2.5rem'}}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <div className="relative">
                <Lock style={{position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem'}} className="text-muted" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="input"
                  style={{paddingLeft: '2.5rem'}}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
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
                'Create Account'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="text-green font-medium hover:opacity-75 transition">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}