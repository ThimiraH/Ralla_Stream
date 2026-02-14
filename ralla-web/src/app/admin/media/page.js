"use client";

import { useState, useEffect } from "react";
import { 
  CloudArrowUpIcon, 
  ClipboardDocumentCheckIcon, 
  ClipboardIcon, 
  TrashIcon,
  CheckCircleIcon // Success icon added
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import axios from "axios"; // Axios අනිවාර්යයි

export default function MediaManagerPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Progress එකට අලුත් State එකක්
  const [recentUploads, setRecentUploads] = useState([]);

  // LocalStorage Load
  useEffect(() => {
    const saved = localStorage.getItem("ralla_uploads");
    if (saved) setRecentUploads(JSON.parse(saved));
  }, []);

  // File Upload Logic
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0); // Reset Progress

    // Toast ID එකක් තියාගන්නවා update කරන්න
    const toastId = toast.loading("Starting upload...");

    try {
      // 1. Get Presigned URL (Metadata යවනවා)
      // මේක පොඩි request එකක් නිසා fetch පාවිච්චි කිරීමේ ගැටළුවක් නෑ
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      
      if (!res.ok) throw new Error("Failed to get upload URL");
      
      const { uploadUrl, publicUrl } = await res.json();

      // 2. Upload to R2 using AXIOS (Progress ගන්න මේක ඕන)
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      // Upload ඉවර වුනාම
      toast.success("Upload Successful!", { id: toastId });
      
      const newFile = {
          id: Date.now(),
          url: publicUrl,
          name: file.name,
          type: file.type.startsWith("image") ? "image" : "video",
          date: new Date().toLocaleString()
      };

      const updatedList = [newFile, ...recentUploads];
      setRecentUploads(updatedList);
      localStorage.setItem("ralla_uploads", JSON.stringify(updatedList));

    } catch (error) {
      console.error(error);
      toast.error("Upload Failed", { id: toastId });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = null; 
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Link Copied! 📋");
  };

  const clearHistory = () => {
    if(confirm("Clear upload history?")) {
        setRecentUploads([]);
        localStorage.removeItem("ralla_uploads");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Media Manager</h1>
            <p className="text-gray-400 text-sm">Upload files via Direct R2 Upload (Unlimited Size).</p>
        </div>
        {recentUploads.length > 0 && (
            <button onClick={clearHistory} className="text-red-500 text-xs hover:text-red-400 flex items-center gap-1">
                <TrashIcon className="w-4 h-4" /> Clear History
            </button>
        )}
      </div>

      {/* --- UPLOAD AREA --- */}
      <div className={`bg-[#111] border-2 border-dashed rounded-2xl p-10 text-center transition group relative mb-10 ${uploading ? 'border-blue-500 bg-blue-900/10' : 'border-gray-700 hover:border-blue-500'}`}>
        
        {/* Disable input while uploading */}
        <input 
            type="file" 
            onChange={handleUpload} 
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center gap-4 relative z-10">
            {/* Icon & Progress Circle */}
            <div className={`p-4 rounded-full transition ${uploading ? 'bg-transparent' : 'bg-gray-800 text-blue-500 group-hover:bg-blue-600 group-hover:text-white'}`}>
                {uploading ? (
                   // Percentage Display
                   <div className="relative flex items-center justify-center w-16 h-16">
                        <svg className="animate-spin h-full w-full text-blue-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="absolute text-xs font-bold text-white">{uploadProgress}%</span>
                   </div>
                ) : (
                    <CloudArrowUpIcon className="w-8 h-8" />
                )}
            </div>

            <div>
                <h3 className="text-lg font-bold text-white">
                    {uploading ? `Uploading... ${uploadProgress}%` : "Click to Upload File"}
                </h3>
                
                {/* Progress Bar (Visual) */}
                {uploading ? (
                    <div className="w-64 h-2 bg-gray-700 rounded-full mt-3 overflow-hidden">
                        <div 
                            className="h-full bg-blue-500 transition-all duration-300 ease-out" 
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">Supports Large Videos & Images</p>
                )}
            </div>
        </div>
      </div>

      {/* --- RECENT UPLOADS LIST --- */}
      <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Recent Uploads</h3>
      
      <div className="space-y-4">
        {recentUploads.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No files uploaded recently.</p>
        ) : (
            recentUploads.map((file) => (
                <div key={file.id} className="bg-[#111] border border-gray-800 p-4 rounded-xl flex items-center gap-4 hover:border-gray-600 transition">
                    
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-black rounded-lg overflow-hidden shrink-0 border border-gray-700 flex items-center justify-center relative group/thumb">
                        {file.type === "image" ? (
                            <img src={file.url} alt="Thumb" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-gray-500 font-bold border border-gray-600 px-2 py-1 rounded">VIDEO</span>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-bold truncate">{file.name}</p>
                        <p className="text-blue-400 text-xs truncate mt-1">{file.url}</p>
                        <p className="text-gray-600 text-[10px] mt-1">{file.date}</p>
                    </div>

                    {/* Copy Button */}
                    <button 
                        onClick={() => copyToClipboard(file.url)}
                        className="p-3 bg-gray-800 hover:bg-blue-600 text-white rounded-xl transition flex items-center gap-2"
                        title="Copy Link"
                    >
                        <ClipboardIcon className="w-5 h-5" />
                        <span className="text-xs font-bold hidden md:block">Copy</span>
                    </button>
                </div>
            ))
        )}
      </div>

    </div>
  );
}