import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MiniCalendar = ({ currentDate, onDateSelect, appointments = [] }) => {
  const today = new Date();
  const [displayMonth, setDisplayMonth] = React.useState(new Date(currentDate));

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const hasAppointments = (date) => {
    if (!date) return false;
    return appointments?.some(apt => {
      const aptDate = new Date(apt.date);
      return aptDate?.toDateString() === date?.toDateString();
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    return date?.toDateString() === today?.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date?.toDateString() === currentDate?.toDateString();
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(displayMonth);
    newMonth?.setMonth(newMonth?.getMonth() + direction);
    setDisplayMonth(newMonth);
  };

  const days = getDaysInMonth(displayMonth);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Mini Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">
          {displayMonth?.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(-1)}
            className="h-6 w-6"
          >
            <Icon name="ChevronLeft" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(1)}
            className="h-6 w-6"
          >
            <Icon name="ChevronRight" size={12} />
          </Button>
        </div>
      </div>
      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays?.map((day) => (
          <div key={day} className="text-xs text-muted-foreground text-center p-1">
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days?.map((date, index) => (
          <button
            key={index}
            onClick={() => date && onDateSelect(date)}
            disabled={!date}
            className={`
              h-8 w-8 text-xs rounded-md transition-micro relative
              ${!date ? 'invisible' : ''}
              ${isSelected(date) ? 'bg-primary text-primary-foreground' : ''}
              ${isToday(date) && !isSelected(date) ? 'bg-accent text-accent-foreground' : ''}
              ${!isSelected(date) && !isToday(date) ? 'hover:bg-secondary text-foreground' : ''}
            `}
          >
            {date?.getDate()}
            {hasAppointments(date) && (
              <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
