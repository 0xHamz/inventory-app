"use client";
import { useEffect } from "react";
import { authGuard } from "@/lib/guard";

export default function DashboardPage() {
  useEffect(() => {
    authGuard(() => {});
  }, []);

  return <div>Scan</div>;
}
