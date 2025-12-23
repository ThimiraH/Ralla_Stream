"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react"; // 1. Session විස්තර ගන්න
import { BellIcon } from "@heroicons/react/24/outline";
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession(); // User ඉන්නවද බලනවා
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false); // Profile Menu එකට
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Live Search Logic (කලින් එකමයි)
    useEffect(() => {
        const fetchResults = async () => {
            if (searchQuery.length > 1) {
                try {
                    const res = await fetch(`/api/search?q=${searchQuery}`);
                    const data = await res.json();
                    if (data.success) {
                        setResults(data.data);
                        setShowDropdown(true);
                    }
                } catch (error) {
                    console.error("Search error", error);
                }
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        };
        const timeoutId = setTimeout(() => fetchResults(), 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowDropdown(false);
            router.push(`/search?q=${searchQuery}`);
        }
    };


    const [notifications, setNotifications] = useState([]);
    const [showNotiDropdown, setShowNotiDropdown] = useState(false);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Notifications Fetch කරන්න (සෑම තත්පර 30කට වරක් හෝ Page load එකේදී)
    useEffect(() => {
        if (session) {
            const fetchNoti = async () => {
                const res = await fetch("/api/notifications");
                const data = await res.json();
                setNotifications(data);
            };
            fetchNoti();
            // Optional: Realtime ඕන නම් interval එකක් දාන්න
        }
    }, [session]);

    const handleNotiClick = async () => {
        setShowNotiDropdown(!showNotiDropdown);
        if (unreadCount > 0) {
            // Mark as read
            await fetch("/api/notifications", { method: "PUT" });
            // UI update (local)
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        }
    };

    if (pathname && pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-8 py-3 transition-colors duration-300 ease-in-out
      ${isScrolled ? "bg-black shadow-xl" : "bg-linear-to-b from-black/90 via-black/60 to-transparent"}`}
        >

            {/* --- LEFT SECTION --- */}
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-15 h-15">
                        <Image src="/Ralla-Logo.png" alt="Rella Logo" fill className="object-contain" />
                    </div>
                    <span className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
                        RALLA
                    </span>
                </Link>

                <div className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-gray-200">
                    <Link href="/" className="hover:text-blue-400 transition">Home</Link>
                    <Link href="/category/TV Series" className="hover:text-blue-400 transition">TV Series</Link>
                    <Link href="/category/movie" className="hover:text-blue-400 transition">Movies</Link>
                    <Link href="/category/anime" className="hover:text-blue-400 transition">Anime</Link>
                    <Link href="/category/variety" className="hover:text-blue-400 transition">Variety</Link>
                    <Link href="/category/News & Updates" className="hover:text-blue-400 transition">News & Updates</Link>
                </div>
            </div>

            {/* --- CENTER: Search --- */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
                <form onSubmit={handleSearchSubmit} className="w-full">
                    <input
                        type="text"
                        placeholder="Search a show..."
                        className={`w-full border text-white rounded-full py-2 pl-5 pr-12 focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400
                ${isScrolled ? "bg-gray-900 border-gray-700" : "bg-black/50 border-gray-500"}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        onFocus={() => searchQuery.length > 1 && setShowDropdown(true)}
                    />
                    <button type="submit" className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 flex items-center justify-center transition cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                    </button>
                </form>

                {showDropdown && results.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-[#111] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-60">
                        {results.map((movie) => (
                            <div
                                key={movie._id}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    router.push(`/movie/${movie._id}`);
                                    setShowDropdown(false);
                                }}
                                className="flex items-center gap-3 p-3 hover:bg-gray-800 transition border-b border-gray-800 last:border-none cursor-pointer"
                            >
                                <div className="relative w-10 h-14 shrink-0 bg-gray-700 rounded overflow-hidden">
                                    <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-medium text-sm line-clamp-1">{movie.title}</span>
                                    <span className="text-gray-500 text-xs">{movie.year} • {movie.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- RIGHT SECTION: Auth & Profile --- */}
            <div className="flex items-center gap-5 text-gray-300">

                <button className="hidden sm:block hover:text-white transition cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                </button>

                {/* Notification Bell */}
                {session && (
                    <div className="relative">
                        <button onClick={handleNotiClick} className="relative p-2 text-gray-300 hover:text-white transition">
                            <BellIcon className="w-6 h-6 cursor-pointer" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-black"></span>
                            )}
                        </button>

                        {/* Dropdown */}
                        {showNotiDropdown && (
                            <div className="absolute right-0 mt-3 w-80 bg-[#181818] border border-gray-700 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                                <div className="px-4 py-2 border-b border-gray-700 text-sm font-bold text-white">Notifications</div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n._id} onClick={() => router.push(`/movie/${n.movieId}`)} className="px-4 py-3 hover:bg-gray-700/50 cursor-pointer flex gap-3 border-b border-gray-800 last:border-none">
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 shrink-0 flex items-center justify-center">
                                                    {n.sender.image ? (
                                                        <img src={n.sender.image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        // Default Avatar (නමේ මුල් අකුර)
                                                        <span className="text-sm font-bold text-white">
                                                            {n.sender.name?.charAt(0).toUpperCase() || "?"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-200">
                                                        <span className="font-bold">{n.sender.name}</span> {n.text}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <Link href="/mylist" className="hidden sm:flex flex-col items-center group hover:text-white transition cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:fill-current">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                </Link>

                {/* VIP Badge */}
                <button className="flex items-center gap-1 text-[#E5B54D] hover:text-[#ffd670] transition font-bold text-sm cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" /></svg>
                    <span>VIP</span>
                </button>

                {/* AUTH LOGIC START */}
                {status === "loading" ? (
                    // Loading State (පුංචි රවුමක් කැරකෙන්න)
                    <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
                ) : session ? (
                    // 1. LOGIN වෙලා නම් (Profile Image පෙන්නනවා)
                    <div className="relative">
                        <div
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 p-0.5 cursor-pointer hover:scale-105 transition"
                        >
                            <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                {session.user.image ? (
                                    <img src={session.user.image}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                                        {session.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-3 w-48 bg-[#111] border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                                <div className="px-4 py-2 border-b border-gray-800">
                                    <p className="text-white text-sm font-bold truncate">{session.user.name}</p>
                                    <p className="text-gray-500 text-xs truncate">{session.user.email}</p>
                                </div>
                                {session.user.role === 'admin' && (
                                    <Link href="/admin" className="block px-4 py-2 text-sm text-green-400 hover:bg-gray-800">Admin Panel</Link>
                                )}
                                <button
                                    onClick={() => signOut()}
                                    className="w-full cursor-pointer text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // 2. LOGIN වෙලා නැත්නම් (Login Button එක)
                    <Link
                        href="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full text-sm font-bold transition shadow-lg"
                    >
                        Login
                    </Link>
                )}
                {/* AUTH LOGIC END */}

            </div>
        </nav>
    );
}