import React from 'react';
import { motion } from 'framer-motion';

const PasswordStrengthIndicator = ({ password, strength }) => {
  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-error';
    if (strength <= 3) return 'bg-warning';
    return 'bg-success';
  };

  const getStrengthText = () => {
    if (strength <= 1) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  const getStrengthTextColor = () => {
    if (strength <= 1) return 'text-error';
    if (strength <= 3) return 'text-warning';
    return 'text-success';
  };

  const requirements = [
    { test: (pwd) => pwd?.length >= 8, text: 'At least 8 characters' },
    { test: (pwd) => /[A-Z]/?.test(pwd), text: 'One uppercase letter' },
    { test: (pwd) => /[a-z]/?.test(pwd), text: 'One lowercase letter' },
    { test: (pwd) => /[0-9]/?.test(pwd), text: 'One number' },
    { test: (pwd) => /[^A-Za-z0-9]/?.test(pwd), text: 'One special character' }
  ];

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Password strength:</span>
          <span className={`font-medium ${getStrengthTextColor()}`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${(strength / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      {/* Requirements List */}
      <div className="space-y-1">
        {requirements?.map((req, index) => {
          const isMet = req?.test(password);
          return (
            <motion.div
              key={index}
              className="flex items-center space-x-2 text-xs"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                isMet ? 'bg-success' : 'bg-muted border border-border'
              }`}>
                {isMet && (
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={isMet ? 'text-foreground' : 'text-muted-foreground'}>
                {req?.text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
