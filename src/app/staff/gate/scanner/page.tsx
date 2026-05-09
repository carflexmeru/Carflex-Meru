"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import StaffTicketScanner from "@/components/StaffTicketScanner";

export default function GateScannerPage() {
  return (
    <StaffLayout>
      <StaffTicketScanner title="Gate Verification" />
    </StaffLayout>
  );
}
