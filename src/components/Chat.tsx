"use client"
// import Link from 'next/link'
import { GitFork, UserRound } from 'lucide-react';
import { Settings  } from 'lucide-react';
import { BotMessageSquare} from 'lucide-react';
import { useState, useRef, useEffect, useCallback} from "react";
import { FaArrowRight } from "react-icons/fa6";
const { CohereClientV2 } = require('cohere-ai');
import crypto from 'crypto';
import axios from 'axios';

const COHERE_API_KEY = process.env.NEXT_PUBLIC_COHERE_API_KEY;
const cohere = new CohereClientV2({
    token: COHERE_API_KEY,
});
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URI;
const API_KEY_MEDIC = process.env.NEXT_PUBLIC_MEDIC_API_KEY;    // Replace with your actual ApiMedic API Key
const SECRET_KEY_MEDIC = process.env.NEXT_PUBLIC_MEDIC_API_SECRET;  // Replace with your actual ApiMedic Secret Key
const API_URL_MEDIC = "https://sandbox-authservice.priaid.ch/login";  // Use "https://authservice.priaid.ch/login" in production

interface ChatMessage {
    content: string;
    role: 'user' | 'assistant';
}

export default function Chat(){
    const { userEmail, setUserEmail } = useAuth();

    // console.log("Chat Component - Current userEmail:", userEmail); // Debug log
    
    const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
    const [input, setInput] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const initializationRef = useRef(false);
    const searchParams = useSearchParams();
    const selectedSessionId = searchParams.get('session');
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Add this effect to restore email from localStorage if needed
    useEffect(() => {
        if (!userEmail) {
            const storedEmail = localStorage.getItem('userEmail');
            // Add console logs to debug
            console.log("No userEmail in context, checking localStorage:", storedEmail);
            if (storedEmail) {
                // Verify the email before setting it
                if (storedEmail.includes('@')) {  // Basic validation
                    setUserEmail(storedEmail);
                } else {
                    // Clear invalid email from localStorage
                    localStorage.removeItem('userEmail');
                }
            }
        } else {
            // Ensure localStorage is in sync with context
            const storedEmail = localStorage.getItem('userEmail');
            if (storedEmail !== userEmail) {
                localStorage.setItem('userEmail', userEmail);
            }
        }
    }, [userEmail, setUserEmail]);

    useEffect(() => {
        const initSession = async () => {
            // console.log("InitSession called with userEmail:", userEmail);
            if (!userEmail || initializationRef.current) {
                // console.log("Returning early because:", !userEmail ? "no userEmail" : "already initialized");
                return;
            }
            initializationRef.current = true;
            
            try {
                const response = await fetch(`${API_URL}/api/chat/session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ userEmail }),
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server response:', errorText);
                    throw new Error('Failed to initialize session');
                }

                const data = await response.json();
                // console.log("Session initialized with data:", data);
                setSessionId(data.sessionId);
                setIsInitialized(true);
                
                if (data.messages && data.messages.length > 0) {
                    const formattedMessages = data.messages.map((msg: ChatMessage) => ({
                        text: msg.content,
                        sender: msg.role === 'user' ? 'user' : 'bot'
                    }));
                    setMessages(formattedMessages);
                }
            } catch (error) {
                console.error("Failed to initialize session:", error);
            }
        };

        initSession();
    }, [userEmail]);

    useEffect(() => {
        const loadSession = async () => {
            if (!userEmail || !selectedSessionId) return;

            try {
                // console.log("selectedSessionId", selectedSessionId);
                const response = await fetch(`${API_URL}/api/chat/session/${selectedSessionId}`);
                if (!response.ok) throw new Error('Failed to fetch session');
                
                const session = await response.json();
                setSessionId(selectedSessionId);
                
                if (session.messages && session.messages.length > 0) {
                    const formattedMessages = session.messages.map((msg: any) => ({
                        text: msg.content,
                        sender: msg.role === 'user' ? 'user' : 'bot'
                    }));
                    setMessages(formattedMessages);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error("Failed to load session:", error);
            }
        };

        loadSession();
    }, [selectedSessionId, userEmail]);

    async function getAuthToken() {
        // Generate HMAC-MD5 Hash
        const hmac = crypto.createHmac('md5',SECRET_KEY_MEDIC || '');
        hmac.update(API_URL_MEDIC);
        const computedHashString = hmac.digest('base64');
    
        try {
            const { data } = await axios.post(API_URL_MEDIC, {}, {
                headers: {
                    "Authorization": `Bearer ${API_KEY_MEDIC}:${computedHashString}`,
                    "Content-Type": "application/json"
                }
            });
    
            console.log("Token:", data.Token); // Store this token securely for future requests
            return data.Token;
    
        } catch (error: any) {
            console.error("Error generating token:", error.response?.data || error.message);
            throw new Error("Failed to authenticate with ApiMedic");
        }
    }

    

    const sendMessage = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return;
        // console.log("userEmail111", userEmail);


        // Show loading state
        setIsLoading(true);
        setInput("");
        // Append user message
        
        try {
            const userMessage = { text: trimmedInput, sender: "user" };
            setMessages((prevMessages) => [...prevMessages, userMessage]);

            try {
                await fetch(`${API_URL}/api/chat/message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        userEmail,
                        sessionId,
                        message: userMessage
                    }),
                });
            } catch (error) {
                console.log("❌ Error:", error);
            }

            const response = await cohere.chat({
                model: 'command-r',
                messages: [
                    {
                        role: "system",
                        content: `You are a specialized health chatbot named Sante. 
                        Your purpose is to provide medically accurate and health-focused information only. 
                        If a user asks about unrelated topics, politely steer the conversation back to health.
                        
                        Now if a user asks about a specific health condition, you should use the following format:
                        <condition>
                        <symptoms>
                        <treatment>
                        <precaution>
                        
                        If a user starts talking about what could have happend to me or start telling about his/her symptoms, you should ask for
                        1. Age
                        2. Gender
                        3. Symptoms
                        one by one and create a response for each question.
                        
                        If a user tell his age after you ask age, then create a response Age: <age> then create further responses
                        If a user tell his gender after you ask gender, then create a response Gender: <gender> then create further responses
                        If a user tell his symptoms after you ask symptoms, then create a response Symptoms: [<symptoms1>, <symptoms2>, <symptoms3>, ...] assume i will generate the response for diagnosis
                        `
                    },
                    ...messages.map(msg => ({
                        role: msg.sender === "user" ? "user" : "assistant",
                        content: msg.text
                    })),
                    {
                        role: "user",
                        content: trimmedInput,
                    }
                ],
            });
    
            if (!response.message?.content?.[0]?.text) {
                throw new Error("Invalid response format from Cohere");
            }
            
            const botMessage = { 
                text: response.message.content[0].text, 
                sender: "bot" 
            };

            let age;
            let gender;
            let symptomsArray;
            if (response.message.content[0].text.includes("Age:")) {
                // Extract only numbers after "Age:"
                const ageMatch = response.message.content[0].text.match(/Age:\s*(\d+)/);
                age = ageMatch ? parseInt(ageMatch[1]) : null;
                botMessage.text = botMessage.text.replace(/Age:\s*\d+/, '').trim();
            }
            if (response.message.content[0].text.includes("Gender:")) {
                gender = response.message.content[0].text.match(/Gender:\s*([^\n]*)/)?.[1]?.trim() || null;
                botMessage.text = botMessage.text.replace(/Gender:\s*[^\n]*/, '').trim();
            }
            if (response.message.content[0].text.includes("Symptoms:")) {
                const symptoms = response.message.content[0].text.match(/Symptoms:\s*([^\n]*)/)?.[1]?.trim() || null;
                symptomsArray = symptoms ? symptoms.split(",").map((symptom: string) => symptom.trim()) : [];
                botMessage.text = botMessage.text.replace(/Symptoms:\s*[^\n]*/, '').trim();
            }

            if (age && gender && symptomsArray) {
                try {
                    const token = await getAuthToken();
            
                    const { data } = await axios.get(API_URL_MEDIC, {
                    params: {
                        token: token,
                        language: "en", 
                        gender: gender,
                        year_of_birth: new Date().getFullYear() - age,
                        symptoms: JSON.stringify((symptomsArray || []).map((s: string) => ({ ID: s, ChoiceID: "present" })))
                    }
                });
        
                console.log("data", data);
                botMessage.text = botMessage.text + " " + data.Diagnosis;
                } catch (error) {
                    console.error("Error fetching diagnosis:", error);
                }
            }
            
            // Add bot response
            setMessages(prev => [...prev, botMessage]);

            // console.log("messages", messages);

            await fetch(`${API_URL}/api/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail,
                    sessionId,
                    message: botMessage
                }),
            });
            
        } catch (error) {
            console.error("❌ Error:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: "Sorry, there was an error processing your request.", sender: "bot" }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-scroll to latest message
    const debouncedScroll = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);
    
    useEffect(() => {
        debouncedScroll();
    }, [messages, debouncedScroll]);

    const TypingIndicator = () => (
        <div className="flex space-x-2 p-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
        </div>
    );
      
    return(
        <main className="z-main-section flex flex-grow lg:min-w-0 absolute h-full w-full lg:static lg:h-auto transition-transform duration-500 ease-in-out lg:transition-none">
            <section className="relative flex h-full min-w-0 flex-grow flex-col rounded-lg border border-marble-400 bg-marble-100 overflow-hidden">
                <div className="flex h-full w-full flex-col">
                    <div className="flex h-header w-full min-w-0 items-center border-b border-marble-400">
                        <div className="flex w-full flex-1 items-center justify-between px-5">
                            <span className="relative flex min-w-0 flex-grow items-center gap-x-1 overflow-hidden py-4">
                                <span className="text-p-lg font-body truncate text-volcanic-900">Chat with Assistant</span>
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
                                                    msg.sender === "user" ? "bg-mushroom-100 text-volcanic-900" : "bg-gray-200 text-black"
                                                    }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                            ))}
                                            {isLoading && (
                                                <div className="flex items-center">
                                                    <BotMessageSquare className="bg-[#543A14] m-2 p-[4px] w-8 h-8 rounded-sm text-[#FFF0DC]" />
                                                    <TypingIndicator />
                                                </div>
                                            )}
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
                                                        className="w-full flex-1 resize-none overflow-hidden self-center px-2 pb-3 pt-2 md:px-4 md:pb-4 md:pt-4 mb-3 md:mb-1 rounded bg-marble-100 transition ease-in-out focus:outline-none text-p font-body leading-[150%] text-volcanic-700 custom-scroll" 
                                                        style={{maxHeight: "207.75px", height: "61px", overflowY: "auto"}} 
                                                        rows={1}
                                                        value={input}
                                                        onChange={(e) => setInput(e.target.value)}
                                                        onKeyDown={(e) => { 
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault(); // Prevent newline
                                                            sendMessage();
                                                        }
                                                        }}
                                                        ></textarea>
                                                        <button className="h-8 w-8 my-2 ml-1 md:my-4 flex flex-shrink-0 items-center justify-center rounded transition ease-in-out text-mushroom-800 hover:bg-mushroom-100 hover:cursor-pointer" type="button" onClick={sendMessage}>
                                                            <FaArrowRight  className=""/>
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