import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimeSlotSelection = ({ 
  timeSlots, 
  selectedTime, 
  onTimeSelect, 
  selectedDate,
  serviceDuration = 60 
}) => {
  if (!selectedDate) {
    return (
      <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Clock" size={20} className="mr-2 text-primary" />
          Select Time
        </h2>
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Please select a date first to view available times</p>
        </div>
      </div>
    );
  }

  const formatTime = (time) => {
    const [hours, minutes] = time?.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime?.split(':');
    const startDate = new Date();
    startDate?.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const endDate = new Date(startDate.getTime() + serviceDuration * 60000);
    const endHours = endDate?.getHours()?.toString()?.padStart(2, '0');
    const endMinutes = endDate?.getMinutes()?.toString()?.padStart(2, '0');
    return `${endHours}:${endMinutes}`;
  };

  const groupTimeSlotsByPeriod = () => {
    const morning = [];
    const afternoon = [];
    const evening = [];

    timeSlots?.forEach(slot => {
      const hour = parseInt(slot?.time?.split(':')?.[0]);
      if (hour < 12) {
        morning?.push(slot);
      } else if (hour < 17) {
        afternoon?.push(slot);
      } else {
        evening?.push(slot);
      }
    });

    return { morning, afternoon, evening };
  };

  const { morning, afternoon, evening } = groupTimeSlotsByPeriod();

  const renderTimeSlotGroup = (slots, title, icon) => {
    if (slots?.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <Icon name={icon} size={16} className="mr-2 text-primary" />
          {title}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {slots?.map((slot) => (
            <Button
              key={slot?.time}
              variant={selectedTime === slot?.time ? "default" : "outline"}
              onClick={() => onTimeSelect(slot?.time)}
              disabled={!slot?.available}
              className="h-auto p-3 flex flex-col items-center space-y-1"
            >
              <span className="font-semibold">{formatTime(slot?.time)}</span>
              <span className="text-xs opacity-75">
                {formatTime(calculateEndTime(slot?.time))}
              </span>
              <span className="text-xs opacity-60">
                {serviceDuration} mins
              </span>
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="Clock" size={20} className="mr-2 text-primary" />
        Select Time
      </h2>
      <div className="mb-4 p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Selected date: <span className="font-medium text-foreground">
            {new Date(selectedDate + 'T00:00:00')?.toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </p>
      </div>
      {timeSlots?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Clock" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">No available times for this date</p>
          <p className="text-sm text-muted-foreground">Please select a different date</p>
        </div>
      ) : (
        <div>
          {renderTimeSlotGroup(morning, 'Morning', 'Sunrise')}
          {renderTimeSlotGroup(afternoon, 'Afternoon', 'Sun')}
          {renderTimeSlotGroup(evening, 'Evening', 'Sunset')}
        </div>
      )}
      {timeSlots?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span>Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded border-2 border-border bg-card" />
                <span>Available</span>
              </div>
            </div>
            <span>All times in GMT</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelection;
