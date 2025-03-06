"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URI; // Replace with your backend URL

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("clicked");
    
    e.preventDefault();
    const endpoint = isRegister ? "/register" : "/login";
    const body = isRegister ? { name, email, password } : { email, password };

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(res);
    

    const data = await res.json();
    if (res.ok) {
      if (!isRegister) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("name", data.name);
        setMessage("Login successful!");
        setTimeout(() => {
            router.push("/home");
          }, 1000);
      } else {
        setMessage("User registered successfully! Please log in.");
      }
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="p-6 bg-white shadow-md rounded-md w-96 text-volcanic-700">
        <h2 className="text-2xl font-bold text-center mb-4">{isRegister ? "Register" : "Login"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col ">
          {isRegister && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded mb-2"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded mb-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded mb-2"
            required
          />
          <button className="p-2 bg-blue-500 text-white rounded hover:cursor-pointer">{isRegister ? "Register" : "Login"}</button>
        </form>
        <p className="mt-2 text-sm text-gray-600 text-center">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsRegister(!isRegister)} className="text-blue-500 underline hover:cursor-pointer">
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
        {message && <p className="mt-2 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}
