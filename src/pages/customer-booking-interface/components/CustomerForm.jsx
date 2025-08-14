import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const CustomerForm = ({ 
  customerData, 
  onCustomerDataChange, 
  errors = {},
  onValidation 
}) => {
  const [isValidating, setIsValidating] = useState(false);

  const handleInputChange = (field, value) => {
    onCustomerDataChange({
      ...customerData,
      [field]: value
    });

    // Clear error when user starts typing
    if (errors?.[field] && onValidation) {
      onValidation({ ...errors, [field]: null });
    }
  };

  const validateUKPhone = (phone) => {
    const ukPhoneRegex = /^(\+44|0)[1-9]\d{8,9}$/;
    return ukPhoneRegex?.test(phone?.replace(/\s/g, ''));
  };

  const validateUKPostcode = (postcode) => {
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
    return postcodeRegex?.test(postcode?.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits except +
    let cleaned = value?.replace(/[^\d+]/g, '');
    
    // If starts with 0, replace with +44
    if (cleaned?.startsWith('0')) {
      cleaned = '+44' + cleaned?.substring(1);
    }
    
    // If doesn't start with +44, add it
    if (!cleaned?.startsWith('+44') && cleaned?.length > 0) {
      cleaned = '+44' + cleaned;
    }

    return cleaned;
  };

  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="User" size={20} className="mr-2 text-primary" />
        Your Details
      </h2>
      <div className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            placeholder="Enter your first name"
            value={customerData?.firstName || ''}
            onChange={(e) => handleInputChange('firstName', e?.target?.value)}
            error={errors?.firstName}
            required
          />
          
          <Input
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            value={customerData?.lastName || ''}
            onChange={(e) => handleInputChange('lastName', e?.target?.value)}
            error={errors?.lastName}
            required
          />
        </div>

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          description="We'll send your booking confirmation here"
          value={customerData?.email || ''}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
        />

        {/* Phone Number */}
        <Input
          label="Mobile Number"
          type="tel"
          placeholder="+44 7XXX XXXXXX"
          description="UK mobile number for SMS confirmations"
          value={customerData?.phone || ''}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e?.target?.value);
            handleInputChange('phone', formatted);
          }}
          error={errors?.phone}
          required
        />

        {/* Address Fields */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center">
            <Icon name="MapPin" size={16} className="mr-2 text-primary" />
            Address Information
          </h3>

          <Input
            label="Street Address"
            type="text"
            placeholder="123 High Street"
            value={customerData?.address || ''}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            error={errors?.address}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              type="text"
              placeholder="London"
              value={customerData?.city || ''}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              error={errors?.city}
              required
            />

            <Input
              label="Postcode"
              type="text"
              placeholder="SW1A 1AA"
              description="UK postcode format"
              value={customerData?.postcode || ''}
              onChange={(e) => handleInputChange('postcode', e?.target?.value?.toUpperCase())}
              error={errors?.postcode}
              required
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div className="pt-4 border-t border-border">
          <label className="block text-sm font-medium text-foreground mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            placeholder="Any special requirements or notes for your appointment..."
            value={customerData?.notes || ''}
            onChange={(e) => handleInputChange('notes', e?.target?.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Checkbox
            label="I agree to receive SMS notifications about my appointment"
            description="We'll send booking confirmations and reminders"
            checked={customerData?.smsConsent || false}
            onChange={(e) => handleInputChange('smsConsent', e?.target?.checked)}
            error={errors?.smsConsent}
          />

          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            description="Required to complete your booking"
            checked={customerData?.termsAccepted || false}
            onChange={(e) => handleInputChange('termsAccepted', e?.target?.checked)}
            error={errors?.termsAccepted}
            required
          />

          <Checkbox
            label="I would like to receive marketing emails about special offers"
            description="Optional - you can unsubscribe at any time"
            checked={customerData?.marketingConsent || false}
            onChange={(e) => handleInputChange('marketingConsent', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
