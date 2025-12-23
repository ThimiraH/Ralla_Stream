"use client";
import { useState } from "react";
import Image from "next/image";

export default function InfoTabs({ description, cast }) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="bg-[#111] rounded-xl overflow-hidden border border-gray-800 flex flex-col h-[350px]">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("description")}
          className={`flex-1 py-3 text-sm font-bold transition-all relative ${
            activeTab === "description" ? "text-blue-500" : "text-gray-400 hover:text-white"
          }`}
        >
          Description
          {activeTab === "description" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("cast")}
          className={`flex-1 py-3 text-sm font-bold transition-all relative ${
            activeTab === "cast" ? "text-blue-500" : "text-gray-400 hover:text-white"
          }`}
        >
          Cast
          {activeTab === "cast" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent flex-1">
        {activeTab === "description" ? (
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {description}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* Dummy Cast Data if not provided */}
            {(cast && cast.length > 0 ? cast : [
                { name: "Sung Jin-Woo", role: "Main Character", img: "/placeholder.jpg" },
                { name: "Cha Hae-In", role: "Hunter", img: "/placeholder.jpg" }
            ]).map((actor, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-800/50 p-2 rounded-lg">
                 <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden shrink-0">
                    {/* Image එකක් නැත්නම් අකුරක් පෙන්වමු */}
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {actor.name.charAt(0)}
                    </div>
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-200">{actor.name}</p>
                    <p className="text-[10px] text-gray-500">{actor.role || "Cast"}</p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}