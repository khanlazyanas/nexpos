import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Left side: Fixed Sidebar */}
      <Sidebar />
      
      {/* Right side: Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        {children}
      </div>
    </div>
  );
}