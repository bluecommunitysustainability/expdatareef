import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Answers } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { availableThemes } from '../../constants/teamColors';


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


// --- NEW COMPONENT ADDED TO THIS FILE ---

const parseMonthlyData = (text: string | undefined | null): { name: string; occupancy: number }[] => {
    if (!text || typeof text !== 'string') return [];
    
    // Regex to find month-like keys and number values
    const regex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s:.]*(\d[\d,]*)/gi;
    
    const data: { name: string; occupancy: number }[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        const month = match[1].substring(0, 3);
        const value = parseInt(match[2].replace(/,/g, ''), 10);
        if (!isNaN(value)) {
            data.push({ name: month, occupancy: value });
        }
    }
    return data;
};

export const MonthlyOccupancyChart: React.FC<{ answers: Answers }> = ({ answers }) => {
    const occupancyText = answers['q44a']?.value as string;
    const data = useMemo(() => parseMonthlyData(occupancyText), [occupancyText]);
    const theme = useTheme();

    const themeColorHex = useMemo(() => {
        return availableThemes.find(t => t.value === theme.name)?.hex || '#14b8a6';
    }, [theme.name]);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-400 text-center">No parsable data for Monthly Occupancy.<br/><span className="text-xs">Enter data like "Jan: 5000, Feb: 6000..." in question q44a.</span></p>
            </div>
        );
    }
  
    return (
        <div style={{ width: '100%', height: 300 }}>
            <h3 className="text-lg font-semibold text-gray-200 mb-4 text-center">Monthly Occupancy</h3>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} />
                    <YAxis tick={{ fill: '#a0aec0' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }}
                        labelStyle={{ color: '#e2e8f0' }}
                        cursor={{ fill: 'rgba(113, 128, 150, 0.1)' }}
                        formatter={(value: number) => [value.toLocaleString(), "Occupancy"]}
                    />
                    <Bar dataKey="occupancy" fill={themeColorHex} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};