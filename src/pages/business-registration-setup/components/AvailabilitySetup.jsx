import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AvailabilitySetup = ({ availability, onAvailabilityChange, errors }) => {
  const [selectedDay, setSelectedDay] = useState(null);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    timeSlots?.push({
      value: `${hour?.toString()?.padStart(2, '0')}:00`,
      label: `${hour?.toString()?.padStart(2, '0')}:00`,
      hour
    });
    if (hour < 22) {
      timeSlots?.push({
        value: `${hour?.toString()?.padStart(2, '0')}:30`,
        label: `${hour?.toString()?.padStart(2, '0')}:30`,
        hour: hour + 0.5
      });
    }
  }

  const defaultAvailability = {
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '09:00', end: '17:00' },
    sunday: { enabled: false, start: '09:00', end: '17:00' }
  };

  const currentAvailability = { ...defaultAvailability, ...availability };

  const toggleDay = (dayKey) => {
    const updatedAvailability = {
      ...currentAvailability,
      [dayKey]: {
        ...currentAvailability?.[dayKey],
        enabled: !currentAvailability?.[dayKey]?.enabled
      }
    };
    onAvailabilityChange(updatedAvailability);
  };

  const updateDayTime = (dayKey, field, value) => {
    const updatedAvailability = {
      ...currentAvailability,
      [dayKey]: {
        ...currentAvailability?.[dayKey],
        [field]: value
      }
    };
    onAvailabilityChange(updatedAvailability);
  };

  const applyToAllDays = () => {
    if (selectedDay && currentAvailability?.[selectedDay]) {
      let template = currentAvailability?.[selectedDay];
      const updatedAvailability = {};
      
      daysOfWeek?.forEach(day => {
        updatedAvailability[day.key] = {
          enabled: template?.enabled,
          start: template?.start,
          end: template?.end
        };
      });
      
      onAvailabilityChange(updatedAvailability);
    }
  };

  const setBusinessHours = (preset) => {
    let template;
    switch (preset) {
      case 'standard':
        template = { enabled: true, start: '09:00', end: '17:00' };
        break;
      case 'extended':
        template = { enabled: true, start: '08:00', end: '18:00' };
        break;
      case 'evening':
        template = { enabled: true, start: '12:00', end: '20:00' };
        break;
      default:
        return;
    }

    const updatedAvailability = {};
    daysOfWeek?.forEach(day => {
      if (day?.key === 'saturday' || day?.key === 'sunday') {
        updatedAvailability[day.key] = { ...template, enabled: false };
      } else {
        updatedAvailability[day.key] = { ...template };
      }
    });

    onAvailabilityChange(updatedAvailability);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Set Your Availability</h3>
        <p className="text-sm text-muted-foreground">Choose when customers can book appointments with you. You can adjust this later.</p>
      </div>
      {/* Quick Presets */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Quick Setup</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBusinessHours('standard')}
          >
            Standard Hours (9-5)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBusinessHours('extended')}
          >
            Extended Hours (8-6)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBusinessHours('evening')}
          >
            Evening Hours (12-8)
          </Button>
        </div>
      </div>
      {/* Weekly Schedule */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Weekly Schedule</h4>
        
        <div className="space-y-3">
          {daysOfWeek?.map((day) => {
            const dayAvailability = currentAvailability?.[day?.key];
            const isSelected = selectedDay === day?.key;
            
            return (
              <div
                key={day?.key}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200
                  ${dayAvailability?.enabled 
                    ? 'border-primary/20 bg-primary/5' :'border-border bg-muted/50'
                  }
                  ${isSelected ? 'ring-2 ring-primary/30' : ''}
                `}
                onClick={() => setSelectedDay(day?.key)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        toggleDay(day?.key);
                      }}
                      className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                        ${dayAvailability?.enabled 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : 'border-border bg-background'
                        }
                      `}
                    >
                      {dayAvailability?.enabled && (
                        <Icon name="Check" size={12} />
                      )}
                    </button>
                    
                    <div>
                      <span className={`font-medium ${dayAvailability?.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {day?.label}
                      </span>
                      <span className="hidden sm:inline text-sm text-muted-foreground ml-2">
                        ({day?.short})
                      </span>
                    </div>
                  </div>

                  {dayAvailability?.enabled && (
                    <div className="flex items-center space-x-2">
                      <select
                        value={dayAvailability?.start}
                        onChange={(e) => updateDayTime(day?.key, 'start', e?.target?.value)}
                        className="px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                        onClick={(e) => e?.stopPropagation()}
                      >
                        {timeSlots?.map((slot) => (
                          <option key={slot?.value} value={slot?.value}>
                            {slot?.label}
                          </option>
                        ))}
                      </select>
                      
                      <span className="text-muted-foreground">to</span>
                      
                      <select
                        value={dayAvailability?.end}
                        onChange={(e) => updateDayTime(day?.key, 'end', e?.target?.value)}
                        className="px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                        onClick={(e) => e?.stopPropagation()}
                      >
                        {timeSlots?.map((slot) => (
                          <option key={slot?.value} value={slot?.value}>
                            {slot?.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {!dayAvailability?.enabled && (
                    <span className="text-sm text-muted-foreground">Closed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedDay && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={applyToAllDays}
              iconName="Copy"
              iconPosition="left"
            >
              Apply {daysOfWeek?.find(d => d?.key === selectedDay)?.label} to All Days
            </Button>
          </div>
        )}
      </div>
      {/* Summary */}
      <div className="p-4 bg-muted rounded-lg">
        <h5 className="font-medium text-foreground mb-2">Availability Summary</h5>
        <div className="text-sm text-muted-foreground space-y-1">
          {daysOfWeek?.map((day) => {
            const dayAvailability = currentAvailability?.[day?.key];
            return (
              <div key={day?.key} className="flex justify-between">
                <span>{day?.label}:</span>
                <span>
                  {dayAvailability?.enabled 
                    ? `${dayAvailability?.start} - ${dayAvailability?.end}`
                    : 'Closed'
                  }
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {errors?.availability && (
        <p className="text-sm text-error">{errors?.availability}</p>
      )}
    </div>
  );
};

export default AvailabilitySetup;
