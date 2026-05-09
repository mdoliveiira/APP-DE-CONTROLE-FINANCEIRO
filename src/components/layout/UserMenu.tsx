'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface UserMenuProps {
  onLogout: () => void;
  loading: boolean;
}

export function UserMenu({ onLogout, loading }: UserMenuProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onLogout}
      disabled={loading}
      className="h-8 w-8 p-0"
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
