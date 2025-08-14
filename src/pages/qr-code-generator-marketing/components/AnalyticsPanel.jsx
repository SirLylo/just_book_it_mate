import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalyticsPanel = ({ qrCodeData }) => {
  const [timeRange, setTimeRange] = useState('7days');
  const [activeTab, setActiveTab] = useState('scans');

  // Mock analytics data
  const scanData = [
    { date: '04/08', scans: 12, bookings: 8 },
    { date: '05/08', scans: 19, bookings: 12 },
    { date: '06/08', scans: 15, bookings: 9 },
    { date: '07/08', scans: 22, bookings: 15 },
    { date: '08/08', scans: 28, bookings: 18 },
    { date: '09/08', scans: 24, bookings: 16 },
    { date: '10/08', scans: 31, bookings: 22 }
  ];

  const locationData = [
    { name: 'Website', value: 45, color: '#103948' },
    { name: 'Business Cards', value: 25, color: '#9ad9ee' },
    { name: 'Flyers', value: 20, color: '#2dd4bf' },
    { name: 'Social Media', value: 10, color: '#10b981' }
  ];

  const deviceData = [
    { device: 'Mobile', scans: 89, percentage: 72 },
    { device: 'Desktop', scans: 28, percentage: 23 },
    { device: 'Tablet', scans: 6, percentage: 5 }
  ];

  const timeRanges = [
    { id: '7days', label: '7 Days' },
    { id: '30days', label: '30 Days' },
    { id: '90days', label: '90 Days' },
    { id: 'all', label: 'All Time' }
  ];

  const tabs = [
    { id: 'scans', label: 'Scans', icon: 'BarChart3' },
    { id: 'locations', label: 'Sources', icon: 'MapPin' },
    { id: 'devices', label: 'Devices', icon: 'Smartphone' },
    { id: 'conversion', label: 'Conversion', icon: 'TrendingUp' }
  ];

  const totalScans = scanData?.reduce((sum, day) => sum + day?.scans, 0);
  const totalBookings = scanData?.reduce((sum, day) => sum + day?.bookings, 0);
  const conversionRate = totalScans > 0 ? ((totalBookings / totalScans) * 100)?.toFixed(1) : 0;

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 sm:mb-0">QR Code Analytics</h3>
        
        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          {timeRanges?.map((range) => (
            <button
              key={range?.id}
              onClick={() => setTimeRange(range?.id)}
              className={`
                px-3 py-1.5 text-sm rounded-md transition-micro
                ${timeRange === range?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/20'
                }
              `}
            >
              {range?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Eye" size={16} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Scans</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{totalScans}</div>
          <div className="text-xs text-success flex items-center space-x-1">
            <Icon name="TrendingUp" size={12} />
            <span>+12% vs last week</span>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Calendar" size={16} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Bookings</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{totalBookings}</div>
          <div className="text-xs text-success flex items-center space-x-1">
            <Icon name="TrendingUp" size={12} />
            <span>+8% vs last week</span>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Conversion</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{conversionRate}%</div>
          <div className="text-xs text-success flex items-center space-x-1">
            <Icon name="TrendingUp" size={12} />
            <span>+2.1% vs last week</span>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Avg. Time</span>
          </div>
          <div className="text-2xl font-bold text-foreground">2.4s</div>
          <div className="text-xs text-muted-foreground">Scan to booking</div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-micro flex-1 justify-center
              ${activeTab === tab?.id
                ? 'bg-card text-foreground shadow-subtle'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="hidden sm:inline">{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Chart Content */}
      <div className="h-64 mb-6">
        {activeTab === 'scans' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scanData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="scans" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bookings" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'locations' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {locationData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'devices' && (
          <div className="space-y-4 pt-4">
            {deviceData?.map((device) => (
              <div key={device?.device} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={device?.device === 'Mobile' ? 'Smartphone' : device?.device === 'Desktop' ? 'Monitor' : 'Tablet'} 
                    size={20} 
                    className="text-primary" 
                  />
                  <span className="font-medium text-foreground">{device?.device}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${device?.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {device?.scans}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'conversion' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scanData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* Export Options */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          iconName="Download"
          iconPosition="left"
          onClick={() => console.log('Export analytics data')}
        >
          Export Data
        </Button>
        <Button
          variant="outline"
          iconName="Mail"
          iconPosition="left"
          onClick={() => console.log('Email report')}
        >
          Email Report
        </Button>
        <Button
          variant="outline"
          iconName="Share"
          iconPosition="left"
          onClick={() => console.log('Share analytics')}
        >
          Share Analytics
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
