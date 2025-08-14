import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppImage';

const CustomerBookingHeader = ({ 
  businessProfile = null,
  currentStep = 1,
  totalSteps = 4,
  showProgress = true 
}) => {
  const defaultBusiness = {
    name: 'Just Book It Mate',
    logo: '/assets/images/logo.png',
    tagline: 'Easy Booking for UK Businesses'
  };

  const business = businessProfile || defaultBusiness;

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <header className="bg-card border-b border-border shadow-subtle">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Content */}
        <div className="flex items-center justify-between h-16">
          {/* Business Branding */}
          <Link to="/customer-booking-interface" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <Icon name="Calendar" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{business?.name}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{business?.tagline}</p>
            </div>
          </Link>

          {/* Trust Indicators */}
          <div className="hidden md:flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={14} />
              <span>Secure Booking</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>Instant Confirmation</span>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {showProgress && (
          <div className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Step Labels */}
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>
                Service
              </span>
              <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>
                Time
              </span>
              <span className={currentStep >= 3 ? 'text-primary font-medium' : ''}>
                Details
              </span>
              <span className={currentStep >= 4 ? 'text-primary font-medium' : ''}>
                Confirm
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CustomerBookingHeader;
