import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Building2, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const UserAuthenticationRegistration = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const watchedPassword = watch('password', '');

  // Industry options for dropdown
  const industryOptions = [
    { value: 'trades', label: 'Trades & Construction' },
    { value: 'beauty', label: 'Beauty & Wellness' },
    { value: 'driving', label: 'Driving Instruction' },
    { value: 'healthcare', label: 'Healthcare Services' },
    { value: 'fitness', label: 'Fitness & Training' },
    { value: 'consulting', label: 'Professional Consulting' },
    { value: 'automotive', label: 'Automotive Services' },
    { value: 'education', label: 'Education & Tutoring' },
    { value: 'other', label: 'Other Services' }
  ];

  // Password strength calculation
  React.useEffect(() => {
    const calculateStrength = (password) => {
      let strength = 0;
      if (password?.length >= 8) strength++;
      if (/[A-Z]/?.test(password)) strength++;
      if (/[a-z]/?.test(password)) strength++;
      if (/[0-9]/?.test(password)) strength++;
      if (/[^A-Za-z0-9]/?.test(password)) strength++;
      return strength;
    };
    setPasswordStrength(calculateStrength(watchedPassword));
  }, [watchedPassword]);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    reset();
    setPasswordStrength(0);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(isSignUp ? 'Registration data:' : 'Login data:', data);
      setIsLoading(false);
      // Redirect based on mode
      if (isSignUp) {
        // Redirect to subscription selection
        window.location.href = '/subscription-selection-billing';
      } else {
        // Redirect to dashboard
        window.location.href = '/business-dashboard';
      }
    }, 2000);
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login initiated`);
    // Implement social login logic here
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-error';
    if (passwordStrength <= 3) return 'bg-warning';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary/20">
      {/* Mobile-first container */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Form (mobile full width, desktop split) */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-primary"
              >
                Just Book It Mate
              </motion.h1>
              
              {/* Toggle Buttons */}
              <div className="mt-6 flex rounded-lg bg-muted p-1">
                <button
                  type="button"
                  onClick={() => !isSignUp && toggleMode()}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-micro ${
                    isSignUp 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => isSignUp && toggleMode()}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-micro ${
                    !isSignUp 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Login
                </button>
              </div>
            </div>

            {/* Form */}
            <motion.form 
              key={isSignUp ? 'signup' : 'login'}
              initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {isSignUp ? (
                // Registration Form
                (<>
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    error={errors?.fullName?.message}
                    {...register('fullName', { 
                      required: 'Full name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    required
                    error={errors?.email?.message}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  <Input
                    label="UK Mobile Number"
                    type="tel"
                    placeholder="+44 7XXX XXXXXX"
                    required
                    error={errors?.phone?.message}
                    {...register('phone', { 
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^(\+44|0)[7-9]\d{8,9}$/,
                        message: 'Please enter a valid UK mobile number'
                      }
                    })}
                  />
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        required
                        error={errors?.password?.message}
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: { value: 8, message: 'Password must be at least 8 characters' }
                        })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {watchedPassword && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Password strength:</span>
                          <span className={`font-medium ${
                            passwordStrength <= 1 ? 'text-error' : 
                            passwordStrength <= 3 ? 'text-warning' : 'text-success'
                          }`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <Input
                    label="Business Name"
                    type="text"
                    placeholder="Enter your business name"
                    required
                    error={errors?.businessName?.message}
                    {...register('businessName', { 
                      required: 'Business name is required',
                      minLength: { value: 2, message: 'Business name must be at least 2 characters' }
                    })}
                  />
                  <Select
                    label="Industry"
                    placeholder="Select your industry"
                    options={industryOptions}
                    required
                    error={errors?.industry?.message}
                    {...register('industry', { required: 'Please select your industry' })}
                  />
                  {/* GDPR Consent */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="gdprConsent"
                      className="mt-1 h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      {...register('gdprConsent', { required: 'You must accept the privacy policy' })}
                    />
                    <label htmlFor="gdprConsent" className="text-sm text-foreground">
                      I agree to the{' '}
                      <a href="/privacy-policy" className="text-primary hover:underline">
                        Privacy Policy
                      </a>{' '}
                      and{' '}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>
                    </label>
                  </div>
                  {errors?.gdprConsent && (
                    <p className="text-sm text-error">{errors?.gdprConsent?.message}</p>
                  )}
                </>)
              ) : (
                // Login Form
                (<>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    required
                    error={errors?.email?.message}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      required
                      error={errors?.password?.message}
                      {...register('password', { required: 'Password is required' })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Remember Me and Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        {...register('rememberMe')}
                      />
                      <label htmlFor="rememberMe" className="text-sm text-foreground">
                        Remember me
                      </label>
                    </div>
                    <a
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                </>)
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading 
                  ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                  : (isSignUp ? 'Create Account' : 'Sign In')
                }
              </Button>

              {/* Social Login */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('Google')}
                    className="w-full"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('Microsoft')}
                    className="w-full"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                    </svg>
                    Microsoft
                  </Button>
                </div>
              </div>
            </motion.form>
          </div>
        </div>

        {/* Right side - Promotional content (hidden on mobile, visible on desktop) */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-primary to-primary/80 p-8">
          <div className="max-w-md text-center text-primary-foreground space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Building2 size={64} className="mx-auto mb-4" />
              <h2 className="text-3xl font-bold">
                {isSignUp ? 'Join Thousands of Businesses' : 'Welcome Back!'}
              </h2>
              <p className="text-primary-foreground/90 text-lg">
                {isSignUp 
                  ? 'Transform your booking process with our powerful SaaS platform. Start your free trial today!'
                  : 'Sign in to continue managing your bookings and growing your business.'
                }
              </p>
            </motion.div>

            {isSignUp && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 text-primary-foreground/90">
                  <Check size={20} />
                  <span>Unlimited bookings & customer management</span>
                </div>
                <div className="flex items-center space-x-3 text-primary-foreground/90">
                  <Check size={20} />
                  <span>Calendar integration & notifications</span>
                </div>
                <div className="flex items-center space-x-3 text-primary-foreground/90">
                  <Check size={20} />
                  <span>QR code marketing & analytics</span>
                </div>
                <div className="flex items-center space-x-3 text-primary-foreground/90">
                  <Check size={20} />
                  <span>14-day free trial, no commitment</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuthenticationRegistration;
