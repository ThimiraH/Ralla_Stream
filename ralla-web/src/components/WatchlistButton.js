"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { PlusIcon, CheckIcon } from "@heroicons/react/24/solid";

export default function WatchlistButton({ movieId }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [checking, setChecking] = useState(true); // මුලින්ම check කරනවා

  // 1. Page Load වෙද්දී check කරනවා මේක දැනටමත් ලිස්ට් එකේ තියෙනවද කියලා
  useEffect(() => {
    const checkStatus = async () => {
      if (session?.user) {
        try {
          const res = await fetch("/api/watchlist");
          const data = await res.json();
          // එන ලිස්ට් එකේ අපේ movieId එක තියෙනවද බලනවා
          if (data.watchlist.includes(movieId)) {
            setAdded(true);
          }
        } catch (error) {
          console.error("Error checking watchlist", error);
        }
      }
      setChecking(false);
    };

    checkStatus();
  }, [session, movieId]);

  const handleToggle = async () => {
    if (!session) {
      toast.error("Please login to create a list");
      router.push("/login");
      return;
    }

    // Optimistic Update (API එක එන්න කලින් පාට මාරු කරනවා වේගවත් බව පෙන්වන්න)
    const previousState = added;
    setAdded(!previousState); 

    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Error එකක් ආවොත් ආපහු පරණ විදිහට දානවා
        setAdded(previousState);
        toast.error(data.message);
      } else {
        if (data.added) {
            toast.success("Added to My List ✅");
        } else {
            toast.success("Removed from My List ❌");
        }
        router.refresh();
      }
    } catch (error) {
      setAdded(previousState);
      toast.error("Something went wrong");
    }
  };

  if (checking) {
    // Check කරන අතරතුර පොඩි Loading එකක්
    return (
        <button className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-gray-800/50 text-gray-500 border border-gray-700 cursor-wait">
            <span className="w-4 h-4 rounded-full border-2 border-gray-500 border-t-transparent animate-spin"></span>
            Wait..
        </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 ${
        added
          ? "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/20"
          : "bg-gray-800/80 text-white hover:bg-gray-700 border border-gray-600 backdrop-blur-md"
      }`}
    >
      {added ? (
        <>
          <CheckIcon className="w-5 h-5" />
          <span>My List</span>
        </>
      ) : (
        <>
          <PlusIcon className="w-5 h-5" />
          <span>My List</span>
        </>
      )}
    </button>
  );
}