import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const GDPRConsent = ({ consents, onConsentsChange, errors }) => {
  const handleConsentChange = (consentType) => (e) => {
    onConsentsChange({
      ...consents,
      [consentType]: e?.target?.checked
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Privacy & Consent</h3>
        <p className="text-sm text-muted-foreground">
          We're committed to protecting your privacy and complying with UK GDPR regulations.
        </p>
      </div>
      {/* GDPR Information */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">Your Data Rights</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Under UK GDPR, you have the right to access, rectify, erase, and port your personal data. 
              You can also object to processing and request restriction of processing.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Icon name="Lock" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">Data Security</h4>
            <p className="text-sm text-muted-foreground mt-1">
              We use industry-standard encryption and security measures to protect your business and customer data.
            </p>
          </div>
        </div>
      </div>
      {/* Consent Checkboxes */}
      <div className="space-y-4">
        <Checkbox
          label="I agree to the Terms of Service"
          description="By checking this box, you agree to our terms and conditions for using Just Book It Mate."
          checked={consents?.termsOfService || false}
          onChange={handleConsentChange('termsOfService')}
          error={errors?.termsOfService}
          required
        />

        <Checkbox
          label="I agree to the Privacy Policy"
          description="You consent to our collection and processing of your personal data as described in our privacy policy."
          checked={consents?.privacyPolicy || false}
          onChange={handleConsentChange('privacyPolicy')}
          error={errors?.privacyPolicy}
          required
        />

        <Checkbox
          label="I consent to marketing communications"
          description="Receive helpful tips, feature updates, and promotional offers via email. You can unsubscribe at any time."
          checked={consents?.marketing || false}
          onChange={handleConsentChange('marketing')}
        />

        <Checkbox
          label="I consent to data processing for service improvement"
          description="Allow us to analyze usage patterns to improve our service quality and user experience."
          checked={consents?.analytics || false}
          onChange={handleConsentChange('analytics')}
        />
      </div>
      {/* Legal Links */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Important Documents</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Terms of Service</span>
            <button className="text-primary hover:underline">View Document</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Privacy Policy</span>
            <button className="text-primary hover:underline">View Document</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cookie Policy</span>
            <button className="text-primary hover:underline">View Document</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Data Processing Agreement</span>
            <button className="text-primary hover:underline">View Document</button>
          </div>
        </div>
      </div>
      {/* Contact Information */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          <strong>Data Controller:</strong> Just Book It Mate Ltd, registered in England & Wales
        </p>
        <p>
          <strong>Data Protection Officer:</strong> privacy@justbookitmate.co.uk
        </p>
        <p>
          <strong>ICO Registration:</strong> ZA123456 (Information Commissioner's Office)
        </p>
      </div>
      {/* General Error */}
      {errors?.general && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-sm text-error">{errors?.general}</p>
        </div>
      )}
    </div>
  );
};

export default GDPRConsent;
