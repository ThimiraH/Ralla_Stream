"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  TrashIcon, 
  VideoCameraIcon,
  UserGroupIcon // Cast Icon
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function AddMoviePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- Main Form State ---
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "", // For Movies
    trailerUrl: "",
    genre: "",
    category: "",
    year: new Date().getFullYear().toString(),
    rating: "",
    type: "movie", // default: movie තියෙන්නේ 
  });

  // --- Series State ---
  const [seasons, setSeasons] = useState([]);

  // --- Cast State (New Update) ---
  const [cast, setCast] = useState([]);

  // Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- Cast Functions ---
  const addActor = () => {
    setCast([...cast, { name: "", image: "" }]);
  };

  const removeActor = (index) => {
    const updatedCast = cast.filter((_, i) => i !== index);
    setCast(updatedCast);
  };

  const handleCastChange = (index, field, value) => {
    const updatedCast = [...cast];
    updatedCast[index][field] = value;
    setCast(updatedCast);
  };

    // --- Seasons & Episodes Logic ---

    // 1. අලුත් Season එකක් එකතු කිරීම
  const addSeason = () => {
    setSeasons([...seasons, { seasonNumber: seasons.length + 1, episodes: [] }]);
  };

  // 2. Season එකකට Episode එකක් එකතු කිරීම
  const addEpisode = (seasonIndex) => {
    const updatedSeasons = [...seasons];
    const episodeCount = updatedSeasons[seasonIndex].episodes.length + 1;
    updatedSeasons[seasonIndex].episodes.push({
      episodeNumber: episodeCount,
      title: "",
      videoUrl: "",
      runtime: ""
    });
    setSeasons(updatedSeasons);
  };

  // 3. Episode Data Change කිරීම
  const handleEpisodeChange = (seasonIndex, episodeIndex, field, value) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[seasonIndex].episodes[episodeIndex][field] = value;
    setSeasons(updatedSeasons);
  };

  // 4. Submit to Database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Data ලෑස්ති කරගන්නවා
    const payload = {
        ...formData,
        cast: cast, // Cast Data යවනවා
        seasons: formData.type === "series" ? seasons : []
    };

    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Successfully Created! 🎉");
        router.push("/admin/movies");// List එකට ආපහු යවනවා
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
            <ArrowLeftIcon className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Add New Content</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Basic Info */}
        <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 space-y-6">
            <h3 className="text-lg font-bold text-gray-200 border-b border-gray-800 pb-2">Basic Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Title</label>
                    <input name="title" required onChange={handleChange} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="e.g. Solo Leveling" />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Type</label>
                    <select name="type" onChange={handleChange} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none">
                        <option value="movie">Movie</option>
                        <option value="series">TV Series</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea name="description" required onChange={handleChange} rows="4" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="Enter plot summary..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Thumbnail URL</label>
                    <input name="thumbnailUrl" required onChange={handleChange} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white text-sm" placeholder="https://..." />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Category</label>
                    <select name="category" required onChange={handleChange} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white text-sm">
                        <option value="">Select...</option>
                                {/* Western / Mainstream */}
                                <option value="Hollywood">Hollywood</option>
                                <option value="Bollywood">Bollywood</option>

                                {/* Asian Dramas */}
                                <option value="K-Drama">K-Drama</option>
                                <option value="C-Drama">C-Drama</option>
                                <option value="J-Drama">J-Drama</option>

                                {/* Animations */}
                                <option value="Anime">Anime</option>
                                <option value="Donghua">Donghua</option>
                                <option value="Other Animations">Other Animations</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Genre</label>
                    <input name="genre" required onChange={handleChange} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white text-sm" placeholder="Action, Fantasy..." />
                </div>
            </div>

             <div className="grid grid-cols-2 gap-6">
                 <input name="year" onChange={handleChange} placeholder="Year (2025)" className="bg-black border border-gray-700 rounded-lg p-3 text-white text-sm" />
                 <input name="rating" onChange={handleChange} placeholder="Rating (8.5)" className="bg-black border border-gray-700 rounded-lg p-3 text-white text-sm" />
             </div>
        </div>

        {/* 2. CAST SECTION  */}
        <div className="bg-[#111] p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4">
                <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-blue-400" /> Cast & Crew
                </h3>
                <button type="button" onClick={addActor} className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    <PlusIcon className="w-4 h-4" /> Add Actor
                </button>
            </div>

            {cast.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No actors added yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cast.map((actor, index) => (
                        <div key={index} className="flex gap-3 bg-black border border-gray-800 p-3 rounded-xl relative group">
                            <div className="w-12 h-12 bg-gray-800 rounded-full overflow-hidden shrink-0 border border-gray-700">
                                {actor.image ? (
                                    <img src={actor.image} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">IMG</div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <input 
                                    placeholder="Actor Name" 
                                    className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none focus:border-blue-500 pb-1"
                                    value={actor.name}
                                    onChange={(e) => handleCastChange(index, 'name', e.target.value)}
                                />
                                <input 
                                    placeholder="Photo URL" 
                                    className="w-full bg-transparent border-b border-gray-700 text-gray-500 text-xs outline-none focus:border-blue-500 pb-1"
                                    value={actor.image}
                                    onChange={(e) => handleCastChange(index, 'image', e.target.value)}
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={() => removeActor(index)}
                                className="absolute top-2 right-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

         {/* 2. Content Logic (Movie vs Series) */}
        {formData.type === "movie" ? (
             <div className="bg-[#111] p-6 rounded-2xl border border-gray-800">
                <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <VideoCameraIcon className="w-5 h-5" /> Movie Source
                </h3>
                <label className="block text-sm text-gray-400 mb-2">Video URL</label>
                <input name="videoUrl" required onChange={handleChange} className="w-full bg-black border border-blue-900/50 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="https://..." />
             </div>
        ) : (
            // --- SERIES Input (Dynamic) ---
             <div className="space-y-6">
                 {seasons.map((season, sIndex) => (
                     <div key={sIndex} className="bg-[#111] p-6 rounded-2xl border border-gray-800 relative">
                         <h3 className="text-lg font-bold text-purple-400 mb-4">Season {season.seasonNumber}</h3>
                         
                          {/* Episodes List */}
                         <div className="space-y-4 mb-4 pl-4 border-l-2 border-gray-800">
                             {season.episodes.map((ep, eIndex) => (
                                 <div key={eIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/50 p-4 rounded-lg">
                                     <div className="md:col-span-1">
                                         <input 
                                            placeholder={`Ep ${ep.episodeNumber} Title`} 
                                            className="w-full bg-transparent border-b border-gray-700 text-white text-sm focus:border-purple-500 outline-none pb-1"
                                            onChange={(e) => handleEpisodeChange(sIndex, eIndex, 'title', e.target.value)}
                                         />
                                     </div>
                                     <div className="md:col-span-2">
                                         <input 
                                            placeholder="Video URL" 
                                            className="w-full bg-transparent border-b border-gray-700 text-gray-400 text-sm focus:border-purple-500 outline-none pb-1"
                                            onChange={(e) => handleEpisodeChange(sIndex, eIndex, 'videoUrl', e.target.value)}
                                         />
                                     </div>
                                 </div>
                             ))}
                         </div>

                         {/* Add Episode Button */}
                         <button type="button" onClick={() => addEpisode(sIndex)} className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-2">
                             <PlusIcon className="w-4 h-4" /> Add Episode
                         </button>
                     </div>
                 ))}

                 {/* Add Season Button */}
                 <button type="button" onClick={addSeason} className="w-full py-4 border-2 border-dashed border-gray-800 rounded-2xl text-gray-400 hover:border-gray-600 hover:text-white font-bold transition flex flex-col items-center gap-2">
                     <PlusIcon className="w-6 h-6" /> Add New Season
                 </button>
             </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-4">
            <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
            >
                {loading ? "Saving..." : "Publish Content"}
            </button>
        </div>

      </form>
    </div>
  );
}