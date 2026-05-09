interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <h3 className="mb-2 text-base font-semibold" style={{ color: '#E8E8EE' }}>
        {title}
      </h3>
      <p className="text-sm max-w-sm" style={{ color: '#6B7280' }}>
        {description}
      </p>
    </div>
  );
}
