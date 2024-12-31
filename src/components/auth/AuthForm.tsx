import React, { useState } from 'react';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { signIn, signUp } from '../../services/authService';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.username);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleSkip = () => {
    // Navigate to main content without authentication
    // This will be handled by your router
  };

  return (
    <div className="min-h-screen bg-crimson-darkest flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">{isLogin ? 'Welcome Back' : 'Join the Cult'}</h2>
          <p className="mt-2 text-crimson-light">Enter the digital sanctum</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-crimson-darkest border-2 border-crimson-dark p-3 rounded-lg focus:border-crimson outline-none"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-crimson-darkest border-2 border-crimson-dark p-3 rounded-lg focus:border-crimson outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-crimson-darkest border-2 border-crimson-dark p-3 rounded-lg focus:border-crimson outline-none"
              required
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-crimson text-white p-3 rounded-lg hover:bg-crimson-light transition-colors flex items-center justify-center gap-2"
            >
              {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full border-2 border-crimson-dark p-3 rounded-lg hover:border-crimson transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Skip Authentication
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-crimson-light hover:text-crimson transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};