import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingSummary = ({ 
  selectedService, 
  selectedDate, 
  selectedTime, 
  customerData, 
  services,
  onConfirmBooking,
  isLoading = false 
}) => {
  const service = services?.find(s => s?.id === selectedService);
  
  if (!service || !selectedDate || !selectedTime) {
    return (
      <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="FileText" size={20} className="mr-2 text-primary" />
          Booking Summary
        </h2>
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Complete the form above to see your booking summary</p>
        </div>
      </div>
    );
  }

  const formatTime = (time) => {
    const [hours, minutes] = time?.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime?.split(':');
    const startDate = new Date();
    startDate?.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    const endHours = endDate?.getHours()?.toString()?.padStart(2, '0');
    const endMinutes = endDate?.getMinutes()?.toString()?.padStart(2, '0');
    return `${endHours}:${endMinutes}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00')?.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isFormComplete = () => {
    return customerData?.firstName && 
           customerData?.lastName && 
           customerData?.email && 
           customerData?.phone && 
           customerData?.address && 
           customerData?.city && 
           customerData?.postcode && 
           customerData?.termsAccepted;
  };

  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="FileText" size={20} className="mr-2 text-primary" />
        Booking Summary
      </h2>
      <div className="space-y-4">
        {/* Service Details */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-foreground">{service?.name}</h3>
              <p className="text-sm text-muted-foreground">{service?.category}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">£{service?.price?.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{service?.duration} minutes</span>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <div className="flex items-center space-x-3">
              <Icon name="Calendar" size={16} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Date</p>
                <p className="text-xs text-muted-foreground">{formatDate(selectedDate)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <div className="flex items-center space-x-3">
              <Icon name="Clock" size={16} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Time</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(selectedTime)} - {formatTime(calculateEndTime(selectedTime, service?.duration))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        {customerData?.firstName && (
          <div className="p-3 bg-background rounded-lg border border-border">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="User" size={16} className="text-primary" />
              <p className="text-sm font-medium text-foreground">Customer Details</p>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{customerData?.firstName} {customerData?.lastName}</p>
              <p>{customerData?.email}</p>
              <p>{customerData?.phone}</p>
              {customerData?.address && (
                <p>{customerData?.address}, {customerData?.city}, {customerData?.postcode}</p>
              )}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">£{service?.price?.toFixed(2)}</span>
          </div>

          <Button
            onClick={onConfirmBooking}
            disabled={!isFormComplete() || isLoading}
            loading={isLoading}
            fullWidth
            className="h-12"
          >
            {isLoading ? 'Processing...' : 'Confirm Booking'}
          </Button>

          {!isFormComplete() && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Please complete all required fields above
            </p>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={14} className="text-success" />
              <span>Secure booking</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} className="text-success" />
              <span>Instant confirmation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Mail" size={14} className="text-success" />
              <span>Email receipt</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="MessageSquare" size={14} className="text-success" />
              <span>SMS reminders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
