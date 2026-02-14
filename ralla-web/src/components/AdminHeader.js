"use client";

import { useSession } from "next-auth/react";

export default function AdminHeader() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="flex justify-between items-center bg-[#111] border-b border-gray-800 px-8 py-4 mb-6">
      
      {/* වම් පැත්ත: Title එක (Dashboard එකේ Title එක වෙනුවට මෙතන පොදු නමක් දාන්න පුළුවන්) */}
      <div>
        <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Admin Control Panel</h2>
      </div>

      {/* දකුණු පැත්ත: Logged In Admin Profile */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <p className="text-white text-sm font-bold">{session.user.name}</p>
          <p className="text-xs text-blue-400 font-medium">Administrator</p>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-blue-600 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                {session.user.image ? (
                    <img 
                        src={session.user.image} 
                        alt="Admin" 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    <span className="text-white font-bold text-lg">
                        {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}