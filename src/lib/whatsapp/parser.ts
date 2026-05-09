export interface ParsedExpense {
  amount: number;
  description: string;
}

export function parseWhatsAppMessage(message: string): ParsedExpense | null {
  const trimmed = message.trim();

  const patterns = [
    /(?:gastei|paguei|comprei|lancei|adicionei)\s+([\d]+(?:[,.]\d{1,2})?)\s+(?:de|no|na|em|com|para)?\s*(.+)/i,
    /([\d]+(?:[,.]\d{1,2})?)\s+(?:de|no|na)?\s*(.+)/i,
    /(.+)\s+([\d]+(?:[,.]\d{1,2})?)$/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) {
      let amount: number;
      let description: string;

      if (pattern === patterns[2]) {
        description = match[1].trim();
        amount = parseFloat(match[2].replace(',', '.'));
      } else {
        const amountStr = match[1].replace(',', '.');
        amount = parseFloat(amountStr);
        description = match[2].trim();
      }

      if (!isNaN(amount) && amount > 0 && description.length > 0) {
        return { amount, description };
      }
    }
  }

  return null;
}

export function isLinkCommand(message: string): string | null {
  const trimmed = message.trim().toLowerCase();

  const linkPattern = /^vincular\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/i;
  const match = trimmed.match(linkPattern);

  if (match) {
    return match[1];
  }

  return null;
}
