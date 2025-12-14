"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

export default function TestFirebase() {
  const [user, setUser] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Check login status
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    // 🔹 Fetch Firestore data (users collection)
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsersData(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    return unsubscribe;
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Test Firebase Connection</h1>

      <div>
        <strong>Auth Status:</strong> {user ? `Logged in as ${user.email}` : "Not logged in"}
      </div>

      <div>
        <strong>Users in Firestore:</strong>
        <ul className="list-disc pl-5 mt-2">
          {usersData.map(u => (
            <li key={u.id}>
              {u.name} - Role: {u.role} (UID: {u.id})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
