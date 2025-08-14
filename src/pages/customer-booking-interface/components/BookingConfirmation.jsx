import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingConfirmation = ({ 
  bookingDetails, 
  businessInfo,
  onNewBooking,
  onDownloadConfirmation 
}) => {
  const formatTime = (time) => {
    const [hours, minutes] = time?.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00')?.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateCalendarLink = () => {
    const startDate = new Date(`${bookingDetails.date}T${bookingDetails.time}`);
    const endDate = new Date(startDate.getTime() + bookingDetails.service.duration * 60000);
    
    const formatCalendarDate = (date) => {
      return date?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0] + 'Z';
    };

    const title = encodeURIComponent(`${bookingDetails?.service?.name} - ${businessInfo?.name}`);
    const details = encodeURIComponent(`Booking Reference: ${bookingDetails?.reference}\nService: ${bookingDetails?.service?.name}\nDuration: ${bookingDetails?.service?.duration} minutes\nPrice: £${bookingDetails?.service?.price?.toFixed(2)}\n\nBusiness Contact:\n${businessInfo?.phone}\n${businessInfo?.email}`);
    const location = encodeURIComponent(businessInfo?.address);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}&details=${details}&location=${location}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Success Header */}
      <div className="bg-success text-success-foreground py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Icon name="CheckCircle" size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-lg opacity-90">Your appointment has been successfully booked</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Reference */}
            <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Hash" size={20} className="mr-2 text-primary" />
                Booking Reference
              </h2>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-2xl font-mono font-bold text-primary text-center">
                  {bookingDetails?.reference}
                </p>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Please keep this reference for your records
                </p>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Calendar" size={20} className="mr-2 text-primary" />
                Appointment Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
                  <Icon name="Settings" size={20} className="text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{bookingDetails?.service?.name}</h3>
                    <p className="text-sm text-muted-foreground">{bookingDetails?.service?.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>{bookingDetails?.service?.duration} minutes</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Pound" size={14} />
                        <span>£{bookingDetails?.service?.price?.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-background rounded-lg border border-border">
                    <Icon name="Calendar" size={20} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Date</p>
                      <p className="text-sm text-muted-foreground">{formatDate(bookingDetails?.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-background rounded-lg border border-border">
                    <Icon name="Clock" size={20} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Time</p>
                      <p className="text-sm text-muted-foreground">{formatTime(bookingDetails?.time)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="User" size={20} className="mr-2 text-primary" />
                Customer Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">
                    {bookingDetails?.customer?.firstName} {bookingDetails?.customer?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{bookingDetails?.customer?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{bookingDetails?.customer?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium text-foreground">
                    {bookingDetails?.customer?.address}, {bookingDetails?.customer?.city}, {bookingDetails?.customer?.postcode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => window.open(generateCalendarLink(), '_blank')}
                  variant="outline"
                  fullWidth
                  iconName="Calendar"
                  iconPosition="left"
                >
                  Add to Calendar
                </Button>

                <Button
                  onClick={onDownloadConfirmation}
                  variant="outline"
                  fullWidth
                  iconName="Download"
                  iconPosition="left"
                >
                  Download Confirmation
                </Button>

                <Button
                  onClick={onNewBooking}
                  variant="default"
                  fullWidth
                  iconName="Plus"
                  iconPosition="left"
                >
                  Book Another Appointment
                </Button>
              </div>
            </div>

            {/* Business Contact */}
            <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Building" size={20} className="mr-2 text-primary" />
                {businessInfo?.name}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Icon name="Phone" size={16} className="text-primary" />
                  <span className="text-foreground">{businessInfo?.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Mail" size={16} className="text-primary" />
                  <span className="text-foreground">{businessInfo?.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Icon name="MapPin" size={16} className="text-primary mt-0.5" />
                  <span className="text-foreground">{businessInfo?.address}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Info" size={20} className="mr-2 text-primary" />
                What's Next?
              </h3>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-3">
                  <Icon name="Mail" size={16} className="text-primary mt-0.5" />
                  <span>You'll receive an email confirmation shortly</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Icon name="MessageSquare" size={16} className="text-primary mt-0.5" />
                  <span>SMS reminder will be sent 24 hours before your appointment</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Icon name="Phone" size={16} className="text-primary mt-0.5" />
                  <span>Contact the business directly if you need to reschedule</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
