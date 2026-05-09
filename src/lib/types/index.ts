export type ExpenseStatus = 'pago' | 'pendente';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string | null;
  category?: Category;
  description: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: ExpenseStatus;
  month: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  total_amount: number;
  total_paid: number;
  total_pending: number;
  count_paid: number;
  count_pending: number;
  by_category: {
    category_id: string;
    category_name: string;
    category_color: string;
    total: number;
  }[];
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount_limit: number;
  created_at: string;
}
