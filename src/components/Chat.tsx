"use client"
// import Link from 'next/link'
import { GitFork, UserRound } from 'lucide-react';
import { Settings  } from 'lucide-react';
import { BotMessageSquare } from 'lucide-react';
import { useState, useRef, useEffect } from "react";


export default function Chat(){
    const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Append user message
    setMessages((prevMessages) => [...prevMessages, { text: input, sender: "user" }]);
    setInput("");

    try {
      // Send request to backend
      const res = await fetch("https://healthchatbotbackend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();

      // Append bot response
      setMessages((prevMessages) => [...prevMessages, { text: data.reply, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
    return(
        <main className="z-main-section flex flex-grow lg:min-w-0 absolute h-full w-full lg:static lg:h-auto transition-transform duration-500 ease-in-out lg:transition-none">
            <section className="relative flex h-full min-w-0 flex-grow flex-col rounded-lg border border-marble-400 bg-marble-100 overflow-hidden">
                <div className="flex h-full w-full flex-col">
                    <div className="flex h-header w-full min-w-0 items-center border-b border-marble-400">
                        <div className="flex w-full flex-1 items-center justify-between px-5">
                            <span className="relative flex min-w-0 flex-grow items-center gap-x-1 overflow-hidden py-4">
                                <span className="text-p-lg font-body truncate text-volcanic-900">Chat with Cohere</span>
                            </span>
                            <span className="flex items-center gap-x-2 py-4">
                                <div aria-expanded="false" aria-haspopup="dialog">
                                    <a className="group flex items-center justify-center whitespace-nowrap transition ease-in-out disabled:cursor-not-allowed border border-transparent text-volcanic-900 hover:text-volcanic-800 active:text-volcanic-900 disabled:text-volcanic-700 focus-visible:outline-offset-4 focus-visible:outline-1 focus-visible:outline-volcanic-700 group/icon-button p-0 h-8 w-8 rounded hover:bg-mushroom-100" target="_blank" href="#">
                                        <div className="flex items-center">
                                            <GitFork className="text-mushroom-700 transition-colors ease-in-out group-hover/icon-button:!font-iconDefault"/>
                                        </div>
                                        <span className="text-p-lg font-body"></span>
                                    </a>
                                </div>
                                <button className="group flex items-center justify-center whitespace-nowrap transition ease-in-out disabled:cursor-not-allowed border border-transparent text-volcanic-900 hover:text-volcanic-800 active:text-volcanic-900 disabled:text-volcanic-700 focus-visible:outline-offset-4 focus-visible:outline-1 focus-visible:outline-volcanic-700 group/icon-button p-0 h-8 w-8 rounded hover:bg-mushroom-100" type="button">
                                    <div className="flex items-center">
                                        <Settings className="icon-outline icon-settings text-mushroom-700 transition-colors ease-in-out group-hover/icon-button:!font-iconDefault"/>
                                    </div>
                                    <span className="text-p-lg font-body"></span>
                                </button>
                            </span>
                        </div>
                    </div>
                    <div className="relative flex h-full w-full flex-col">
                        <div className="messages relative flex h-0 flex-grow flex-col">
                            <div className="md:!h-full !h-fit flex relative mt-auto overflow-x-hidden">
                                <div className="flex h-max min-h-full w-full">
                                    <div id="message-list" className="flex h-auto min-w-0 flex-1 flex-col">
                                        <div className="m-auto w-full p-4"></div> 
                                        <div className="flex flex-col space-y-2 overflow-auto">
                                            {messages.map((msg, idx) => (
                                            <div key={idx} className={`p-2 text-left flex`}>
                                                <div
                                                className="flex-shrink-0">
                                                   {msg.sender === "user" ? (
                                                        <UserRound className="bg-[#543A14] m-2 p-[4px] w-8 h-8 rounded-sm text-[#FFF0DC]" />
                                                        ) : (
                                                        <BotMessageSquare className="bg-[#543A14] m-2 p-[4px] w-8 h-8 rounded-sm text-[#FFF0DC]" />
                                                    )}
                                                </div>
                                                <div
                                                    className={`p-3 rounded-lg max-w-xs sm:max-w-md lg:max-w-4xl ${
                                                    msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                                                    }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>
                                        <div className="sticky bottom-0 px-4 pb-4 bg-marble-100">
                                            <div className="flex w-full flex-col">
                                                <div className="relative flex w-full flex-col transition ease-in-out rounded border bg-marble-100 border-marble-500 focus-within:border-mushroom-700">
                                                    {/* <div className="flex-col items-center justify-center border px-3 py-6 transition duration-200 absolute inset-0 z-drag-drop-input-overlay hidden h-full w-full rounded-none border-none bg-mushroom-200">
                                                        <p className="text-p font-body max-w-[170px] text-center text-mushroom-800">Drop files to upload</p>
                                                        <input className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0" type="file" accept="text/csv,text/plain,text/html,text/markdown,text/tab-separated-values,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/json,application/pdf,application/epub+zip" placeholder=""/>
                                                    </div> */}
                                                    <div className="relative flex items-end pr-2 md:pr-4">
                                                        <textarea 
                                                        id="composer" 
                                                        dir="auto" 
                                                        placeholder="Message..." 
                                                        className="w-full flex-1 resize-none overflow-hidden self-center px-2 pb-3 pt-2 md:px-4 md:pb-6 md:pt-4 mb-3 md:mb-1 rounded bg-marble-100 transition ease-in-out focus:outline-none text-p font-body leading-[150%] text-volcanic-700" 
                                                        style={{maxHeight: "207.75px", height: "61px", overflowY: "auto"}} 
                                                        rows="1"
                                                        value={input}
                                                        onChange={(e) => setInput(e.target.value)}
                                                        onKeyDown={(e) => {
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault(); // Prevent newline
                                                            sendMessage();
                                                        }
                                                        }}
                                                        ></textarea>
                                                        <button className="h-8 w-8 my-2 ml-1 md:my-4 flex flex-shrink-0 items-center justify-center rounded transition ease-in-out text-mushroom-800 hover:bg-mushroom-100" type="button">
                                                            <i className="icon-default icon-arrow-right"></i>
                                                        </button>
                                                    </div>
                                                    {/* <div className="flex items-center gap-x-2 border-t border-marble-400 mx-2 py-2" >
                                                        <input type="file" className="hidden"/>
                                                        <div aria-expanded="false" aria-haspopup="dialog">
                                                            <button className="group flex items-center justify-center whitespace-nowrap transition ease-in-out disabled:cursor-not-allowed border border-transparent text-volcanic-900 hover:text-volcanic-800 active:text-volcanic-900 disabled:text-volcanic-700 focus-visible:outline-offset-4 focus-visible:outline-1 focus-visible:outline-volcanic-700 group/icon-button p-0 h-7 w-7 rounded hover:bg-mushroom-100" type="button">
                                                                <div className="flex items-center">
                                                                    <i className="icon-outline icon-clip text-mushroom-700 transition-colors ease-in-out group-hover/icon-button:!font-iconDefault"  ></i>
                                                                </div>
                                                                <span className="text-p-lg font-body"></span>
                                                            </button>
                                                        </div>
                                                        <div aria-expanded="false" aria-haspopup="dialog">
                                                            <button className="group flex items-center justify-center whitespace-nowrap transition ease-in-out disabled:cursor-not-allowed border border-transparent text-volcanic-900 hover:text-volcanic-800 active:text-volcanic-900 disabled:text-volcanic-700 focus-visible:outline-offset-4 focus-visible:outline-1 focus-visible:outline-volcanic-700 group/icon-button p-0 h-7 w-7 rounded hover:bg-mushroom-100" type="button">
                                                                <div className="flex items-center">
                                                                    <i className="icon-outline icon-at text-mushroom-700 transition-colors ease-in-out group-hover/icon-button:!font-iconDefault"  ></i>
                                                                </div>
                                                                <span className="text-p-lg font-body"></span>
                                                            </button>
                                                        </div>
                                                        <div className="h-7 w-px bg-marble-300"></div>
                                                        <div className="flex flex-wrap gap-2"></div>
                                                    </div> */}
                                                </div>
                                                <p className="text-caption font-code text-danger-500 min-h-[14px] pt-2"></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden h-auto border-l border-marble-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}