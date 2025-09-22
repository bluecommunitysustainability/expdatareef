import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Answers } from '../../types';

interface WasteChartProps {
  answers: Answers;
}

export const WasteChart: React.FC<WasteChartProps> = ({ answers }) => {
  const produced = (answers['q73a']?.value as number) || 0;
  const recycled = (answers['q74a']?.value as number) || 0;
  const landfill = (answers['q75a']?.value as number) || 0;

  if (produced === 0 && recycled === 0 && landfill === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-800/25 rounded-lg">
        <p className="text-gray-400">Not enough data for Waste Management chart.</p>
      </div>
    );
  }

  const data = [{ name: 'Waste (tonnes)', Produced: produced, Recycled: recycled, Landfill: landfill }];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
        <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} />
        <YAxis tick={{ fill: '#a0aec0' }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }}
          labelStyle={{ color: '#e2e8f0' }}
          cursor={{ fill: 'rgba(113, 128, 150, 0.1)' }}
        />
        <Legend wrapperStyle={{ color: '#e2e8f0' }} />
        <Bar dataKey="Produced" fill="#f56565" name="Produced (Total)" />
        <Bar dataKey="Recycled" fill="#48bb78" />
        <Bar dataKey="Landfill" fill="#a0aec0" />
      </BarChart>
    </ResponsiveContainer>
  );
};