export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden lg:pl-[var(--sidebar-width)] lg:group-data-[collapsible=icon]/sidebar:pl-[var(--sidebar-width-collapsed)]">
      {children}
    </div>
  );
}
