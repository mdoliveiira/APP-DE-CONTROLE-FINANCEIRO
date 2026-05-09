export function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function parseBRL(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}
