import React, { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

export const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  return (
    <div>
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('signin')}
          className={`flex-1 p-3 text-center border-b-2 transition-colors ${
            activeTab === 'signin'
              ? 'border-crimson text-crimson'
              : 'border-crimson-dark text-crimson-dark hover:text-crimson-light'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveTab('signup')}
          className={`flex-1 p-3 text-center border-b-2 transition-colors ${
            activeTab === 'signup'
              ? 'border-crimson text-crimson'
              : 'border-crimson-dark text-crimson-dark hover:text-crimson-light'
          }`}
        >
          Sign Up
        </button>
      </div>

      {activeTab === 'signin' ? <SignInForm /> : <SignUpForm />}
    </div>
  );
};