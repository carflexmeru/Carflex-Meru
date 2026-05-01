"use client";

import { usePathname } from "next/navigation";
import PublicHeader from "./layout/PublicHeader";
import MobileNav from "./layout/MobileNav";
import GlobalFooter from "./layout/GlobalFooter";
import CommandSidebar from "./layout/CommandSidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define route patterns
  const isAdmin = pathname.startsWith("/admin");
  const isVendor = pathname.startsWith("/showroom") || pathname.startsWith("/dashboard");
  const isStaff = pathname.startsWith("/agent") || pathname.startsWith("/gate") || pathname.startsWith("/staff");
  const isChat = pathname.startsWith("/inbox/");

  // Pages that should NOT have the public header/footer
  const isCommandView = isAdmin || isVendor || isStaff;

  return (
    <div className={`flex min-h-screen ${isAdmin || isVendor ? "flex-row" : "flex-col"}`}>
      {/* 1. Sidenav for Desktop Command Centers (Admin/Vendor) */}
      {(isAdmin || isVendor) && <CommandSidebar role={isAdmin ? "admin" : "vendor"} />}

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* 2. Public Top Navigation */}
        {!isCommandView && !isStaff && <PublicHeader />}

        {/* Main Content Area */}
        <main className={`flex-1 ${!isCommandView && !isStaff ? "pt-24" : ""}`}>
          {children}
        </main>

        {/* 3. Global Footer (Growth Engine) */}
        {!isCommandView && !isStaff && !isChat && <GlobalFooter />}

        {/* 4. Mobile Bottom Navigation */}
        {!isStaff && <MobileNav />}
      </div>
    </div>
  );
}
