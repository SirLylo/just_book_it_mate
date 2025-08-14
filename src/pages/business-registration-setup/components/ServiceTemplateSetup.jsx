import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ServiceTemplateSetup = ({ businessType, services, onServicesChange, errors }) => {
  const [customService, setCustomService] = useState({ name: '', duration: 60, price: '' });

  const serviceTemplates = {
    trades: [
      { name: 'Emergency Call-out', duration: 120, price: '85.00', description: 'Urgent repair service' },
      { name: 'Boiler Service', duration: 90, price: '120.00', description: 'Annual boiler maintenance' },
      { name: 'Bathroom Installation', duration: 480, price: '450.00', description: 'Full bathroom fitting' },
      { name: 'Kitchen Plumbing', duration: 240, price: '280.00', description: 'Kitchen sink and appliance installation' },
      { name: 'Leak Repair', duration: 60, price: '65.00', description: 'Fix leaking pipes and taps' },
      { name: 'Drain Unblocking', duration: 45, price: '55.00', description: 'Clear blocked drains and toilets' }
    ],
    beauty: [
      { name: 'Cut & Blow Dry', duration: 60, price: '35.00', description: 'Haircut with styling' },
      { name: 'Full Colour', duration: 180, price: '85.00', description: 'Complete hair colouring service' },
      { name: 'Highlights', duration: 120, price: '65.00', description: 'Hair highlighting treatment' },
      { name: 'Manicure', duration: 45, price: '25.00', description: 'Hand and nail care' },
      { name: 'Pedicure', duration: 60, price: '30.00', description: 'Foot and nail care' },
      { name: 'Massage Therapy', duration: 60, price: '45.00', description: 'Relaxing full body massage' }
    ],
    driving: [
      { name: 'Standard Lesson', duration: 60, price: '28.00', description: '1-hour driving lesson' },
      { name: 'Intensive Lesson', duration: 120, price: '50.00', description: '2-hour intensive session' },
      { name: 'Mock Test', duration: 90, price: '35.00', description: 'Practice driving test' },
      { name: 'Theory Preparation', duration: 60, price: '25.00', description: 'Theory test preparation' },
      { name: 'Motorway Lesson', duration: 90, price: '40.00', description: 'Motorway driving instruction' },
      { name: 'Pass Plus Course', duration: 360, price: '180.00', description: 'Advanced driving course' }
    ],
    other: [
      { name: 'Consultation', duration: 60, price: '50.00', description: 'Initial consultation meeting' },
      { name: 'Standard Session', duration: 90, price: '75.00', description: 'Regular service session' },
      { name: 'Extended Session', duration: 120, price: '95.00', description: 'Extended service session' },
      { name: 'Assessment', duration: 45, price: '40.00', description: 'Service assessment' }
    ]
  };

  const templates = serviceTemplates?.[businessType] || serviceTemplates?.other;

  useEffect(() => {
    if (services?.length === 0) {
      // Auto-select first 3 templates by default
      const defaultServices = templates?.slice(0, 3)?.map((template, index) => ({
        id: `template-${index}`,
        ...template,
        selected: true
      }));
      onServicesChange(defaultServices);
    }
  }, [businessType]);

  const toggleService = (templateIndex) => {
    const template = templates?.[templateIndex];
    const existingIndex = services?.findIndex(s => s?.name === template?.name);
    
    if (existingIndex >= 0) {
      // Remove service
      const updatedServices = services?.filter((_, index) => index !== existingIndex);
      onServicesChange(updatedServices);
    } else {
      // Add service
      const newService = {
        id: `template-${Date.now()}`,
        ...template,
        selected: true
      };
      onServicesChange([...services, newService]);
    }
  };

  const updateServicePrice = (serviceIndex, newPrice) => {
    const updatedServices = services?.map((service, index) => 
      index === serviceIndex ? { ...service, price: newPrice } : service
    );
    onServicesChange(updatedServices);
  };

  const updateServiceDuration = (serviceIndex, newDuration) => {
    const updatedServices = services?.map((service, index) => 
      index === serviceIndex ? { ...service, duration: parseInt(newDuration) } : service
    );
    onServicesChange(updatedServices);
  };

  const addCustomService = () => {
    if (customService?.name && customService?.price) {
      const newService = {
        id: `custom-${Date.now()}`,
        name: customService?.name,
        duration: parseInt(customService?.duration),
        price: customService?.price,
        description: 'Custom service',
        selected: true
      };
      onServicesChange([...services, newService]);
      setCustomService({ name: '', duration: 60, price: '' });
    }
  };

  const removeService = (serviceIndex) => {
    const updatedServices = services?.filter((_, index) => index !== serviceIndex);
    onServicesChange(updatedServices);
  };

  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Set Up Your Services</h3>
        <p className="text-sm text-muted-foreground">Choose from common services for your industry or add your own. You can adjust prices and durations.</p>
      </div>
      {/* Template Services */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Recommended Services</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates?.map((template, index) => {
            const isSelected = services?.some(s => s?.name === template?.name);
            return (
              <div
                key={index}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-subtle' 
                    : 'border-border bg-card hover:border-primary/30'
                  }
                `}
                onClick={() => toggleService(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {template?.name}
                      </h5>
                      {isSelected && (
                        <Icon name="Check" size={16} className="text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{template?.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        <Icon name="Clock" size={14} className="inline mr-1" />
                        {formatDuration(template?.duration)}
                      </span>
                      <span className="font-medium text-foreground">£{template?.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Selected Services Configuration */}
      {services?.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Your Selected Services</h4>
          <div className="space-y-3">
            {services?.map((service, index) => (
              <div key={service?.id} className="p-4 bg-muted rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-foreground">{service?.name}</h5>
                    <p className="text-sm text-muted-foreground">{service?.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeService(index)}
                    className="text-muted-foreground hover:text-error"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Duration (minutes)"
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    value={service?.duration}
                    onChange={(e) => updateServiceDuration(index, e?.target?.value)}
                  />
                  <Input
                    label="Price (£)"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={service?.price}
                    onChange={(e) => updateServicePrice(index, e?.target?.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Add Custom Service */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Add Custom Service</h4>
        <div className="p-4 bg-muted rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="Service Name"
              type="text"
              placeholder="e.g., Emergency Repair"
              value={customService?.name}
              onChange={(e) => setCustomService({...customService, name: e?.target?.value})}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              min="15"
              max="480"
              step="15"
              value={customService?.duration}
              onChange={(e) => setCustomService({...customService, duration: e?.target?.value})}
            />
            <Input
              label="Price (£)"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={customService?.price}
              onChange={(e) => setCustomService({...customService, price: e?.target?.value})}
            />
          </div>
          <Button
            variant="outline"
            onClick={addCustomService}
            disabled={!customService?.name || !customService?.price}
            iconName="Plus"
            iconPosition="left"
          >
            Add Service
          </Button>
        </div>
      </div>
      {errors?.services && (
        <p className="text-sm text-error">{errors?.services}</p>
      )}
    </div>
  );
};

export default ServiceTemplateSetup;
