import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkPricingModal = ({ 
  isOpen, 
  onClose, 
  onApply, 
  services = [],
  categories = []
}) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [updateType, setUpdateType] = useState('percentage');
  const [percentageChange, setPercentageChange] = useState(0);
  const [fixedAmount, setFixedAmount] = useState(0);
  const [filterCategory, setFilterCategory] = useState('');
  const [previewChanges, setPreviewChanges] = useState(false);

  const updateTypeOptions = [
    { value: 'percentage', label: 'Percentage Change' },
    { value: 'fixed', label: 'Fixed Amount Change' },
    { value: 'set', label: 'Set Fixed Price' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories?.map(cat => ({ value: cat, label: cat }))
  ];

  const filteredServices = filterCategory 
    ? services?.filter(service => service?.category === filterCategory)
    : services;

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => 
      prev?.includes(serviceId)
        ? prev?.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedServices?.length === filteredServices?.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filteredServices?.map(service => service?.id));
    }
  };

  const calculateNewPrice = (currentPrice) => {
    switch (updateType) {
      case 'percentage':
        return currentPrice * (1 + percentageChange / 100);
      case 'fixed':
        return currentPrice + fixedAmount;
      case 'set':
        return fixedAmount;
      default:
        return currentPrice;
    }
  };

  const getPreviewData = () => {
    return services?.filter(service => selectedServices?.includes(service?.id))?.map(service => ({
        ...service,
        newPrice: calculateNewPrice(service?.price)
      }));
  };

  const handleApply = () => {
    const updates = getPreviewData()?.map(service => ({
      id: service?.id,
      price: Math.max(0.01, service?.newPrice) // Ensure minimum price
    }));
    
    onApply(updates);
    onClose();
  };

  const resetForm = () => {
    setSelectedServices([]);
    setUpdateType('percentage');
    setPercentageChange(0);
    setFixedAmount(0);
    setFilterCategory('');
    setPreviewChanges(false);
  };

  if (!isOpen) return null;

  const previewData = previewChanges ? getPreviewData() : [];
  const totalRevenue = previewData?.reduce((sum, service) => 
    sum + (service?.newPrice * service?.bookingCount), 0
  );
  const currentRevenue = services?.filter(service => selectedServices?.includes(service?.id))?.reduce((sum, service) => sum + (service?.price * service?.bookingCount), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-floating w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Bulk Pricing Update</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update prices for multiple services at once
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Left Panel - Service Selection */}
          <div className="w-1/2 border-r border-border p-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Filter Controls */}
              <div className="flex items-center justify-between">
                <Select
                  label="Filter by Category"
                  options={categoryOptions}
                  value={filterCategory}
                  onChange={setFilterCategory}
                  className="flex-1 mr-4"
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="mt-6"
                >
                  {selectedServices?.length === filteredServices?.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              {/* Service List */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Select Services ({selectedServices?.length} selected)
                </h3>
                
                {filteredServices?.map((service) => (
                  <div
                    key={service?.id}
                    className={`p-3 rounded-lg border transition-micro cursor-pointer ${
                      selectedServices?.includes(service?.id)
                        ? 'border-primary bg-primary/5' :'border-border hover:bg-muted'
                    }`}
                    onClick={() => handleServiceToggle(service?.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedServices?.includes(service?.id)}
                        onChange={() => handleServiceToggle(service?.id)}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">{service?.name}</h4>
                          <span className="text-sm font-medium text-foreground">
                            £{service?.price?.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>{service?.category}</span>
                          <span>{service?.duration}min</span>
                          <span>{service?.bookingCount} bookings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Pricing Configuration */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Update Type */}
              <Select
                label="Update Type"
                options={updateTypeOptions}
                value={updateType}
                onChange={setUpdateType}
              />

              {/* Update Value */}
              {updateType === 'percentage' && (
                <Input
                  label="Percentage Change (%)"
                  type="number"
                  value={percentageChange}
                  onChange={(e) => setPercentageChange(parseFloat(e?.target?.value) || 0)}
                  step="0.1"
                  description="Positive for increase, negative for decrease"
                />
              )}

              {updateType === 'fixed' && (
                <Input
                  label="Amount Change (£)"
                  type="number"
                  value={fixedAmount}
                  onChange={(e) => setFixedAmount(parseFloat(e?.target?.value) || 0)}
                  step="0.01"
                  description="Positive to add, negative to subtract"
                />
              )}

              {updateType === 'set' && (
                <Input
                  label="New Price (£)"
                  type="number"
                  value={fixedAmount}
                  onChange={(e) => setFixedAmount(parseFloat(e?.target?.value) || 0)}
                  step="0.01"
                  min="0.01"
                  description="Set all selected services to this price"
                />
              )}

              {/* Preview Toggle */}
              <div className="pt-4 border-t border-border">
                <Checkbox
                  label="Show Preview"
                  description="Preview changes before applying"
                  checked={previewChanges}
                  onChange={(e) => setPreviewChanges(e?.target?.checked)}
                />
              </div>

              {/* Preview Results */}
              {previewChanges && selectedServices?.length > 0 && (
                <div className="bg-muted rounded-lg p-4 space-y-4">
                  <h3 className="font-medium text-foreground">Preview Changes</h3>
                  
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Services Updated</p>
                      <p className="font-medium text-foreground">{selectedServices?.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue Impact</p>
                      <p className={`font-medium ${
                        totalRevenue > currentRevenue ? 'text-success' : 
                        totalRevenue < currentRevenue ? 'text-error' : 'text-foreground'
                      }`}>
                        {totalRevenue > currentRevenue ? '+' : ''}
                        £{(totalRevenue - currentRevenue)?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Individual Changes */}
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {previewData?.slice(0, 5)?.map((service) => (
                      <div key={service?.id} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{service?.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">£{service?.price?.toFixed(2)}</span>
                          <Icon name="ArrowRight" size={12} />
                          <span className="font-medium text-foreground">
                            £{service?.newPrice?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {previewData?.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{previewData?.length - 5} more services
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleApply}
              disabled={selectedServices?.length === 0}
            >
              Apply Changes ({selectedServices?.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkPricingModal;
