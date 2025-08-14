import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ConsolidatedAnalytics = ({
  metrics,
  businesses,
  className
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock revenue comparison data
  const revenueComparisonData = businesses?.map(business => ({
    name: business?.name?.split(' ')?.[0], // Shortened name for chart
    revenue: business?.weeklyRevenue,
    appointments: business?.todayAppointments,
    conversion: business?.conversionRate
  }));

  // Mock performance trends
  const performanceData = [
    { name: 'Mon', appointments: 15, revenue: 890 },
    { name: 'Tue', appointments: 22, revenue: 1240 },
    { name: 'Wed', appointments: 18, revenue: 960 },
    { name: 'Thu', appointments: 25, revenue: 1450 },
    { name: 'Fri', appointments: 28, revenue: 1680 },
    { name: 'Sat', appointments: 32, revenue: 1920 },
    { name: 'Sun', appointments: 20, revenue: 1100 }
  ];

  // Colors for charts
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart' },
    { id: 'revenue', label: 'Revenue', icon: 'TrendingUp' },
    { id: 'performance', label: 'Performance', icon: 'Activity' }
  ];

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="Calendar" size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">Total</span>
        </div>
        <div className="text-2xl font-bold text-foreground">{metrics?.totalTodayAppointments}</div>
        <div className="text-sm text-muted-foreground">Today's Appointments</div>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="Pound" size={20} className="text-success" />
          <span className="text-sm text-muted-foreground">Total</span>
        </div>
        <div className="text-2xl font-bold text-success">£{metrics?.totalWeeklyRevenue?.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">Weekly Revenue</div>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="Target" size={20} className="text-warning" />
          <span className="text-sm text-muted-foreground">Average</span>
        </div>
        <div className="text-2xl font-bold text-warning">{metrics?.averageConversionRate}%</div>
        <div className="text-sm text-muted-foreground">Conversion Rate</div>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon name="Building" size={20} className="text-accent" />
          <span className="text-sm text-muted-foreground">Count</span>
        </div>
        <div className="text-2xl font-bold text-accent">{metrics?.activeBusinesses}</div>
        <div className="text-sm text-muted-foreground">Active Locations</div>
      </div>
    </div>
  );

  const renderRevenueTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-foreground mb-4">Revenue by Location</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h4 className="font-medium text-foreground mb-4">Revenue Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueComparisonData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
                label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
              >
                {revenueComparisonData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors?.[index % colors?.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-foreground mb-4">Weekly Performance Trends</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="appointments" fill="#10b981" name="Appointments" />
            <Bar yAxisId="right" dataKey="revenue" fill="#3b82f6" name="Revenue (£)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {businesses?.map((business, index) => (
          <div key={business?.id} className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors?.[index % colors?.length] }}
              />
              <h5 className="font-medium text-foreground">{business?.name}</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Today</span>
                <span className="text-sm font-medium">{business?.todayAppointments} apps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Weekly</span>
                <span className="text-sm font-medium">£{business?.weeklyRevenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Conversion</span>
                <span className="text-sm font-medium">{business?.conversionRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("bg-card rounded-lg border border-border p-6 shadow-subtle", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Consolidated Analytics</h2>
        </div>
        
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {tabs?.map((tab) => (
            <Button
              key={tab?.id}
              variant={activeTab === tab?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab?.id)}
              iconName={tab?.icon}
              iconPosition="left"
            >
              {tab?.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'revenue' && renderRevenueTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
      </div>
    </div>
  );
};

export default ConsolidatedAnalytics;
