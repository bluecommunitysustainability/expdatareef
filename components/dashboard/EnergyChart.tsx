import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Answers } from '../../types';

interface EnergyChartProps {
  answers: Answers;
}

export const EnergyChart: React.FC<EnergyChartProps> = ({ answers }) => {
  const total = (answers['q60a']?.value as number) || 0;
  const renewable = (answers['q61a']?.value as number) || 0;

  const nonRenewable = total > renewable ? total - renewable : 0;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-800/25 rounded-lg">
        <p className="text-gray-400">Not enough data for Energy Consumption chart.</p>
      </div>
    );
  }

  const data = [
    { name: 'Renewable', value: renewable },
    { name: 'Non-Renewable', value: nonRenewable },
  ];

  const COLORS = ['#48bb78', '#a0aec0'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }}
          formatter={(value: number) => `${value.toLocaleString()} kWh`}
        />
        <Legend wrapperStyle={{ color: '#e2e8f0', paddingTop: '20px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};