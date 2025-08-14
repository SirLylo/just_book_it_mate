import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ServiceModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  service = null,
  categories = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    category: '',
    bufferTime: 15,
    maxDailyBookings: 10,
    isActive: true,
    requiresDeposit: false,
    depositAmount: 0,
    allowOnlineBooking: true,
    advanceBookingDays: 30,
    cancellationHours: 24
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: '',
        description: '',
        duration: 60,
        price: 0,
        category: '',
        bufferTime: 15,
        maxDailyBookings: 10,
        isActive: true,
        requiresDeposit: false,
        depositAmount: 0,
        allowOnlineBooking: true,
        advanceBookingDays: 30,
        cancellationHours: 24
      });
    }
    setErrors({});
  }, [service, isOpen]);

  const industryTemplates = [
    {
      name: 'Beauty Services',
      services: [
        { name: 'Cut & Blow Dry', duration: 60, price: 45.00, category: 'Hair' },
        { name: 'Hair Colour', duration: 120, price: 85.00, category: 'Hair' },
        { name: 'Manicure', duration: 45, price: 25.00, category: 'Nails' },
        { name: 'Facial Treatment', duration: 75, price: 55.00, category: 'Skincare' }
      ]
    },
    {
      name: 'Trade Services',
      services: [
        { name: 'Emergency Call-out', duration: 60, price: 120.00, category: 'Emergency' },
        { name: 'Boiler Service', duration: 90, price: 85.00, category: 'Maintenance' },
        { name: 'Electrical Inspection', duration: 120, price: 150.00, category: 'Safety' },
        { name: 'Plumbing Repair', duration: 60, price: 75.00, category: 'Repair' }
      ]
    },
    {
      name: 'Driving Lessons',
      services: [
        { name: 'Standard Lesson', duration: 60, price: 35.00, category: 'Lessons' },
        { name: 'Intensive Course', duration: 480, price: 250.00, category: 'Courses' },
        { name: 'Mock Test', duration: 90, price: 45.00, category: 'Testing' },
        { name: 'Pass Plus', duration: 360, price: 180.00, category: 'Advanced' }
      ]
    }
  ];

  const categoryOptions = categories?.map(cat => ({ value: cat, label: cat }));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      ...template,
      id: prev?.id // Preserve ID if editing
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) newErrors.name = 'Service name is required';
    if (!formData?.description?.trim()) newErrors.description = 'Description is required';
    if (formData?.duration <= 0) newErrors.duration = 'Duration must be greater than 0';
    if (formData?.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData?.category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-floating w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {service ? 'Edit Service' : 'Add New Service'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configure service details and booking parameters
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-140px)]">
          {/* Sidebar - Templates */}
          <div className="w-80 border-r border-border p-6 overflow-y-auto">
            <h3 className="text-sm font-medium text-foreground mb-4">Quick Templates</h3>
            
            {industryTemplates?.map((industry) => (
              <div key={industry?.name} className="mb-6">
                <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  {industry?.name}
                </h4>
                <div className="space-y-2">
                  {industry?.services?.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full text-left p-3 rounded-md border border-border hover:bg-muted transition-micro"
                    >
                      <div className="font-medium text-sm text-foreground">{template?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {template?.duration}min • £{template?.price?.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Main Form */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
                {[
                  { id: 'basic', label: 'Basic Info', icon: 'Info' },
                  { id: 'pricing', label: 'Pricing', icon: 'Pound' },
                  { id: 'booking', label: 'Booking Rules', icon: 'Calendar' },
                  { id: 'advanced', label: 'Advanced', icon: 'Settings' }
                ]?.map((tab) => (
                  <button
                    key={tab?.id}
                    type="button"
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-micro ${
                      activeTab === tab?.id
                        ? 'bg-card text-foreground shadow-subtle'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Input
                      label="Service Name"
                      type="text"
                      value={formData?.name}
                      onChange={(e) => handleInputChange('name', e?.target?.value)}
                      error={errors?.name}
                      placeholder="e.g., Cut & Blow Dry"
                      required
                    />
                    
                    <Select
                      label="Category"
                      options={categoryOptions}
                      value={formData?.category}
                      onChange={(value) => handleInputChange('category', value)}
                      error={errors?.category}
                      placeholder="Select category"
                      required
                    />
                  </div>
                  
                  <Input
                    label="Description"
                    type="text"
                    value={formData?.description}
                    onChange={(e) => handleInputChange('description', e?.target?.value)}
                    error={errors?.description}
                    placeholder="Brief description of the service"
                    required
                  />
                  
                  <Input
                    label="Duration (minutes)"
                    type="number"
                    value={formData?.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e?.target?.value))}
                    error={errors?.duration}
                    min="15"
                    step="15"
                    required
                  />
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Input
                      label="Service Price (£)"
                      type="number"
                      value={formData?.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e?.target?.value))}
                      error={errors?.price}
                      step="0.01"
                      min="0"
                      required
                    />
                    
                    <div className="space-y-4">
                      <Checkbox
                        label="Require Deposit"
                        checked={formData?.requiresDeposit}
                        onChange={(e) => handleInputChange('requiresDeposit', e?.target?.checked)}
                      />
                      
                      {formData?.requiresDeposit && (
                        <Input
                          label="Deposit Amount (£)"
                          type="number"
                          value={formData?.depositAmount}
                          onChange={(e) => handleInputChange('depositAmount', parseFloat(e?.target?.value))}
                          step="0.01"
                          min="0"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'booking' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Input
                      label="Buffer Time (minutes)"
                      type="number"
                      value={formData?.bufferTime}
                      onChange={(e) => handleInputChange('bufferTime', parseInt(e?.target?.value))}
                      min="0"
                      step="5"
                      description="Time between appointments"
                    />
                    
                    <Input
                      label="Max Bookings Per Day"
                      type="number"
                      value={formData?.maxDailyBookings}
                      onChange={(e) => handleInputChange('maxDailyBookings', parseInt(e?.target?.value))}
                      min="1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Input
                      label="Advance Booking (days)"
                      type="number"
                      value={formData?.advanceBookingDays}
                      onChange={(e) => handleInputChange('advanceBookingDays', parseInt(e?.target?.value))}
                      min="1"
                      description="How far in advance customers can book"
                    />
                    
                    <Input
                      label="Cancellation Notice (hours)"
                      type="number"
                      value={formData?.cancellationHours}
                      onChange={(e) => handleInputChange('cancellationHours', parseInt(e?.target?.value))}
                      min="1"
                      description="Minimum notice for cancellations"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Checkbox
                      label="Service Active"
                      description="Customers can book this service"
                      checked={formData?.isActive}
                      onChange={(e) => handleInputChange('isActive', e?.target?.checked)}
                    />
                    
                    <Checkbox
                      label="Allow Online Booking"
                      description="Service appears in online booking system"
                      checked={formData?.allowOnlineBooking}
                      onChange={(e) => handleInputChange('allowOnlineBooking', e?.target?.checked)}
                    />
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border mt-8">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  {service ? 'Update Service' : 'Create Service'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
