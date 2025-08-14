import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAddAppointment, onBlockTime, onViewCalendar, onManageServices }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-subtle">
      <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="default"
          onClick={onAddAppointment}
          iconName="Plus"
          iconPosition="left"
          fullWidth
        >
          Add Appointment
        </Button>
        
        <Button
          variant="outline"
          onClick={onBlockTime}
          iconName="Ban"
          iconPosition="left"
          fullWidth
        >
          Block Time
        </Button>
        
        <Button
          variant="secondary"
          onClick={onViewCalendar}
          iconName="Calendar"
          iconPosition="left"
          fullWidth
        >
          View Calendar
        </Button>
        
        <Button
          variant="ghost"
          onClick={onManageServices}
          iconName="Settings"
          iconPosition="left"
          fullWidth
        >
          Manage Services
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
