import CommandSidebar from "@/app/components/layout/CommandSidebar";
import MobileNav from "@/app/components/layout/MobileNav";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#050505]">
      {/* Role-Specific Sidebar for Buyers */}
      <CommandSidebar role="buyer" />
      
      <main className="flex-1 p-6 md:p-12 pb-32 md:pb-12 h-screen overflow-y-auto scrollbar-hide">
        {children}
      </main>

      {/* Mobile Navigation Hub */}
      <MobileNav />
    </div>
  );
}
