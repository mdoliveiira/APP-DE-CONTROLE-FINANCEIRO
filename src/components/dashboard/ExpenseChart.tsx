'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { formatBRL } from '@/lib/utils/currency';
import type { Category } from '@/lib/types';

interface ExpenseChartProps {
  spendingByCategory: Record<string, number>;
  categories: Map<string, Category>;
}

export function ExpenseChart({ spendingByCategory, categories }: ExpenseChartProps) {
  const categoryArray = Object.entries(spendingByCategory).map(([categoryId, amount]) => {
    const category = categories.get(categoryId);
    return {
      name: category?.name || 'Sem categoria',
      value: amount,
      color: category?.color || '#6B7280',
      categoryId,
    };
  });

  const sortedData = categoryArray.sort((a, b) => b.value - a.value).slice(0, 5);

  const totalCategories = Object.keys(spendingByCategory).length;
  if (totalCategories > 5) {
    const othersAmount = categoryArray
      .slice(5)
      .reduce((sum, cat) => sum + cat.value, 0);
    sortedData.push({
      name: 'Outros',
      value: othersAmount,
      color: '#9CA3AF',
      categoryId: 'others',
    });
  }

  const totalAmount = Object.values(spendingByCategory).reduce((sum, a) => sum + a, 0);

  if (sortedData.length === 0) {
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
        Gastos por Categoria
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => {
              const percentage = ((value / totalAmount) * 100).toFixed(0);
              return `${percentage}%`;
            }}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatBRL(value)}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '0.5rem',
              color: '#E8E8EE',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => {
              const data = entry.payload as any;
              const amount = formatBRL(data.value);
              return `${value} - ${amount}`;
            }}
            wrapperStyle={{
              paddingTop: '1rem',
              color: '#9CA3AF',
              fontSize: '0.875rem',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
