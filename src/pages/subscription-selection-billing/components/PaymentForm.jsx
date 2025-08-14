import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentForm = ({ 
  selectedTierData, 
  selectedPrice, 
  billingCycle, 
  isProcessing, 
  onSubmit 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const calculateVAT = (price) => {
    return Math.round(price * 0.2 * 100) / 100;
  };

  const calculateTotal = (price) => {
    return price + calculateVAT(price);
  };

  return (
    <motion.div
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
    </motion.div>
  );
};

export default PaymentForm;
