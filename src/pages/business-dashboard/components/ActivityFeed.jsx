import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      booking: 'Calendar',
      cancellation: 'XCircle',
      payment: 'Pound',
      message: 'MessageCircle',
      review: 'Star',
      reschedule: 'Clock'
    };
    return icons?.[type] || 'Bell';
  };

  const getActivityColor = (type) => {
    const colors = {
      booking: 'text-success',
      cancellation: 'text-error',
      payment: 'text-primary',
      message: 'text-accent',
      review: 'text-warning',
      reschedule: 'text-muted-foreground'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <Icon name="Activity" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/20 transition-micro">
            <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-medium">{activity?.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity?.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-muted-foreground">{formatTimeAgo(activity?.timestamp)}</span>
                {activity?.customer && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{activity?.customer}</span>
                  </>
                )}
              </div>
            </div>
            {activity?.amount && (
              <div className="text-sm font-medium text-success">
                £{activity?.amount}
              </div>
            )}
          </div>
        ))}
      </div>
      {activities?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
