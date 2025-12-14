import RoleGuard from "@/lib/guard";
import StaffContent from "./StaffContent";

export default function StaffPage() {
  return (
    <RoleGuard allowedRoles={["staff"]}>
      <StaffContent />
    </RoleGuard>
  );
}
