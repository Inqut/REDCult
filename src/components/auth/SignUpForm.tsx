import React, { useState } from 'react';
import { Mail, Lock, User, Loader, CheckCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

export const SignUpForm = () => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await signUp(formData.email, formData.password, formData.username);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign up';
      setError(
        message.includes('already registered') ? 'Email already registered' :
        message.includes('already taken') ? 'Username already taken' :
        message
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h3 className="text-xl font-semibold">Verification Email Sent</h3>
        <p className="text-crimson-light">
          Please check your email to verify your account before signing in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        icon={<User className="w-5 h-5" />}
        required
        minLength={3}
        maxLength={30}
        pattern="^[a-zA-Z0-9_-]+$"
        title="Username can only contain letters, numbers, underscores and hyphens"
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        icon={<Mail className="w-5 h-5" />}
        required
      />
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        icon={<Lock className="w-5 h-5" />}
        required
        minLength={6}
      />

      {error && (
        <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-crimson text-white p-3 rounded-lg hover:bg-crimson-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Creating account...
          </>
        ) : (
          'Sign Up'
        )}
      </button>
    </form>
  );
};