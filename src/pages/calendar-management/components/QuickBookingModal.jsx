import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const QuickBookingModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  selectedTime, 
  onBookingCreate 
}) => {
  const [formData, setFormData] = React.useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    service: '',
    duration: 60,
    notes: ''
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [existingCustomers] = React.useState([
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+44 7700 900123' },
    { id: 2, name: 'Michael Brown', email: 'mike.brown@email.com', phone: '+44 7700 900456' },
    { id: 3, name: 'Emma Wilson', email: 'emma.w@email.com', phone: '+44 7700 900789' }
  ]);

  const services = [
    { value: 'haircut', label: 'Haircut & Style', price: 45 },
    { value: 'color', label: 'Hair Coloring', price: 85 },
    { value: 'highlights', label: 'Highlights', price: 95 },
    { value: 'treatment', label: 'Hair Treatment', price: 35 },
    { value: 'wedding', label: 'Wedding Package', price: 150 }
  ];

  const durations = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' }
  ];

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        service: '',
        duration: 60,
        notes: ''
      });
    }
  }, [isOpen]);

  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customerName: customer?.name,
      customerEmail: customer?.email,
      customerPhone: customer?.phone
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);

    try {
      const selectedService = services?.find(s => s?.value === formData?.service);
      const booking = {
        id: Date.now(),
        date: selectedDate,
        startTime: selectedTime,
        endTime: calculateEndTime(selectedTime, formData?.duration),
        customerName: formData?.customerName,
        customerEmail: formData?.customerEmail,
        customerPhone: formData?.customerPhone,
        service: selectedService?.label || formData?.service,
        price: selectedService?.price || 0,
        duration: formData?.duration,
        notes: formData?.notes,
        status: 'confirmed'
      };

      await onBookingCreate(booking);
      onClose();
    } catch (error) {
      console.error('Booking creation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime?.split(':')?.map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours?.toString()?.padStart(2, '0')}:${endMins?.toString()?.padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-floating w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Quick Booking</h2>
            <p className="text-sm text-muted-foreground">
              {selectedDate?.toLocaleDateString('en-GB')} at {selectedTime}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Existing Customer Search */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Quick Select Customer
            </label>
            <div className="space-y-2">
              {existingCustomers?.map((customer) => (
                <button
                  key={customer?.id}
                  type="button"
                  onClick={() => handleCustomerSelect(customer)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:bg-secondary/20 transition-micro"
                >
                  <div className="font-medium text-foreground">{customer?.name}</div>
                  <div className="text-sm text-muted-foreground">{customer?.email}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground mb-4">Or enter new customer details:</p>
          </div>

          {/* Customer Details */}
          <Input
            label="Customer Name"
            type="text"
            value={formData?.customerName}
            onChange={(e) => setFormData(prev => ({ ...prev, customerName: e?.target?.value }))}
            required
            placeholder="Enter customer name"
          />

          <Input
            label="Email Address"
            type="email"
            value={formData?.customerEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e?.target?.value }))}
            required
            placeholder="customer@email.com"
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData?.customerPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e?.target?.value }))}
            required
            placeholder="+44 7700 900000"
          />

          {/* Service Selection */}
          <Select
            label="Service"
            options={services?.map(service => ({
              value: service?.value,
              label: `${service?.label} - £${service?.price}`
            }))}
            value={formData?.service}
            onChange={(value) => setFormData(prev => ({ ...prev, service: value }))}
            required
            placeholder="Select a service"
          />

          {/* Duration */}
          <Select
            label="Duration"
            options={durations}
            value={formData?.duration}
            onChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
            required
          />

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Notes (Optional)
            </label>
            <textarea
              value={formData?.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e?.target?.value }))}
              placeholder="Any special requirements or notes..."
              className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              className="flex-1"
            >
              Create Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickBookingModal;
