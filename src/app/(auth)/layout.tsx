export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: '#0D0D12' }}
    >
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
