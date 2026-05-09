'use client';

import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import type { Category } from '@/lib/types';

interface CategoryDataPoint {
  category: Category | undefined;
  amount: number;
}

interface CategoryPieChartProps {
  data: CategoryDataPoint[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = data
    .filter((item) => item.category)
    .map((item) => ({
      name: item.category!.name,
      value: item.amount,
      color: item.category!.color,
    }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const formattedData = chartData.map((item) => ({
    ...item,
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0',
  }));

  return (
    <div
      className="p-4 rounded-2xl"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <h2
        className="text-lg font-semibold mb-4"
        style={{ color: 'var(--foreground)' }}
      >
        Gastos por Categoria
      </h2>
      {formattedData.length === 0 ? (
        <div
          className="h-64 flex items-center justify-center"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Sem dados para exibir
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ payload }) => `${payload?.percentage || 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)',
              }}
              formatter={(value) => {
                if (typeof value === 'number') {
                  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                }
                return value;
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span style={{ color: 'var(--foreground)', fontSize: '12px' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
