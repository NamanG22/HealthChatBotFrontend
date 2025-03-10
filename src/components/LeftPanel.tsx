'use client'
import Link from 'next/link'
import { TextSearch, SquarePen, PanelLeftClose, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface ChatSession {
    sessionId: string;
    messages: Array<{
        content: string;
        role: 'user' | 'assistant' | 'system';
        timestamp: string;
    }>;
    createdAt: string;
    isActive: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URI;
export default function LeftPanel() {
    const { userEmail } = useAuth();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const router = useRouter();

    // console.log("LeftPanel - userEmail before createNewSession:", userEmail); // Debug log

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch(`${API_URL}/api/chat/session?userEmail=${userEmail}`);
                if (!response.ok) throw new Error('Failed to fetch sessions');
                const data = await response.json();
                setSessions(data);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        if (userEmail) {
            fetchSessions();
        }
    }, [userEmail]);

    const createNewSession = async () => {
        if (!userEmail) {
            console.error("No user email available");
            return;
        }

        try {
            // console.log("Creating new session for email:", userEmail); // Debug log
            const response = await fetch(`${API_URL}/api/chat/session/new`, {
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
                throw new Error('Failed to create new session');
            }
            
            const data = await response.json();
            // console.log("New session created:", data); // Debug log
            
            // Refresh sessions list
            const updatedSessionsResponse = await fetch(`${API_URL}/api/chat/session?userEmail=${userEmail}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const updatedSessions = await updatedSessionsResponse.json();
            setSessions(updatedSessions);

            // Store the session ID in localStorage before redirecting
            localStorage.setItem('currentSessionId', data.sessionId);
            localStorage.setItem('userEmail', userEmail); // Ensure email is persisted

            // Redirect to the new session
            router.push(`/chat?session=${data.sessionId}`);
        } catch (error) {
            console.error('Error creating new session:', error);
        }
    };

    // Helper function to get session title from first message or timestamp
    const getSessionTitle = (session: ChatSession) => {
        const firstUserMessage = session.messages.find(msg => msg.role === 'user');
        if (firstUserMessage) {
            // Truncate message if too long
            return firstUserMessage.content.length > 30 
                ? firstUserMessage.content.substring(0, 30) + '...'
                : firstUserMessage.content;
        }
        // If no messages, return formatted date
        return `Chat started ${format(new Date(session.createdAt), 'MMM d, yyyy')}`;
    };

    return(
        <div className="lg:flex-grow-0 transition-transform duration-500 ease-in-out lg:transition-[min-width,max-width,margin,opacity,border-width] lg:duration-300 w-full flex flex-grow flex-col rounded-lg border border-marble-400 bg-marble-100 lg:mr-3 lg:min-w-[242px] 2xl:min-w-left-panel-2xl 3xl:min-w-left-panel-3xl lg:max-w-[242px] 2xl:max-w-left-panel-2xl 3xl:max-w-left-panel-3xl">
            <nav className="transition-opacity ease-in-out lg:duration-500 flex h-full w-full flex-grow flex-col">
                <header className="flex h-[64px] w-full items-center justify-between border-b px-3 py-5 border-marble-400 overflow-hidden">
                    <div className="flex items-center gap-x-2">
                        {/* <button className="group flex items-center justify-center whitespace-nowrap transition ease-in-out disabled:cursor-not-allowed border border-transparent text-volcanic-900 hover:text-volcanic-800 active:text-volcanic-900 disabled:text-volcanic-700 focus-visible:outline-offset-4 focus-visible:outline-1 focus-visible:outline-volcanic-700 group/icon-button p-0 h-8 w-8 rounded hover:bg-mushroom-100 lg:hidden" type="button">
                            <div className="flex items-center">
                                <i className="icon-outline icon-chevron-left text-mushroom-700 transition-colors ease-in-out group-hover/icon-button:!font-iconDefault"></i>
                            </div>
                            <span className="text-p-lg font-body"></span>
                        </button> */}
                        <div aria-expanded="false" aria-haspopup="dialog">
                            <button className="group items-center justify-center whitespace-nowrap transition ease-in-out disabled:cursor-not-allowed border border-transparent text-volcanic-900 hover:text-volcanic-800 active:text-volcanic-900 disabled:text-volcanic-700 focus-visible:outline-offset-4 focus-visible:outline-1 focus-visible:outline-volcanic-700 group/icon-button p-0 h-8 w-8 rounded hover:bg-mushroom-100 hidden lg:flex" type="button">
                                <div className="flex items-center">
                                    <PanelLeftClose  className="text-mushroom-700 transition-colors ease-in-out group-hover/icon-button:!font-iconDefault"></PanelLeftClose>
                                </div>
                                <span className="text-p-lg font-body"></span>
                            </button>
                        </div>
                        <span className="flex items-center gap-x-1">
                            <PanelLeftClose className="flex h-8 w-8 items-center justify-center text-coral-500 lg:hidden"></PanelLeftClose>
                            <p className="text-p-lg font-body text-volcanic-900">Chats</p>
                        </span>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <div aria-expanded="false" aria-haspopup="dialog">
                            <button className="group flex items-center justify-center whitespace-nowrap transition ease-in-out disabled:cursor-not-allowed border border-transparent text-volcanic-900 hover:text-volcanic-800 active:text-volcanic-900 disabled:text-volcanic-700 focus-visible:outline-offset-4 focus-visible:outline-1 focus-visible:outline-volcanic-700 group/icon-button p-0 h-8 w-8 rounded hover:bg-mushroom-100" type="button">
                                <div className="flex items-center">
                                    <TextSearch className="text-mushroom-700 transition-colors ease-in-out"/>
                                </div>
                                <span className="text-p-lg font-body"></span>
                            </button>
                        </div>
                        <div aria-expanded="false" aria-haspopup="dialog">
                            <button 
                                onClick={createNewSession}
                                className="group flex items-center justify-center whitespace-nowrap transition ease-in-out disabled:cursor-not-allowed border border-transparent text-volcanic-900 hover:text-volcanic-800 active:text-volcanic-900 disabled:text-volcanic-700 focus-visible:outline-offset-4 focus-visible:outline-1 focus-visible:outline-volcanic-700 group/icon-button p-0 h-8 w-8 rounded hover:bg-mushroom-100" 
                                type="button"
                            >
                                <div className="flex items-center">
                                    <SquarePen className="text-mushroom-700 transition-colors ease-in-out group-hover/icon-button:!font-iconDefault"/>
                                </div>
                            </button>
                        </div>
                    </div>
                </header>
                
                {/* Sessions List */}
                <div className="flex-1 overflow-y-auto">
                    {sessions.map((session) => (
                        <Link 
                            key={session.sessionId}
                            href={`/chat?session=${session.sessionId}`}
                            className="flex items-center px-3 py-3 hover:bg-mushroom-100 border-b border-marble-400"
                        >
                            <MessageSquare className="w-5 h-5 mr-3 text-mushroom-700" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-volcanic-900 truncate">
                                    {getSessionTitle(session)}
                                </p>
                                <p className="text-xs text-mushroom-700">
                                    {format(new Date(session.createdAt), 'MMM d, yyyy h:mm a')}
                                </p>
                            </div>
                            {session.isActive && (
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                            )}
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}