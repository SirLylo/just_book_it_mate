import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const RevenueChart = ({ data, period = 'weekly' }) => {
  const formatTooltip = (value, name) => {
    return [`£${value}`, 'Revenue'];
  };

  const formatXAxisLabel = (value) => {
    if (period === 'daily') return value;
    if (period === 'weekly') return `Week ${value}`;
    return value;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Revenue Overview</h3>
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Icon name="TrendingUp" size={16} />
          <span className="capitalize">{period}</span>
        </div>
      </div>
      <div className="w-full h-64" aria-label="Revenue Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatXAxisLabel}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `£${value}`}
            />
            <Tooltip 
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-foreground)'
              }}
            />
            <Bar 
              dataKey="revenue" 
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-semibold text-foreground">
              £{data?.reduce((sum, item) => sum + item?.revenue, 0)?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-sm font-semibold text-foreground">
              £{Math.round(data?.reduce((sum, item) => sum + item?.revenue, 0) / data?.length)?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Best Day</p>
            <p className="text-sm font-semibold text-foreground">
              £{Math.max(...data?.map(item => item?.revenue))?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
