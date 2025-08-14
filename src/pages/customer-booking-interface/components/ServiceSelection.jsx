import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ServiceSelection = ({ services, selectedService, onServiceChange }) => {
  const serviceOptions = services?.map(service => ({
    value: service?.id,
    label: `${service?.name} - £${service?.price?.toFixed(2)}`,
    description: `${service?.duration} mins • ${service?.description}`
  }));

  const selectedServiceDetails = services?.find(s => s?.id === selectedService);

  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="Settings" size={20} className="mr-2 text-primary" />
        Select Service
      </h2>
      <Select
        label="Choose your service"
        placeholder="Select a service..."
        options={serviceOptions}
        value={selectedService}
        onChange={onServiceChange}
        searchable
        className="mb-4"
      />
      {selectedServiceDetails && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">{selectedServiceDetails?.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedServiceDetails?.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">£{selectedServiceDetails?.price?.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">per session</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground">{selectedServiceDetails?.duration} minutes</span>
              </div>
              
              {selectedServiceDetails?.category && (
                <div className="flex items-center space-x-1">
                  <Icon name="Tag" size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{selectedServiceDetails?.category}</span>
                </div>
              )}
            </div>

            {selectedServiceDetails?.popular && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                <Icon name="Star" size={12} className="mr-1" />
                Popular
              </span>
            )}
          </div>

          {selectedServiceDetails?.includes && selectedServiceDetails?.includes?.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs font-medium text-foreground mb-2">What's included:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {selectedServiceDetails?.includes?.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Icon name="Check" size={12} className="text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
