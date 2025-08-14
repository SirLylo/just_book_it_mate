import React from 'react';

const AvailabilityLegend = () => {
  const legendItems = [
    {
      color: 'bg-success',
      label: 'Available',
      description: 'Open time slots'
    },
    {
      color: 'bg-primary',
      label: 'Booked',
      description: 'Confirmed appointments'
    },
    {
      color: 'bg-warning',
      label: 'Pending',
      description: 'Awaiting confirmation'
    },
    {
      color: 'bg-error',
      label: 'Blocked',
      description: 'Unavailable periods'
    },
    {
      color: 'bg-secondary',
      label: 'Break',
      description: 'Lunch & personal time'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-medium text-foreground mb-3">Availability Legend</h3>
      <div className="space-y-2">
        {legendItems?.map((item) => (
          <div key={item?.label} className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-sm ${item?.color}`} />
            <div className="flex-1">
              <div className="text-xs font-medium text-foreground">{item?.label}</div>
              <div className="text-xs text-muted-foreground">{item?.description}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Quick Stats */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">Today's Summary</div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Appointments</span>
            <span className="text-foreground font-medium">8</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Available Slots</span>
            <span className="text-foreground font-medium">4</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Revenue</span>
            <span className="text-foreground font-medium">£420</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityLegend;
