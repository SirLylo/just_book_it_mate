import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AppointmentCard = ({ appointment, onCall, onMessage, onReschedule, onCancel }) => {
  const statusColors = {
    confirmed: 'border-l-success bg-success/5',
    pending: 'border-l-warning bg-warning/5',
    cancelled: 'border-l-error bg-error/5',
    completed: 'border-l-muted bg-muted/20'
  };

  const statusIcons = {
    confirmed: 'CheckCircle',
    pending: 'Clock',
    cancelled: 'XCircle',
    completed: 'Check'
  };

  return (
    <div className={`bg-card rounded-lg border-l-4 ${statusColors?.[appointment?.status]} p-4 shadow-subtle mb-3`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-foreground">{appointment?.customerName}</h4>
            <Icon name={statusIcons?.[appointment?.status]} size={16} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">{appointment?.service}</p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>{appointment?.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Timer" size={12} />
              <span>{appointment?.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Pound" size={12} />
              <span>{appointment?.price}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCall(appointment)}
            className="h-8 w-8"
          >
            <Icon name="Phone" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMessage(appointment)}
            className="h-8 w-8"
          >
            <Icon name="MessageCircle" size={14} />
          </Button>
        </div>
      </div>
      {appointment?.status === 'pending' && (
        <div className="flex items-center space-x-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReschedule(appointment)}
            iconName="Calendar"
            iconPosition="left"
            iconSize={14}
          >
            Reschedule
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onCancel(appointment)}
            iconName="X"
            iconPosition="left"
            iconSize={14}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
