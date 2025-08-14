import React, { useState } from 'react';
import AppointmentCard from './AppointmentCard';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const WeekView = ({ 
  currentDate, 
  appointments = [], 
  onAppointmentEdit,
  onAppointmentCancel,
  onAppointmentNote,
  onTimeSlotClick,
  businessHours = { start: '09:00', end: '17:00' }
}) => {
  const [draggedAppointment, setDraggedAppointment] = React.useState(null);

  // Generate week days
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek?.getDay();
    const diff = startOfWeek?.getDate() - day;
    startOfWeek?.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date?.setDate(startOfWeek?.getDate() + i);
      days?.push(date);
    }
    return days;
  };

  // Generate time slots (30-minute intervals)
  const getTimeSlots = () => {
    const slots = [];
    const start = parseInt(businessHours?.start?.split(':')?.[0]);
    const end = parseInt(businessHours?.end?.split(':')?.[0]);
    
    for (let hour = start; hour <= end; hour++) {
      slots?.push(`${hour?.toString()?.padStart(2, '0')}:00`);
      if (hour < end) {
        slots?.push(`${hour?.toString()?.padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const weekDays = getWeekDays();
  const timeSlots = getTimeSlots();

  const getAppointmentsForDay = (date) => {
    return appointments?.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate?.toDateString() === date?.toDateString();
    });
  };

  const getAppointmentPosition = (appointment) => {
    const startHour = parseInt(appointment?.startTime?.split(':')?.[0]);
    const startMinute = parseInt(appointment?.startTime?.split(':')?.[1]);
    const endHour = parseInt(appointment?.endTime?.split(':')?.[0]);
    const endMinute = parseInt(appointment?.endTime?.split(':')?.[1]);
    
    const businessStartHour = parseInt(businessHours?.start?.split(':')?.[0]);
    
    const startSlot = ((startHour - businessStartHour) * 2) + (startMinute >= 30 ? 1 : 0);
    const duration = ((endHour - startHour) * 2) + ((endMinute - startMinute) / 30);
    
    return { top: startSlot * 60, height: duration * 60 };
  };

  const handleDragStart = (e, appointment) => {
    setDraggedAppointment(appointment);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, date, timeSlot) => {
    e?.preventDefault();
    if (draggedAppointment) {
      // Handle appointment rescheduling logic here
      console.log('Reschedule appointment:', draggedAppointment?.id, 'to', date, timeSlot);
      setDraggedAppointment(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Week Header */}
      <div className="grid grid-cols-8 border-b border-border">
        <div className="p-4 bg-muted">
          <div className="text-sm font-medium text-muted-foreground">Time</div>
        </div>
        {weekDays?.map((day) => (
          <div key={day?.toISOString()} className="p-4 text-center border-l border-border">
            <div className="text-sm font-medium text-foreground">
              {day?.toLocaleDateString('en-GB', { weekday: 'short' })}
            </div>
            <div className="text-lg font-semibold text-foreground mt-1">
              {day?.getDate()}
            </div>
            <div className="text-xs text-muted-foreground">
              {day?.toLocaleDateString('en-GB', { month: 'short' })}
            </div>
          </div>
        ))}
      </div>
      {/* Time Grid */}
      <div className="relative overflow-auto max-h-[600px]">
        <div className="grid grid-cols-8">
          {/* Time Column */}
          <div className="bg-muted/50">
            {timeSlots?.map((time) => (
              <div key={time} className="h-[60px] p-2 border-b border-border flex items-start">
                <span className="text-xs text-muted-foreground">{time}</span>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays?.map((day) => (
            <div key={day?.toISOString()} className="relative border-l border-border">
              {/* Time Slots */}
              {timeSlots?.map((time, index) => (
                <div
                  key={time}
                  className="h-[60px] border-b border-border hover:bg-secondary/20 cursor-pointer transition-micro"
                  onClick={() => onTimeSlotClick(day, time)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day, time)}
                >
                  {/* Slot content */}
                </div>
              ))}

              {/* Appointments */}
              <div className="absolute inset-0 pointer-events-none">
                {getAppointmentsForDay(day)?.map((appointment) => {
                  const position = getAppointmentPosition(appointment);
                  return (
                    <div
                      key={appointment?.id}
                      className="absolute left-1 right-1 pointer-events-auto"
                      style={{
                        top: `${position?.top}px`,
                        height: `${position?.height}px`
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, appointment)}
                    >
                      <AppointmentCard
                        appointment={appointment}
                        onEdit={onAppointmentEdit}
                        onCancel={onAppointmentCancel}
                        onAddNote={onAppointmentNote}
                        viewMode="week"
                        isDragging={draggedAppointment?.id === appointment?.id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Add Button */}
      <div className="absolute bottom-4 right-4">
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-floating"
          onClick={() => onTimeSlotClick(new Date(), '09:00')}
        >
          <Icon name="Plus" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default WeekView;
