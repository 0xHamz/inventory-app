"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async () => {
    setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Ambil role dari Firestore
      const docRef = doc(db, "users", cred.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const role = data.role;

        // Simpan role di localStorage
        localStorage.setItem("role", role);

        // Redirect berdasarkan role
        if (role === "admin") {
          router.push("/dashboard");
        } else if (role === "staff") {
          router.push("/staff");
        } else {
          router.push("/");
        }

      } else {
        setError("User tidak ditemukan di Firestore");
      }
    } catch (err) {
      console.log(err.code, err.message);
      setError("Email atau password salah");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-80 p-6 bg-white rounded-lg shadow space-y-4">
        <h1 className="text-xl font-bold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="border w-full px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={login}
          className="w-full bg-black text-white px-3 py-2 rounded hover:bg-gray-800"
        >
          Login
        </button>

        {/* Info login contoh */}
        <div className="mt-4 text-gray-600 text-sm bg-gray-100 p-2 rounded">
          <p className="font-semibold">Login contoh untuk mencoba:</p>
          <p>Email: <span className="font-medium">staff@gmail.com</span></p>
          <p>Password: <span className="font-medium">121212</span></p>
        </div>
      </div>
    </div>
  );
}
