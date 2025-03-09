"use client"; // This ensures it runs on the client-side
import { useEffect, useState } from "react";
import { useRouter, usePathname  } from "next/navigation";


export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const token = localStorage.getItem("token"); // Check if user is logged in

    if (!token) {
      router.push("/"); // Redirect to login page if not authenticated
    } else {
      setLoading(false); // Allow access if token exists
    }
  }, [pathname]);

  if (loading) return <p>Loading...</p>; // Show a loading message until redirect happens

  return <>{children}</>; // Render the protected content
}
