import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BusinessNavigationHeader from '../../components/ui/BusinessNavigationHeader';

// Import all components
import BusinessTypeSelector from './components/BusinessTypeSelector';
import BusinessDetailsForm from './components/BusinessDetailsForm';
import ServiceTemplateSetup from './components/ServiceTemplateSetup';
import AvailabilitySetup from './components/AvailabilitySetup';
import BookingPreview from './components/BookingPreview';
import ProgressIndicator from './components/ProgressIndicator';
import GDPRConsent from './components/GDPRConsent';

const BusinessRegistrationSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    businessType: '',
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    postcode: '',
    address: '',
    region: '',
    website: '',
    description: ''
  });

  const [services, setServices] = useState([]);
  const [availability, setAvailability] = useState({});
  const [consents, setConsents] = useState({
    termsOfService: false,
    privacyPolicy: false,
    marketing: false,
    analytics: false
  });

  const [errors, setErrors] = useState({});

  const totalSteps = 5;
  const stepLabels = [
    'Business Type',
    'Business Details',
    'Services',
    'Availability',
    'Review & Complete'
  ];

  // Auto-save functionality
  useEffect(() => {
    const savedData = localStorage.getItem('businessSetupData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed?.formData || {});
        setServices(parsed?.services || []);
        setAvailability(parsed?.availability || {});
        setCurrentStep(parsed?.currentStep || 1);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      formData,
      services,
      availability,
      currentStep
    };
    localStorage.setItem('businessSetupData', JSON.stringify(dataToSave));
  }, [formData, services, availability, currentStep]);

  // Validation functions
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData?.businessType) {
          newErrors.businessType = 'Please select your business type';
        }
        break;

      case 2:
        if (!formData?.businessName?.trim()) {
          newErrors.businessName = 'Business name is required';
        }
        if (!formData?.ownerName?.trim()) {
          newErrors.ownerName = 'Your name is required';
        }
        if (!formData?.email?.trim()) {
          newErrors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData?.phone?.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^(\+44|0)[0-9\s-]{10,}$/?.test(formData?.phone?.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid UK phone number';
        }
        if (!formData?.postcode?.trim()) {
          newErrors.postcode = 'Postcode is required';
        } else if (!/^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i?.test(formData?.postcode?.replace(/\s/g, ''))) {
          newErrors.postcode = 'Please enter a valid UK postcode';
        }
        if (!formData?.region) {
          newErrors.region = 'Please select your region';
        }
        break;

      case 3:
        if (services?.length === 0) {
          newErrors.services = 'Please add at least one service';
        }
        break;

      case 4:
        const hasAvailableDay = Object.values(availability)?.some(day => day?.enabled);
        if (!hasAvailableDay) {
          newErrors.availability = 'Please set at least one day as available';
        }
        break;

      case 5:
        if (!consents?.termsOfService) {
          newErrors.termsOfService = 'You must agree to the Terms of Service';
        }
        if (!consents?.privacyPolicy) {
          newErrors.privacyPolicy = 'You must agree to the Privacy Policy';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to create business account
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear saved setup data
      localStorage.removeItem('businessSetupData');
      
      // Show celebration
      setShowCelebration(true);
      
      // Redirect to dashboard after celebration
      setTimeout(() => {
        navigate('/business-dashboard', { 
          state: { 
            isNewBusiness: true,
            businessData: formData,
            services,
            availability
          }
        });
      }, 3000);
      
    } catch (error) {
      console.error('Setup completion error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessTypeSelector
            selectedType={formData?.businessType}
            onTypeSelect={(type) => setFormData({ ...formData, businessType: type })}
            error={errors?.businessType}
          />
        );

      case 2:
        return (
          <BusinessDetailsForm
            formData={formData}
            onFormChange={setFormData}
            errors={errors}
          />
        );

      case 3:
        return (
          <ServiceTemplateSetup
            businessType={formData?.businessType}
            services={services}
            onServicesChange={setServices}
            errors={errors}
          />
        );

      case 4:
        return (
          <AvailabilitySetup
            availability={availability}
            onAvailabilityChange={setAvailability}
            errors={errors}
          />
        );

      case 5:
        return (
          <div className="space-y-8">
            <BookingPreview
              businessData={formData}
              services={services}
              availability={availability}
            />
            <GDPRConsent
              consents={consents}
              onConsentsChange={setConsents}
              errors={errors}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Celebration Modal
  if (showCelebration) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto animate-bounce">
            <Icon name="Check" size={48} className="text-success-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Just Book It Mate!</h1>
            <p className="text-muted-foreground">
              Your business account has been created successfully. Redirecting to your dashboard...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BusinessNavigationHeader />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Calendar" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Business Setup</h1>
                <p className="text-muted-foreground">Get your booking system ready in minutes</p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="max-w-2xl mx-auto mb-8">
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepLabels={stepLabels}
            />
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Content */}
              <div className="lg:col-span-2">
                <div className="glass-surface rounded-lg p-6 lg:p-8">
                  {renderStepContent()}
                </div>
              </div>

              {/* Preview Panel (Desktop) */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <div className="glass-surface rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-4">Setup Progress</h3>
                    
                    <div className="space-y-4">
                      {stepLabels?.map((label, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = stepNumber < currentStep;
                        const isCurrent = stepNumber === currentStep;
                        
                        return (
                          <div
                            key={stepNumber}
                            className={`
                              flex items-center space-x-3 p-3 rounded-lg transition-colors
                              ${isCurrent ? 'bg-primary/10 border border-primary/20' : ''}
                            `}
                          >
                            <div className={`
                              w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                              ${isCompleted 
                                ? 'bg-success text-success-foreground' 
                                : isCurrent
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                              }
                            `}>
                              {isCompleted ? (
                                <Icon name="Check" size={12} />
                              ) : (
                                stepNumber
                              )}
                            </div>
                            <span className={`
                              text-sm
                              ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}
                            `}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 pt-6 border-t border-border space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Services:</span>
                        <span className="text-foreground font-medium">{services?.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available Days:</span>
                        <span className="text-foreground font-medium">
                          {Object.values(availability)?.filter(day => day?.enabled)?.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Back
              </Button>

              <Button
                onClick={handleNext}
                loading={isLoading}
                iconName={currentStep === totalSteps ? "Check" : "ChevronRight"}
                iconPosition="right"
              >
                {currentStep === totalSteps ? 'Complete Setup' : 'Continue'}
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <div className="bg-muted/50 rounded-lg p-6">
              <Icon name="HelpCircle" size={24} className="text-primary mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our setup wizard guides you through creating your booking system. 
                You can always change these settings later in your dashboard.
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <button className="text-primary hover:underline">View Setup Guide</button>
                <button className="text-primary hover:underline">Contact Support</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationSetup;
