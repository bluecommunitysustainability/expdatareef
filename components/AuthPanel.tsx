
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface AuthPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-gray-800 shadow-2xl z-50 transition-transform duration-500 ease-in-out p-6 rounded-t-lg ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="max-w-md mx-auto">
          <img src="https://labs.landsurveyorsunited.com/datareef/icons/web/android-chrome-192x192.png" alt="DataReef Logo" className="mx-auto h-12 w-auto mb-4" />
          <h2 className={`text-2xl font-bold text-center ${theme.text.primary}`}>Sign In</h2>
          <p className="text-center text-gray-400 mt-2 mb-6">Enter your email to sign in or create a new local profile.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 ${theme.ring.primary}`}
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${theme.ring.primary}`}
            >
              Sign In / Continue
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
