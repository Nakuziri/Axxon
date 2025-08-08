export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 h-full fixed top-0 left-0 bg-gray-600 text-white p-4 z-20 ">
        <div className="text-xl font-bold mb-6">Sidebar</div>
        {/* Sidebar links... */}
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}