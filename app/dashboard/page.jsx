import RoleGuard from "@/lib/guard";
import DashboardContent from "./DashboardContent";

export default function DashboardPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <DashboardContent />
    </RoleGuard>
  );
}
