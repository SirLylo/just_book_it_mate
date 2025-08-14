import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const ServiceAnalytics = ({ services = [] }) => {
  // Prepare data for charts
  const revenueData = services?.map(service => ({
      name: service?.name?.length > 15 ? service?.name?.substring(0, 15) + '...' : service?.name,
      revenue: service?.price * service?.bookingCount,
      bookings: service?.bookingCount,
      price: service?.price
    }))?.sort((a, b) => b?.revenue - a?.revenue)?.slice(0, 8);

  const categoryData = services?.reduce((acc, service) => {
    const existing = acc?.find(item => item?.category === service?.category);
    if (existing) {
      existing.count += 1;
      existing.revenue += service?.price * service?.bookingCount;
    } else {
      acc?.push({
        category: service?.category,
        count: 1,
        revenue: service?.price * service?.bookingCount
      });
    }
    return acc;
  }, []);

  const totalRevenue = services?.reduce((sum, service) => 
    sum + (service?.price * service?.bookingCount), 0
  );
  
  const totalBookings = services?.reduce((sum, service) => 
    sum + service?.bookingCount, 0
  );
  
  const averagePrice = services?.length > 0 
    ? services?.reduce((sum, service) => sum + service?.price, 0) / services?.length 
    : 0;

  const mostPopularService = services?.reduce((max, service) => 
    service?.bookingCount > (max?.bookingCount || 0) ? service : max, null
  );

  const colors = ['#103948', '#9ad9ee', '#2dd4bf', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-floating">
          <p className="font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.dataKey === 'revenue' ? `Revenue: £${entry?.value?.toFixed(2)}` : 
               entry?.dataKey === 'bookings' ? `Bookings: ${entry?.value}` : 
               `${entry?.dataKey}: ${entry?.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Pound" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-semibold text-foreground">£{totalRevenue?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Icon name="Calendar" size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-xl font-semibold text-foreground">{totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Icon name="TrendingUp" size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Price</p>
              <p className="text-xl font-semibold text-foreground">£{averagePrice?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Icon name="Star" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Most Popular</p>
              <p className="text-sm font-semibold text-foreground">
                {mostPopularService?.name || 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                {mostPopularService?.bookingCount || 0} bookings
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Service */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue by Service</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Services by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ category, count }) => `${category} (${count})`}
                  labelLine={false}
                >
                  {categoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors?.[index % colors?.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} services`,
                    props?.payload?.category
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Service Performance Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Service Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Service</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Bookings</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg/Day</th>
              </tr>
            </thead>
            <tbody>
              {services?.sort((a, b) => (b?.price * b?.bookingCount) - (a?.price * a?.bookingCount))?.map((service) => (
                <tr key={service?.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        service?.isActive ? 'bg-success' : 'bg-muted-foreground'
                      }`} />
                      <span className="font-medium text-foreground">{service?.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{service?.category}</td>
                  <td className="py-3 px-4 text-right font-medium text-foreground">
                    £{service?.price?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-foreground">{service?.bookingCount}</td>
                  <td className="py-3 px-4 text-right font-medium text-foreground">
                    £{(service?.price * service?.bookingCount)?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground">
                    {(service?.bookingCount / 30)?.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceAnalytics;
