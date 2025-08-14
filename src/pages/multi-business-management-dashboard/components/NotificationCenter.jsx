import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = ({
  notifications = [],
  userTier = "Basic",
  className
}) => {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const isProfessionalTier = userTier === "Professional";

  const filterOptions = [
    { id: 'all', label: 'All', count: notifications?.length },
    { id: 'unread', label: 'Unread', count: notifications?.filter(n => !n?.read)?.length },
    { id: 'high', label: 'Priority', count: notifications?.filter(n => n?.priority === 'high')?.length }
  ];

  const getNotificationIcon = (type) => {
    const iconMap = {
      booking: 'Calendar',
      payment: 'CreditCard',
      review: 'Star',
      message: 'MessageSquare',
      cancellation: 'XCircle',
      reminder: 'Bell'
    };
    return iconMap?.[type] || 'Bell';
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: 'text-error',
      normal: 'text-foreground',
      low: 'text-muted-foreground'
    };
    return colorMap?.[priority] || 'text-foreground';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return timestamp?.toLocaleDateString();
  };

  const filteredNotifications = notifications?.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification?.read;
      case 'high':
        return notification?.priority === 'high';
      default:
        return true;
    }
  });

  const handleNotificationClick = (notification) => {
    setExpandedId(expandedId === notification?.id ? null : notification?.id);
  };

  const handleMarkAsRead = (notificationId, event) => {
    event?.stopPropagation();
    // Handle mark as read logic
    console.log('Mark as read:', notificationId);
  };

  const handleMarkAllAsRead = () => {
    // Handle mark all as read logic
    console.log('Mark all as read');
  };

  return (
    <div className={cn("bg-card rounded-lg border border-border p-6 shadow-subtle", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          {isProfessionalTier && (
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md font-medium">
              Pro
            </span>
          )}
        </div>
        
        {notifications?.filter(n => !n?.read)?.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            iconName="CheckCheck"
            iconPosition="left"
          >
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 mb-4 bg-muted rounded-lg p-1">
        {filterOptions?.map((option) => (
          <Button
            key={option?.id}
            variant={filter === option?.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(option?.id)}
            className="flex-1"
          >
            {option?.label}
            {option?.count > 0 && (
              <span className={cn(
                "ml-2 px-1.5 py-0.5 rounded-full text-xs",
                filter === option?.id 
                  ? "bg-primary-foreground/20 text-primary-foreground" 
                  : "bg-muted-foreground/20 text-muted-foreground"
              )}>
                {option?.count}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredNotifications?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
            </p>
          </div>
        ) : (
          filteredNotifications?.map((notification) => (
            <div
              key={notification?.id}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-colors",
                notification?.read 
                  ? "bg-muted/30 border-border" :"bg-accent/10 border-accent",
                "hover:bg-accent/20"
              )}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-3">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  notification?.priority === 'high' 
                    ? "bg-error/10 text-error" :"bg-primary/10 text-primary"
                )}>
                  <Icon name={getNotificationIcon(notification?.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={cn(
                      "font-medium truncate",
                      getPriorityColor(notification?.priority)
                    )}>
                      {notification?.title}
                    </h4>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(notification?.timestamp)}
                      </span>
                      {!notification?.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => handleMarkAsRead(notification?.id, e)}
                        >
                          <Icon name="Check" size={12} />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {isProfessionalTier && notification?.businessName && (
                    <div className="flex items-center space-x-1 mb-2">
                      <Icon name="Building" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{notification?.businessName}</span>
                    </div>
                  )}
                  
                  <p className={cn(
                    "text-sm",
                    expandedId === notification?.id ? "text-foreground" : "text-muted-foreground line-clamp-2"
                  )}>
                    {notification?.message}
                  </p>
                  
                  {notification?.priority === 'high' && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Icon name="AlertTriangle" size={12} className="text-error" />
                      <span className="text-xs text-error font-medium">High Priority</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
