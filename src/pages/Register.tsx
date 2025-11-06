import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ErrorBox from '../components/ErrorBox';

const Register: React.FC = () => {
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email || !password) {
      return setError('All fields are required');
    }
    
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return setError('Invalid email format');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    if (password !== password2) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await auth?.register(email, password);
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Register error:', err);
      
      // Handle different error types
      if (err?.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else if (err?.response?.status === 409) {
        setError('Email already registered. Please login instead.');
      } else {
        const errorMessage = err?.response?.data?.message 
          || err?.response?.data?.error
          || err?.message 
          || 'Registration failed. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Sign up to get started</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
          {error && <ErrorBox message={error} />}
          
          {success && (
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-green-400 text-sm font-medium">Success!</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Account created successfully. Redirecting to login...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading || success}
                className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading || success}
                className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
                disabled={loading || success}
                className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : success ? 'Success!' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;