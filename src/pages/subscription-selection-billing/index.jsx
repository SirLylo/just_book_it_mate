import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Check, X, CreditCard, Shield, Star, Calendar, Zap, ArrowLeft, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const SubscriptionSelectionBilling = () => {
  const [selectedTier, setSelectedTier] = useState('professional');
  const [billingCycle, setBillingCycle] = useState('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Pricing tiers
  const tiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: { monthly: 19, annual: 190 },
      description: 'Perfect for getting started',
      popular: false,
      features: [
        { name: 'Unlimited bookings', included: true },
        { name: 'Customer management', included: true },
        { name: 'Calendar integration', included: true },
        { name: 'Email notifications', included: true },
        { name: 'Basic reporting', included: true },
        { name: 'QR code marketing', included: false },
        { name: 'SMS notifications', included: false },
        { name: 'Analytics dashboard', included: false },
        { name: 'Priority support', included: false },
        { name: 'Advanced integrations', included: false }
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: { monthly: 29, annual: 290 },
      description: 'Everything you need to grow',
      popular: true,
      features: [
        { name: 'Everything in Basic', included: true },
        { name: 'QR code marketing', included: true },
        { name: 'SMS notifications', included: true },
        { name: 'Analytics dashboard', included: true },
        { name: 'Priority support', included: true },
        { name: 'Advanced integrations', included: true },
        { name: 'Custom branding', included: true },
        { name: 'API access', included: true },
        { name: 'Multi-location support', included: true },
        { name: 'White-label options', included: false }
      ]
    }
  ];

  const getPrice = (tier) => {
    return billingCycle === 'annual' ? tier?.price?.annual : tier?.price?.monthly;
  };

  const getSavings = (tier) => {
    const monthlyTotal = tier?.price?.monthly * 12;
    const annualPrice = tier?.price?.annual;
    return monthlyTotal - annualPrice;
  };

  const calculateVAT = (price) => {
    return Math.round(price * 0.2 * 100) / 100;
  };

  const calculateTotal = (price) => {
    return price + calculateVAT(price);
  };

  const handleTierSelect = (tierId) => {
    setSelectedTier(tierId);
  };

  const handleContinueToPayment = () => {
    setShowPaymentForm(true);
  };

  const onSubmit = async (data) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      console.log('Payment processed:', { 
        tier: selectedTier, 
        billing: billingCycle, 
        paymentData: data 
      });
      setIsProcessing(false);
      // Redirect to success page or dashboard
      window.location.href = '/business-dashboard';
    }, 3000);
  };

  const selectedTierData = tiers?.find(tier => tier?.id === selectedTier);
  const selectedPrice = getPrice(selectedTierData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <button
              onClick={() => window.history?.back()}
              className="absolute left-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-primary">Choose Your Plan</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Select the perfect plan for your business needs. Start with our 14-day free trial,
            no commitment required.
          </motion.p>
        </div>

        {!showPaymentForm ? (
          <>
            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-muted rounded-lg p-1 flex">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-micro ${
                    billingCycle === 'monthly' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-micro relative ${
                    billingCycle === 'annual' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Annual
                  <span className="absolute -top-2 -right-2 bg-success text-success-foreground text-xs px-1.5 py-0.5 rounded-full">
                    Save 2 months
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
              {tiers?.map((tier, index) => (
                <motion.div
                  key={tier?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`relative rounded-2xl border-2 transition-all duration-300 ${
                    selectedTier === tier?.id
                      ? 'border-primary shadow-moderate scale-105'
                      : 'border-border hover:border-primary/50 shadow-subtle'
                  } ${tier?.popular ? 'ring-2 ring-primary/20' : ''}`}
                >
                  {/* Popular Badge */}
                  {tier?.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full flex items-center">
                        <Star size={14} className="mr-1" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-foreground">{tier?.name}</h3>
                      <p className="text-muted-foreground mt-1">{tier?.description}</p>
                      
                      {/* Price */}
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-primary">
                          £{getPrice(tier)}
                        </span>
                        <span className="text-muted-foreground">
                          /{billingCycle === 'annual' ? 'year' : 'month'}
                        </span>
                        
                        {billingCycle === 'annual' && (
                          <div className="text-sm text-success font-medium mt-1">
                            Save £{getSavings(tier)} per year
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {tier?.features?.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-3"
                        >
                          {feature?.included ? (
                            <Check size={16} className="text-success flex-shrink-0" />
                          ) : (
                            <X size={16} className="text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={
                            feature?.included 
                              ? 'text-foreground' 
                              : 'text-muted-foreground'
                          }>
                            {feature?.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Select Button */}
                    <Button
                      onClick={() => handleTierSelect(tier?.id)}
                      variant={selectedTier === tier?.id ? 'default' : 'outline'}
                      className="w-full"
                      size="lg"
                    >
                      {selectedTier === tier?.id ? 'Selected' : 'Select Plan'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feature Comparison Table - Desktop Only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:block bg-card rounded-xl p-8 mb-8 max-w-5xl mx-auto"
            >
              <h3 className="text-xl font-bold text-center mb-6">Feature Comparison</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium text-foreground">Features</div>
                <div className="font-medium text-center">Basic</div>
                <div className="font-medium text-center">Professional</div>
                
                {tiers?.[0]?.features?.map((feature, index) => (
                  <React.Fragment key={index}>
                    <div className="py-2 text-muted-foreground">{feature?.name}</div>
                    <div className="py-2 text-center">
                      {tiers?.[0]?.features?.[index]?.included ? (
                        <Check size={16} className="text-success mx-auto" />
                      ) : (
                        <X size={16} className="text-muted-foreground mx-auto" />
                      )}
                    </div>
                    <div className="py-2 text-center">
                      {tiers?.[1]?.features?.[index]?.included ? (
                        <Check size={16} className="text-success mx-auto" />
                      ) : (
                        <X size={16} className="text-muted-foreground mx-auto" />
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            {/* Trial Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center bg-accent/10 rounded-xl p-6 mb-8 max-w-3xl mx-auto"
            >
              <Zap className="mx-auto mb-3 text-accent" size={32} />
              <h3 className="text-lg font-semibold mb-2">14-Day Free Trial</h3>
              <p className="text-muted-foreground">
                Start your free trial today. No credit card required during trial period.
                Cancel anytime with no questions asked.
              </p>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <Button
                onClick={handleContinueToPayment}
                size="xl"
                className="px-12"
              >
                Continue to Payment
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Start your 14-day free trial, then £{selectedPrice}/{billingCycle === 'annual' ? 'year' : 'month'}
              </p>
            </motion.div>
          </>
        ) : (
          /* Payment Form */
          (<motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Payment Form */}
              <div className="bg-card rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <CreditCard className="mr-3 text-primary" />
                  Payment Details
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    label="Cardholder Name"
                    type="text"
                    placeholder="Enter name on card"
                    required
                    error={errors?.cardName?.message}
                    {...register('cardName', { 
                      required: 'Cardholder name is required',
                      minLength: { value: 2, message: 'Please enter a valid name' }
                    })}
                  />

                  <Input
                    label="Card Number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    required
                    error={errors?.cardNumber?.message}
                    {...register('cardNumber', { 
                      required: 'Card number is required',
                      pattern: {
                        value: /^[0-9\s]{13,19}$/,
                        message: 'Please enter a valid card number'
                      }
                    })}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      type="text"
                      placeholder="MM/YY"
                      required
                      error={errors?.expiry?.message}
                      {...register('expiry', { 
                        required: 'Expiry date is required',
                        pattern: {
                          value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                          message: 'Please enter MM/YY format'
                        }
                      })}
                    />

                    <Input
                      label="CVV"
                      type="text"
                      placeholder="123"
                      required
                      error={errors?.cvv?.message}
                      {...register('cvv', { 
                        required: 'CVV is required',
                        pattern: {
                          value: /^[0-9]{3,4}$/,
                          message: 'Please enter a valid CVV'
                        }
                      })}
                    />
                  </div>

                  <Input
                    label="Billing Address"
                    type="text"
                    placeholder="Enter billing address"
                    required
                    error={errors?.address?.message}
                    {...register('address', { required: 'Billing address is required' })}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      type="text"
                      placeholder="City"
                      required
                      error={errors?.city?.message}
                      {...register('city', { required: 'City is required' })}
                    />

                    <Input
                      label="Postal Code"
                      type="text"
                      placeholder="SW1A 1AA"
                      required
                      error={errors?.postcode?.message}
                      {...register('postcode', { 
                        required: 'Postal code is required',
                        pattern: {
                          value: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i,
                          message: 'Please enter a valid UK postcode'
                        }
                      })}
                    />
                  </div>

                  {/* Terms Acceptance */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="termsAcceptance"
                      className="mt-1 h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      {...register('termsAcceptance', { required: 'You must accept the terms' })}
                    />
                    <label htmlFor="termsAcceptance" className="text-sm text-foreground">
                      I agree to the{' '}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>{' '}
                      and authorize Just Book It Mate to charge my payment method.
                    </label>
                  </div>
                  {errors?.termsAcceptance && (
                    <p className="text-sm text-error">{errors?.termsAcceptance?.message}</p>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={isProcessing}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      'Processing Payment...'
                    ) : (
                      `Start Free Trial - £${calculateTotal(selectedPrice)} after 14 days`
                    )}
                  </Button>

                  {/* Security Notice */}
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Shield size={16} />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div className="bg-muted rounded-xl p-8 h-fit">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-medium">{selectedTierData?.name} Plan</span>
                    <span className="font-bold text-primary">
                      {selectedTierData?.name}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Billing Cycle</span>
                    <span className="capitalize">{billingCycle}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Trial Period</span>
                    <span className="text-success font-medium">14 days free</span>
                  </div>

                  <hr className="border-border" />
                  
                  <div className="flex justify-between">
                    <span>Subtotal (after trial)</span>
                    <span>£{selectedPrice}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>VAT (20%)</span>
                    <span>£{calculateVAT(selectedPrice)}</span>
                  </div>
                  
                  <hr className="border-border" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total (after trial)</span>
                    <span className="text-primary">£{calculateTotal(selectedPrice)}</span>
                  </div>
                </div>

                {/* Selected Features */}
                <div className="space-y-3">
                  <h4 className="font-medium">Included Features:</h4>
                  {selectedTierData?.features
                    ?.filter(feature => feature?.included)
                    ?.slice(0, 5)
                    ?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Check size={14} className="text-success" />
                      <span>{feature?.name}</span>
                    </div>
                  ))}
                  {selectedTierData?.features?.filter(f => f?.included)?.length > 5 && (
                    <div className="text-sm text-muted-foreground">
                      +{selectedTierData?.features?.filter(f => f?.included)?.length - 5} more features
                    </div>
                  )}
                </div>

                {/* Money Back Guarantee */}
                <div className="mt-6 p-4 bg-success/10 rounded-lg">
                  <div className="flex items-center space-x-2 text-success font-medium text-sm">
                    <Lock size={16} />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>)
        )}
      </div>
    </div>
  );
};

export default SubscriptionSelectionBilling;
