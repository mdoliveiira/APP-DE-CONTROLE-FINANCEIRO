'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { formatBRL } from '@/lib/utils/currency';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthData {
  month: string;
  paid: number;
  pending: number;
  total: number;
}

interface MonthlyBarChartProps {
  data: MonthData[];
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const chartData = data.map((item, index) => {
    const prevTotal = index > 0 ? data[index - 1].total : item.total;
    const variation = prevTotal > 0 ? (((item.total - prevTotal) / prevTotal) * 100).toFixed(0) : '0';
    return {
      ...item,
      monthLabel: format(new Date(item.month + '-01'), 'MMM', { locale: ptBR }),
      variation: parseFloat(variation),
    };
  });

  const averageTotal = data.reduce((sum, item) => sum + item.total, 0) / data.length;

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: '#141419',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <h3 className="mb-6 text-sm font-semibold" style={{ color: '#E8E8EE' }}>
        Despesas Mensais
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="monthLabel" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            formatter={(value: number) => formatBRL(value)}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '0.5rem',
              color: '#E8E8EE',
            }}
            labelStyle={{ color: '#E8E8EE' }}
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div
                    style={{
                      backgroundColor: '#1F2937',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '0.5rem',
                      padding: '8px 12px',
                      color: '#E8E8EE',
                      fontSize: '12px',
                    }}
                  >
                    <p>{data.monthLabel}</p>
                    <p>Pago: {formatBRL(data.paid)}</p>
                    <p>Pendente: {formatBRL(data.pending)}</p>
                    <p style={{ fontWeight: 'bold' }}>Total: {formatBRL(data.total)}</p>
                    {data.variation !== 0 && (
                      <p style={{ color: data.variation > 0 ? '#F87171' : '#22D3A8' }}>
                        {data.variation > 0 ? '↑' : '↓'} {Math.abs(data.variation)}%
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <ReferenceLine
            y={averageTotal}
            stroke="#8B5CF6"
            strokeDasharray="5 5"
            label={{ value: 'Média', position: 'insideTopRight', offset: -10, fill: '#8B5CF6' }}
          />
          <Bar dataKey="paid" fill="#22D3A8" name="Pago" />
          <Bar dataKey="pending" fill="#F59E0B" name="Pendente" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
