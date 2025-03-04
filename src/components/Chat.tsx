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
      const res = await fetch("http://localhost:5000/chat", {
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
                                        <div className="m-auto w-full p-4">
                                        {/* 
                                            <div className="flex flex-col items-center gap-y-6">
                                                <p className="text-[1.25rem] lg:text-[1.5rem] font-variable font-medium text-center text-volcanic-900">Try a prompt in Chat mode</p>
                                                <div className="w-full max-w-[820px] rounded-lg border border-marble-400">
                                                    <div className="px-4">
                                                        <div className="flex w-full items-end">
                                                            <div className="flex w-full justify-between overflow-x-auto md:justify-start styles_noScrollbar__WImnw border-none" role="tablist" aria-orientation="horizontal">
                                                                <button className="flex w-full flex-1 flex-col focus:outline-none md:flex-initial border-b border-marble-400" id="headlessui-tabs-tab-:R2j9anlcm:" role="tab" type="button" aria-selected="false" tabIndex="-1" aria-controls="headlessui-tabs-panel-:Rd9anlcm:">
                                                                    <div className="group flex w-full items-center justify-center gap-x-3 px-10 pt-1">
                                                                        <span className="text-label uppercase font-code whitespace-nowrap text-volcanic-700 group-hover:text-volcanic-900 my-3">Use Tools</span>
                                                                    </div>
                                                                </button>
                                                                <button className="flex w-full flex-1 flex-col focus:outline-none md:flex-initial border-b-4 border-coral-500" id="headlessui-tabs-tab-:R4j9anlcm:" role="tab" type="button" aria-selected="true" tabindex="0"  aria-controls="headlessui-tabs-panel-:Rl9anlcm:">
                                                                    <div className="group flex w-full items-center justify-center gap-x-3 px-10 pt-1">
                                                                        <span className="text-label uppercase font-code whitespace-nowrap font-medium text-volcanic-900 group-hover:text-volcanic-900 my-3">Just Chat</span>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                            <div className="hidden flex-1 border-b border-marble-400 md:block"></div>
                                                        </div>
                                                        <div className="w-full lg:pt-5 pt-5 pb-4">
                                                            <span aria-hidden="true" id="headlessui-tabs-panel-:Rd9anlcm:" role="tabpanel" tabindex="-1" style={{position: "absolute",top: "0",left: "0",width: "1px",height: "1px",padding: "0",margin: "-1px",overflow: "hidden",clipPath: "inset(50%)",whiteSpace: "nowrap",border: "0"}} aria-labelledby="headlessui-tabs-tab-:R2j9anlcm:"></span>
                                                            <div className="" id="headlessui-tabs-panel-:Rl9anlcm:" role="tabpanel" tabindex="0" aria-labelledby="headlessui-tabs-tab-:R4j9anlcm:">
                                                                <div className="flex flex-col gap-y-5">
                                                                    <p className="text-p font-body">Use Command R+ without any access to external sources.</p>
                                                                    <div className="flex flex-col gap-2.5 md:flex-row">
                                                                        <button className="flex w-full gap-2 rounded-md border border-marble-400 p-3 text-left md:flex-col md:p-4 bg-marble-200 transition-colors ease-in-out hover:bg-marble-300">
                                                                            <div className="flex h-8 w-8 flex-none items-center justify-center rounded bg-mushroom-500/25 text-mushroom-600">
                                                                                <i className="icon-outline icon-globe-stand" ></i>
                                                                            </div>
                                                                            <div className="flex flex-grow flex-col gap-y-2">
                                                                                <span className="text-label uppercase font-code font-medium"  >English to French</span>
                                                                                <p className="text-p font-body">Create a business plan for a marketing agency in 
                                                                                    <span className="font-medium">French</span>
                                                                                </p>
                                                                            </div>
                                                                        </button>
                                                                        <button className="flex w-full gap-2 rounded-md border border-marble-400 p-3 text-left md:flex-col md:p-4 bg-marble-200 transition-colors ease-in-out hover:bg-marble-300">
                                                                            <div className="flex h-8 w-8 flex-none items-center justify-center rounded bg-mushroom-500/25 text-mushroom-600">
                                                                                <i className="icon-outline icon-globe-stand"   ></i>
                                                                            </div>
                                                                            <div className="flex flex-grow flex-col gap-y-2">
                                                                                <span className="text-label uppercase font-code font-medium"  >Multilingual</span>
                                                                                <p className="text-p font-body"  >Redacta una descripción de empleo Diseñador(a) Web</p>
                                                                            </div>
                                                                        </button>
                                                                        <button className="flex w-full gap-2 rounded-md border border-marble-400 p-3 text-left md:flex-col md:p-4 bg-marble-200 transition-colors ease-in-out hover:bg-marble-300">
                                                                            <div className="flex h-8 w-8 flex-none items-center justify-center rounded bg-mushroom-500/25 text-mushroom-600">
                                                                                <i className="icon-outline icon-code"   ></i>
                                                                            </div>
                                                                            <div className="flex flex-grow flex-col gap-y-2">
                                                                                <span className="text-label uppercase font-code font-medium"  >Code Generation</span>
                                                                                <p className="text-p font-body"  >Help me clean up some data in Python</p>
                                                                            </div>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            */}
                                        </div> 
                                        <div className="flex flex-col space-y-2 overflow-auto">
                                            {messages.map((msg, idx) => (
                                            <div key={idx} className={`p-2 text-left flex`}>
                                                <span
                                                className={`flex items-center p-2 rounded-lg ${
                                                    msg.sender === "user" ? "text-volcanic-800" : "text-volcanic-900"
                                                    }`}
                                                    >
                                                    {
                                                        msg.sender ==="user"
                                                        ?
                                                        <UserRound className="bg-[#543A14] m-2 p-[4px] w-8 h-auto rounded-sm text-[#FFF0DC]"/>
                                                        :
                                                        <BotMessageSquare className="bg-[#543A14] m-2 p-[4px] w-8 h-auto rounded-sm text-[#FFF0DC]"/>
                                                    }
                                                    {msg.text}
                                                </span>
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