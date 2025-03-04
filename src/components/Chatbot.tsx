"use client";
import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null); // Create a ref for the message container

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    // Update state using the previous messages array (prevents duplicate messages)
    setMessages((prevMessages) => [...prevMessages, { text: input, sender: "user" }]);
    setInput("");
  
    // Send request to backend
    const res = await fetch("https://healthchatbotbackend.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
  
    // Append bot response
    setMessages((prevMessages) => [...prevMessages, { text: data.reply, sender: "bot" }]);
  };

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Chat messages container */}
      <div className="flex-grow overflow-auto p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              {msg.text}
            </span>
          </div>
        ))}
        {/* Invisible div to track scroll position */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-4 flex bg-white border-t">
        <input
          className="flex-grow p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Ask something..."
        />
        <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white p-2 rounded">Send</button>
      </div>
    </div>
  );
}
