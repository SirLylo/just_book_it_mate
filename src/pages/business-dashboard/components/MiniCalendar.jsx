import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MiniCalendar = ({ bookingData, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)?.getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)?.getDay();
  };

  const getBookingDensity = (day) => {
    const dateKey = `${currentDate?.getFullYear()}-${String(currentDate?.getMonth() + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
    const bookings = bookingData?.[dateKey] || 0;
    
    if (bookings === 0) return 'bg-muted';
    if (bookings <= 2) return 'bg-success/30';
    if (bookings <= 4) return 'bg-warning/30';
    return 'bg-error/30';
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate?.setMonth(currentDate?.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (day) => {
    const today = new Date();
    return today?.getDate() === day && 
           today?.getMonth() === currentDate?.getMonth() && 
           today?.getFullYear() === currentDate?.getFullYear();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return selectedDate?.getDate() === day && 
           selectedDate?.getMonth() === currentDate?.getMonth() && 
           selectedDate?.getFullYear() === currentDate?.getFullYear();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days?.push(<div key={`empty-${i}`} className="h-8"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days?.push(
      <button
        key={day}
        onClick={() => onDateSelect && onDateSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        className={`
          h-8 w-8 rounded-md text-sm font-medium transition-micro relative
          ${isToday(day) ? 'ring-2 ring-primary' : ''}
          ${isSelected(day) ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/20'}
          ${getBookingDensity(day)}
        `}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">
          {monthNames?.[currentDate?.getMonth()]} {currentDate?.getFullYear()}
        </h3>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(-1)}
            className="h-8 w-8"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(1)}
            className="h-8 w-8"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S']?.map((day, index) => (
          <div key={index} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-success/30"></div>
            <span>Light</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-warning/30"></div>
            <span>Busy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-error/30"></div>
            <span>Full</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
