import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BusinessDetailsForm = ({ formData, onFormChange, errors }) => {
  const ukCounties = [
    { value: 'england', label: 'England' },
    { value: 'scotland', label: 'Scotland' },
    { value: 'wales', label: 'Wales' },
    { value: 'northern-ireland', label: 'Northern Ireland' }
  ];

  const handleInputChange = (field) => (e) => {
    onFormChange({
      ...formData,
      [field]: e?.target?.value
    });
  };

  const handleSelectChange = (field) => (value) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Business Details</h3>
        <p className="text-sm text-muted-foreground">Tell us about your business so we can create your booking page.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Business Name"
            type="text"
            placeholder="e.g., Smith Plumbing Services"
            value={formData?.businessName || ''}
            onChange={handleInputChange('businessName')}
            error={errors?.businessName}
            required
          />
        </div>

        <Input
          label="Your Full Name"
          type="text"
          placeholder="e.g., John Smith"
          value={formData?.ownerName || ''}
          onChange={handleInputChange('ownerName')}
          error={errors?.ownerName}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="john@smithplumbing.co.uk"
          value={formData?.email || ''}
          onChange={handleInputChange('email')}
          error={errors?.email}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+44 7700 900123"
          value={formData?.phone || ''}
          onChange={handleInputChange('phone')}
          error={errors?.phone}
          description="UK mobile or landline number"
          required
        />

        <Input
          label="Postcode"
          type="text"
          placeholder="SW1A 1AA"
          value={formData?.postcode || ''}
          onChange={handleInputChange('postcode')}
          error={errors?.postcode}
          description="UK postcode for your business location"
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Business Address"
            type="text"
            placeholder="123 High Street, London"
            value={formData?.address || ''}
            onChange={handleInputChange('address')}
            error={errors?.address}
            description="Full business address (optional for mobile services)"
          />
        </div>

        <Select
          label="Region"
          placeholder="Select your region"
          options={ukCounties}
          value={formData?.region || ''}
          onChange={handleSelectChange('region')}
          error={errors?.region}
          required
        />

        <Input
          label="Website (Optional)"
          type="url"
          placeholder="https://www.smithplumbing.co.uk"
          value={formData?.website || ''}
          onChange={handleInputChange('website')}
          error={errors?.website}
        />
      </div>
      <div>
        <Input
          label="Business Description"
          type="text"
          placeholder="Brief description of your services (appears on booking page)"
          value={formData?.description || ''}
          onChange={handleInputChange('description')}
          error={errors?.description}
          description="This will be shown to customers on your booking page"
        />
      </div>
    </div>
  );
};

export default BusinessDetailsForm;
