"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import StaffTicketScanner from "@/components/StaffTicketScanner";

export default function ExitScannerPage() {
  return (
    <StaffLayout>
      <StaffTicketScanner title="Exit Command" />
    </StaffLayout>
  );
}
