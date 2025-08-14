import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ServiceCard = ({ 
  service, 
  onEdit, 
  onDelete, 
  onToggleActive,
  onDuplicate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrice, setEditedPrice] = useState(service?.price);

  const handleSavePrice = () => {
    onEdit(service?.id, { price: parseFloat(editedPrice) });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedPrice(service?.price);
    setIsEditing(false);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 shadow-subtle transition-all duration-200 ${
      !service?.isActive ? 'opacity-60' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-foreground">{service?.name}</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              service?.isActive 
                ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
            }`}>
              {service?.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{service?.description}</p>
        </div>
        
        <div className="flex items-center space-x-1 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleActive(service?.id)}
            title={service?.isActive ? 'Deactivate service' : 'Activate service'}
          >
            <Icon name={service?.isActive ? "Eye" : "EyeOff"} size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDuplicate(service?.id)}
            title="Duplicate service"
          >
            <Icon name="Copy" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(service?.id)}
            title="Delete service"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
      {/* Service Details */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Duration</p>
          <p className="text-sm font-medium text-foreground">{formatDuration(service?.duration)}</p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-1">Price</p>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e?.target?.value)}
                className="w-20 h-8 text-sm"
                step="0.01"
                min="0"
              />
              <Button variant="ghost" size="xs" onClick={handleSavePrice}>
                <Icon name="Check" size={14} />
              </Button>
              <Button variant="ghost" size="xs" onClick={handleCancelEdit}>
                <Icon name="X" size={14} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-foreground">£{service?.price?.toFixed(2)}</p>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setIsEditing(true)}
                title="Edit price"
              >
                <Icon name="Edit2" size={12} />
              </Button>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-1">Category</p>
          <p className="text-sm font-medium text-foreground">{service?.category}</p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-1">Bookings (30d)</p>
          <p className="text-sm font-medium text-foreground">{service?.bookingCount}</p>
        </div>
      </div>
      {/* Revenue & Performance */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>Revenue: £{(service?.price * service?.bookingCount)?.toFixed(2)}</span>
          <span>Buffer: {service?.bufferTime}min</span>
          <span>Max/day: {service?.maxDailyBookings}</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(service?.id, service)}
        >
          <Icon name="Settings" size={14} className="mr-2" />
          Configure
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
