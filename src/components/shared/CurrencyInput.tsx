'use client';

import { Input } from '@/components/ui/input';
import { formatBRL, parseBRL } from '@/lib/utils/currency';
import { useState } from 'react';

interface CurrencyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CurrencyInput({
  value = 0,
  onChange,
  placeholder = 'R$ 0,00',
  disabled = false,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(formatBRL(value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numValue = parseBRL(rawValue);
    setDisplayValue(rawValue);
    onChange?.(numValue);
  };

  const handleBlur = () => {
    const numValue = parseBRL(displayValue);
    setDisplayValue(formatBRL(numValue));
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      inputMode="decimal"
    />
  );
}
