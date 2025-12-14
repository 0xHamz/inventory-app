"use client";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar({ role }) {
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between">
      <span className="font-bold">{role === "admin" ? "Admin Dashboard" : "Staff Panel"}</span>
      <button onClick={logout} className="bg-gray-800 px-3 py-1 rounded">Logout</button>
    </nav>
  );
}
