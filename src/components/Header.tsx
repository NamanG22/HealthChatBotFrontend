"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Header(){
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URI;
    const { userEmail } = useAuth();

    const handleLogout = async () => {
        try {
            // First end all active sessions
            await fetch(`${API_URL}/api/chat/session/end-user-sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail }),
            });

            console.log("ended all active sessions");

            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("name");
            router.push("/"); // Redirect to login page
            setTimeout(() => {
                window.location.reload(); // Force reload to clear any cached state
            }, 500);
        } catch (error) {
            console.error('Error ending user sessions:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return(
        <div className="w-full">
            <nav className="z-navigation flex w-full items-center justify-between rounded-lg border px-4 py-3 border-marble-400 bg-marble-100">
                <Link href="#">
                    <div className="flex items-baseline mr-3">
                    </div>
                </Link>
                {/* <button className="flex items-center md:hidden"><i className="icon-default icon-menu text-icon-lg"></i></button> */}
                <div className="hidden md:flex flex-row items-center gap-x-4 gap-y-0 lg:gap-x-6 justify-between md:w-fit md:max-w-[680px] lg:max-w-[820px]">
                    <Link href="/home">
                        <p className="text-overline uppercase font-code font-medium text-volcanic-900">Home</p>
                    </Link>
                    <Link href="/chat">
                        <p className="text-overline uppercase font-code text-volcanic-800 hover:text-volcanic-900">Chat</p>
                    </Link>
                    <Link href="#">
                        <p className="text-overline uppercase font-code text-volcanic-800 hover:text-volcanic-900">Playground</p>
                    </Link>
                    <Link target="_blank" href="#">
                        <p className="text-overline uppercase font-code text-volcanic-800 hover:text-volcanic-900">Docs</p>
                    </Link>
                    <Link target="_blank" href="#">
                        <p className="text-overline uppercase font-code text-volcanic-800 hover:text-volcanic-900">Community</p>
                    </Link>
                    <div className="relative" ref={dropdownRef}>
                        <button
                        className="flex items-center gap-x-2 px-1 focus:rounded focus:outline-1 focus:outline-offset-4 focus:outline-volcanic-700"
                        type="button"
                        aria-expanded={isDropdownOpen}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <FaUserCircle className="h-6 w-6 text-icon-md text-volcanic-700"/>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                            <Link href="/profile">
                            <p className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer">Profile</p>
                            </Link>
                            <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                            >
                            Logout
                            </button>
                        </div>
                        )}
                    </div>
                </div>
            </nav>
            {/* <div className="md:hidden hidden absolute inset-0 z-navigation p-3 bg-mushroom-100"><nav className="flex h-full w-full flex-col justify-between rounded-lg border border-marble-400 bg-marble-100"><div className="flex h-full flex-col"><div className="flex w-full items-center border-b px-4 py-3 border-marble-400"><div className="flex w-full items-center"><a href="#"><div className="flex items-baseline"></div></a></div><button className="flex items-center"><i className="icon-default icon-close text-icon-lg"></i></button></div><div className="grow overflow-auto"><div className="flex flex-col"><a href="#"><p className="text-overline uppercase font-code font-medium text-volcanic-900 px-4 py-3 md:px-8">Chat</p></a><div className="flex flex-col"><a href="https://dashboard.cohere.com"><p className="text-overline uppercase font-code text-volcanic-800 hover:text-volcanic-900 px-4 py-3 md:px-8">Dashboard</p></a><div className="flex flex-col justify-between overflow-auto  border-marble-400 bg-marble-100 md:rounded-lg md:border md:w-42 w-full lg:w-56 px-4 md:py-6 flex-1"><nav className="hidden w-full flex-col gap-y-8 md:flex"><div className="flex flex-col gap-y-1"><span className="text-overline uppercase font-code text-green-700">Platform</span><a href="https://dashboard.cohere.com"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Dashboard</span></span></a><a href="https://dashboard.cohere.com/playground"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Playground</span></span></a><a href="https://dashboard.cohere.com/fine-tuning"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Fine-tuning</span></span></a><a href="https://dashboard.cohere.com/prompt-tuner"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Prompt Tuner</span><div className="text-label uppercase font-code" ><span className="text-volcanic-900 bg-mushroom-100 flex w-fit items-center rounded px-2 py-1 ml-2">BETA</span></div></span></a><a href="https://dashboard.cohere.com/datasets"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Datasets</span></span></a><a href="https://dashboard.cohere.com/api-keys"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">API Keys</span></span></a><a href="https://dashboard.cohere.com/connectors"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Connectors</span></span></a></div><div className="flex flex-col gap-y-1"><span className="text-overline uppercase font-code text-green-700">Settings</span><a href="https://dashboard.cohere.com/team"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Team</span></span></a><a href="https://dashboard.cohere.com/billing"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Billing &amp; Usage</span></span></a><a href="https://dashboard.cohere.com/data-controls"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Data Controls</span></span></a><a href="https://dashboard.cohere.com/profile"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Profile</span></span></a></div></nav><nav className="flex w-full flex-col gap-y-8 md:hidden border-l pl-6 border-mushroom-200"><div className="flex flex-col gap-y-1"><span className="text-overline uppercase font-code text-green-700">Platform</span><a href="https://dashboard.cohere.com"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Overview</span></span></a><a href="https://dashboard.cohere.com/fine-tuning"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Fine-tuning</span></span></a><a href="https://dashboard.cohere.com/prompt-tuner"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Prompt Tuner</span><div className="text-label uppercase font-code"><span className="text-volcanic-900 bg-mushroom-100 flex w-fit items-center rounded px-2 py-1 ml-2">BETA</span></div></span></a><a href="https://dashboard.cohere.com/datasets"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Datasets</span></span></a><a href="https://dashboard.cohere.com/api-keys"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">API Keys</span></span></a><a href="https://dashboard.cohere.com/connectors"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Connectors</span></span></a></div><div className="flex flex-col gap-y-1"><span className="text-overline uppercase font-code text-green-700">Settings</span><a href="https://dashboard.cohere.com/team"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Team</span></span></a><a href="https://dashboard.cohere.com/billing"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Billing &amp; Usage</span></span></a><a href="https://dashboard.cohere.com/data-controls"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Data Controls</span></span></a><a href="https://dashboard.cohere.com/profile"><span className="text-p font-body flex items-center py-0.5 text-volcanic-800 hover:text-volcanic-900"><span className="">Profile</span></span></a></div></nav></div></div><a href="https://dashboard.cohere.com/demos/rerank"><p className="text-overline uppercase font-code text-volcanic-800 hover:text-volcanic-900 px-4 py-3 md:px-8">Rerank</p></a><a href="https://dashboard.cohere.com/playground"><p className="text-overline uppercase font-code text-volcanic-800 hover:text-volcanic-900 px-4 py-3 md:px-8">Playground</p></a><a target="_blank" href="https://docs.cohere.com/"><p className="text-overline uppercase font-code text-volcanic-800 hover:text-volcanic-900 px-4 py-3 md:px-8">Docs</p></a><a target="_blank" href="https://discord.com/invite/co-mmunity"><p className="text-overline uppercase font-code text-volcanic-800 hover:text-volcanic-900 px-4 py-3 md:px-8">Community</p></a></div></div><div className="max-h-content flex w-full items-center justify-between border-t p-4 border-marble-400"><p className="text-p font-body flex-1 truncate text-volcanic-700">gargnaman352@gmail.com</p><a id="auth-link" className="group inline-block max-w-full disabled:cursor-not-allowed border-y border-y-transparent focus-visible:border-b-black focus-visible:outline-none ml-3 flex-shrink-0 text-volcanic-900" href="/api/auth/logout"><span className="flex items-center visited:text-coral-700 text-volcanic-900"><span className=""><span className="text-p font-body">Log out</span></span></span></a></div></div></nav></div> */}
        </div>
    )
}