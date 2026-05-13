'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { formatBRL } from '@/lib/utils/currency';
import type { Category } from '@/lib/types';

interface CategoryData {
  category?: Category;
  amount: number;
}

interface CategoryBarChartProps {
  data: CategoryData[];
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  const chartData = data
    .filter((item) => item.category)
    .sort((a, b) => b.amount - a.amount)
    .map((item) => ({
      name: item.category?.name || 'Sem categoria',
      value: item.amount,
      color: item.category?.color || '#6B7280',
    }));

  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0) {
    return (
      <div
        className="rounded-xl p-6 flex items-center justify-center"
        style={{
          backgroundColor: '#141419',
          border: '1px solid rgba(255,255,255,0.07)',
          height: '400px',
        }}
      >
        <p style={{ color: '#6B7280' }}>Nenhuma despesa com categoria</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: '#141419',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <h3 className="mb-6 text-sm font-semibold" style={{ color: '#E8E8EE' }}>
        Despesas por Categoria
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis type="number" stroke="#9CA3AF" />
          <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={190} />
          <Tooltip
            formatter={(value: number) => formatBRL(value)}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '0.5rem',
              color: '#E8E8EE',
            }}
            labelStyle={{ color: '#E8E8EE' }}
          />
          <Bar dataKey="value" fill="#8884d8" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-6 space-y-2">
        {chartData.map((item) => {
          const percentage = ((item.value / totalAmount) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span style={{ color: '#E8E8EE' }}>{item.name}</span>
              </div>
              <div className="flex gap-4">
                <span style={{ color: '#9CA3AF' }}>{percentage}%</span>
                <span style={{ color: '#E8E8EE' }}>{formatBRL(item.value)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
