import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AppointmentCard = ({ 
  appointment, 
  onEdit, 
  onCancel, 
  onAddNote,
  viewMode = 'week',
  isDragging = false 
}) => {
  const [showActions, setShowActions] = React.useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-primary border-primary/20';
      case 'pending': return 'bg-warning border-warning/20';
      case 'cancelled': return 'bg-error border-error/20';
      case 'completed': return 'bg-success border-success/20';
      default: return 'bg-secondary border-secondary/20';
    }
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`)?.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };

  return (
    <div
      className={`
        relative group rounded-lg border-2 p-3 transition-all duration-200
        ${getStatusColor(appointment?.status)}
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${viewMode === 'month' ? 'text-xs' : 'text-sm'}
        cursor-pointer hover:shadow-moderate
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onContextMenu={(e) => {
        e?.preventDefault();
        setShowActions(!showActions);
      }}
    >
      {/* Appointment Content */}
      <div className="space-y-1">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white truncate">
              {appointment?.customerName}
            </div>
            <div className="text-white/80 text-xs truncate">
              {appointment?.service}
            </div>
          </div>
          
          {appointment?.status === 'pending' && (
            <Icon name="Clock" size={12} className="text-white/60 flex-shrink-0 ml-1" />
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-white/70">
          <span>{formatTime(appointment?.startTime)} - {formatTime(appointment?.endTime)}</span>
          <span>£{appointment?.price}</span>
        </div>

        {viewMode !== 'month' && appointment?.notes && (
          <div className="text-xs text-white/60 truncate">
            <Icon name="MessageSquare" size={10} className="inline mr-1" />
            {appointment?.notes}
          </div>
        )}
      </div>
      {/* Quick Actions */}
      {showActions && (
        <div className="absolute top-1 right-1 flex items-center space-x-1 bg-black/20 rounded-md p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              onEdit(appointment);
            }}
            className="h-6 w-6 text-white hover:bg-white/20"
          >
            <Icon name="Edit" size={12} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              onAddNote(appointment);
            }}
            className="h-6 w-6 text-white hover:bg-white/20"
          >
            <Icon name="MessageSquare" size={12} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              onCancel(appointment);
            }}
            className="h-6 w-6 text-white hover:bg-white/20"
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
      )}
      {/* Drag Handle */}
      <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default AppointmentCard;
