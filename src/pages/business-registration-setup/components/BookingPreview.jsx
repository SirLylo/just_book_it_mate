import React from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const BookingPreview = ({ businessData, services, availability }) => {
  const getBusinessTypeIcon = (type) => {
    switch (type) {
      case 'trades': return 'Wrench';
      case 'beauty': return 'Sparkles';
      case 'driving': return 'Car';
      default: return 'Briefcase';
    }
  };

  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const getAvailableDays = () => {
    if (!availability) return [];
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    return days?.filter((_, index) => availability?.[dayKeys?.[index]]?.enabled);
  };

  const availableDays = getAvailableDays();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Booking Page Preview</h3>
        <p className="text-sm text-muted-foreground">This is how your booking page will appear to customers.</p>
      </div>
      {/* Preview Container */}
      <div className="border-2 border-dashed border-border rounded-lg p-1">
        <div className="bg-card rounded-lg shadow-moderate overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Icon 
                  name={getBusinessTypeIcon(businessData?.businessType)} 
                  size={32} 
                  className="text-primary-foreground"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {businessData?.businessName || 'Your Business Name'}
                </h1>
                <p className="text-primary-foreground/80">
                  {businessData?.description || 'Professional services with easy online booking'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Business Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="MapPin" size={16} />
                <span>
                  {businessData?.address || businessData?.postcode || 'Business Location'}
                  {businessData?.region && `, ${businessData?.region}`}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Phone" size={16} />
                <span>{businessData?.phone || '+44 7700 900123'}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Mail" size={16} />
                <span>{businessData?.email || 'contact@business.co.uk'}</span>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Our Services</h3>
              {services?.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {services?.slice(0, 3)?.map((service, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg hover:border-primary/30 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-foreground">{service?.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{service?.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="flex items-center text-muted-foreground">
                              <Icon name="Clock" size={14} className="mr-1" />
                              {formatDuration(service?.duration)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-foreground">£{service?.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {services?.length > 3 && (
                    <div className="text-center text-sm text-muted-foreground">
                      +{services?.length - 3} more services available
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 border border-dashed border-border rounded-lg text-center">
                  <p className="text-muted-foreground">Services will appear here</p>
                </div>
              )}
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Opening Hours</h3>
              {availableDays?.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="Calendar" size={16} className="text-primary" />
                    <span className="text-foreground">
                      Available: {availableDays?.join(', ')}
                    </span>
                  </div>
                  {availability && availability?.monday && availability?.monday?.enabled && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Icon name="Clock" size={16} className="text-primary" />
                      <span className="text-foreground">
                        Typical hours: {availability?.monday?.start} - {availability?.monday?.end}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 border border-dashed border-border rounded-lg text-center">
                  <p className="text-muted-foreground">Availability will appear here</p>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button fullWidth size="lg" disabled>
                Book Appointment
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                This button will be active on your live booking page
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Your booking page will include:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="text-muted-foreground">GDPR compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Smartphone" size={16} className="text-success" />
            <span className="text-muted-foreground">Mobile responsive</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={16} className="text-success" />
            <span className="text-muted-foreground">SMS notifications</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Mail" size={16} className="text-success" />
            <span className="text-muted-foreground">Email confirmations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPreview;
