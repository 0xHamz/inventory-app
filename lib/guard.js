// lib/guard.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// RoleGuard untuk client component
export default function RoleGuard({ allowedRoles = [], children }) {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Ambil role dari localStorage (set waktu login)
    const storedRole = localStorage.getItem("role");

    if (!storedRole) {
      router.push("/login"); // redirect ke login kalau tidak ada role
      return;
    }

    setRole(storedRole);

    // Jika role tidak termasuk allowedRoles
    if (!allowedRoles.includes(storedRole)) {
      router.push("/"); // redirect ke halaman default
    }
  }, [allowedRoles, router]);

  // Tunggu sampai role terbaca
  if (!role) return null;

  return children;
}
