"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import StaffTicketScanner from "@/components/StaffTicketScanner";

export default function GroundScannerPage() {
  return (
    <StaffLayout>
      <StaffTicketScanner title="Ground Verification" />
    </StaffLayout>
  );
}
