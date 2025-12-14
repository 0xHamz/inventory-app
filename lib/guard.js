"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoleGuard({ children, allowedRoles }) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role || !allowedRoles.includes(role)) {
      router.push("/login");
    }
  }, [router, allowedRoles]);

  return <>{children}</>;
}
