"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  FilmIcon, 
  UsersIcon, 
  PhotoIcon, 
  ChartBarIcon, 
  ArrowLeftOnRectangleIcon 
} from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: ChartBarIcon },
    { name: "Movies & Series", href: "/admin/movies", icon: FilmIcon },
    { name: "Users", href: "/admin/users", icon: UsersIcon },
    { name: "Hero Slides", href: "/admin/slides", icon: PhotoIcon }, // ඔයා ඉල්ලපු Slide Manager එක
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-[#111] border-r border-gray-800 flex flex-col">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600">
            RALLA <span className="text-xs text-gray-500 font-normal">ADMIN</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout / Back to Site */}
        <div className="p-4 border-t border-gray-800">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition">
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                Back to Site
            </Link>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#111]/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8">
            <h2 className="font-bold text-gray-200">Admin Control Panel</h2>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">
                    A
                </div>
            </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-700">
            {children}
        </div>
      </main>
    </div>
  );
}