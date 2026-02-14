"use client";

import VideoPlayer from "@/components/VideoPlayer"; // ඔයාගේ component path එක හරියට දාන්න

export default function TestPlayerPage() {
  
  // 1. මේ තියෙන්නේ Sample Videos (Internet එකේ තියෙන Free ඒවා)
  // Quality මාරු වෙනවද බලන්න මම වීඩියෝ වර්ග දෙකක් දැම්මා.
  const sampleSources = [
    { 
      quality: "1080p (Big Buck Bunny)", 
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
    },
    { 
      quality: "720p (Elephants Dream)", 
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" 
    }
  ];

  // 2. මේ තියෙන්නේ අපි අර public folder එකේ හදපු Subtitle එක
  const sampleSubtitles = [
    { 
      label: "Sinhala", 
      langCode: "si", 
      url: "/subs/test.vtt" // public folder එකේ path එක
    },
    {
      label: "English",
      langCode: "en",
      url: "/subs/test.vtt" // Test එකට එකම ෆයිල් එක දාමු
    }
  ];

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl aspect-video">
        <h1 className="text-white text-2xl font-bold mb-4">Video Player Test</h1>
        
        {/* Player එක Render කිරීම */}
        <VideoPlayer 
            sources={sampleSources} 
            subtitles={sampleSubtitles}
            poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg"
        />

        <p className="text-gray-400 mt-4 text-sm">
           Settings icon එක click කරලා Quality සහ Subtitles මාරු කරලා බලන්න.
        </p>
      </div>
    </div>
  );
}