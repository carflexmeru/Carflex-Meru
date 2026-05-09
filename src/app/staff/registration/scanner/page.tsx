"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import StaffTicketScanner from "@/components/StaffTicketScanner";

export default function RegistrationScannerPage() {
  return (
    <StaffLayout>
      <StaffTicketScanner title="Registration Agent" />
    </StaffLayout>
  );
}
