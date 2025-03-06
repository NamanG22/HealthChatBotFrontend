"use client";
import Link from 'next/link'
import { TextSearch } from 'lucide-react';
import { SquarePen } from 'lucide-react';
import { PanelLeftClose  } from 'lucide-react';
import { useEffect, useState } from "react";

export default function LeftPanel({ onSelectChat }: { onSelectChat: (sessionId: string)=> void}){
    const [chats, setChats] = useState([]);
    const userId = localStorage.getItem("userId");

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URI;

    useEffect(() => {
        const fetchChats = async () => {
        const res = await fetch(`${API_URL}/chats/${userId}`);
        const data = await res.json();
        setChats(data);
        };

        fetchChats();
    }, []);
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
                            <Link className="group flex items-center justify-center whitespace-nowrap transition ease-in-out disabled:cursor-not-allowed border border-transparent text-volcanic-900 hover:text-volcanic-800 active:text-volcanic-900 disabled:text-volcanic-700 focus-visible:outline-offset-4 focus-visible:outline-1 focus-visible:outline-volcanic-700 group/icon-button p-0 h-8 w-8 rounded hover:bg-mushroom-100" target="_self" href="#">
                                <div className="flex items-center">
                                    <SquarePen className="text-mushroom-700 transition-colors ease-in-out group-hover/icon-button:!font-iconDefault"></SquarePen>
                                </div>
                                <span className="text-p-lg font-body"></span>
                            </Link>
                        </div>
                    </div>
                </header>
                {/* <section className="relative flex h-0 flex-grow flex-col overflow-y-auto px-3 pb-4 pt-3 md:pb-8 hide-scrollbar pr-0.5">
                    <button className="group h-fit whitespace-nowrap transition ease-in-out disabled:cursor-not-allowed border rounded-lg border-transparent disabled:text-volcanic-700 focus-visible:outline-offset-4 focus-visible:outline focus-visible:outline-1 focus-visible:outline-volcanic-700 mt-2 flex w-full items-center justify-start p-0 pl-1 text-volcanic-800 hover:text-mushroom-800 active:text-mushroom-800" type="button">
                        <div className="flex items-center mr-2">
                            <i className="icon-default icon-chevron-up text-icon-sm"  ></i>
                        </div>
                        <span className="text-p font-body">
                            <div className="text-label uppercase font-code font-medium">Pinned (0)</div>
                        </span>
                    </button>
                    <div className="mb-3"></div>
                    <button className="group h-fit whitespace-nowrap transition ease-in-out disabled:cursor-not-allowed border rounded-lg border-transparent disabled:text-volcanic-700 focus-visible:outline-offset-4 focus-visible:outline focus-visible:outline-1 focus-visible:outline-volcanic-700 mt-2 flex w-full items-center justify-start p-0 pl-1 text-volcanic-800 hover:text-mushroom-800 active:text-mushroom-800" type="button">
                        <div className="flex items-center mr-2">
                            <i className="icon-default icon-chevron-up text-icon-sm"  ></i>
                        </div>
                        <span className="text-p font-body">
                            <div className="text-label uppercase font-code font-medium">Most Recent (1)</div>
                        </span>
                    </button>
                    <div className="mt-2">
                        <div data-flip-config="{&quot;translate&quot;:true,&quot;scale&quot;:true,&quot;opacity&quot;:true}" data-flip-id="1099bd93-79f9-4909-a1a5-75d9b9839aba" data-portal-key="portal" className="group relative w-full rounded-lg flex items-start gap-x-1 bg-marble-100 transition-colors ease-in-out hover:bg-mushroom-100/20" data-component="ConversationCard" data-source-file="ConversationCard.tsx">
                            <div className="invisible flex items-center group-hover:visible pl-2 pt-3">
                                <label tabindex="0" className="group relative rounded focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-volcanic-900 flex items-center min-h-[14px] min-w-[14px] mt-1">
                                    <input type="checkbox" className="hidden"/>
                                    <span className="absolute flex cursor-pointer items-center justify-center rounded-sm transition-colors duration-200 ease-in-out h-3.5 w-3.5 border border-marble-500 bg-white group-hover:bg-marble-300" role="checkbox" aria-checked="false"></span>
                                </label>
                            </div>
                            <a className="flex w-full flex-col gap-y-1 pr-2 py-3 truncate" href="/c/1099bd93-79f9-4909-a1a5-75d9b9839aba">
                                <div className="flex w-full items-center justify-between gap-x-0.5">
                                    <span className="flex items-center gap-x-1 truncate">
                                        <span className="text-p font-body h-[21px] truncate text-volcanic-800">Current President of the USA</span>
                                    </span>
                                    <div className="flex h-4 w-4 flex-shrink-0"></div>
                                </div>
                                <p className="text-p-sm font-body h-[18px] w-full truncate text-volcanic-600">As of March 2, 2025, Kamala Harris is the President of the United States of America. She assumed office on January 20, 2021, becoming the first woman, the first African American, and the first Asian American to hold the office of the President.</p>
                            </a>
                            <div className="absolute right-3 top-3.5 flex">
                                <div className="flex flex-col" data-element="Menu" data-component="KebabMenu" data-source-file="KebabMenu.tsx" data-headlessui-state="">
                                    <button className="p-0 text-mushroom-800 rounded transition-colors ease-in-out hidden group-hover:flex" id="headlessui-menu-button-:rb:" type="button" aria-haspopup="menu" aria-expanded="false" data-headlessui-state="">
                                        <i className="icon-default icon-kebab"  ></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}
                <ul>
                    {chats.map(chat => (
                    <li
                        key={chat.sessionId}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => onSelectChat(chat.sessionId)}
                    >
                        {chat.title}
                    </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}