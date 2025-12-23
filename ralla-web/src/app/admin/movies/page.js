"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  MagnifyingGlassIcon 
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function MoviesAdminPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 1. Data Fetching (Database එකෙන් ෆිල්ම් ටික ගන්නවා)
  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/movies"); // මේ API එක අපි හදන්න ඕන (දැනට තිබේ නම් ok)
      const data = await res.json();
      if (data.success) {
        setMovies(data.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // 2. Delete Function
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    try {
      const res = await fetch(`/api/movies?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully!");
        fetchMovies(); // Refresh list
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting");
    }
  };

  // Search Filter
  const filteredMovies = movies.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white">Movies & Series</h2>
            <p className="text-gray-400 text-sm">Manage your content library</p>
        </div>
        <Link 
            href="/admin/movies/add" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-blue-600/20"
        >
            <PlusIcon className="w-5 h-5" />
            Add New
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <input 
            type="text" 
            placeholder="Search movies..." 
            className="w-full bg-[#111] border border-gray-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:border-blue-500 focus:outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table Area */}
      <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
            <div className="p-8 text-center text-gray-500">Loading content...</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/40 text-gray-200 uppercase font-bold text-xs">
                        <tr>
                            <th className="px-6 py-4">Thumbnail</th>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Genre</th>
                            <th className="px-6 py-4">Year</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {filteredMovies.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No movies found.</td>
                            </tr>
                        ) : (
                            filteredMovies.map((movie) => (
                                <tr key={movie._id} className="hover:bg-gray-800/50 transition group">
                                    <td className="px-6 py-3">
                                        <div className="w-12 h-16 bg-gray-700 rounded overflow-hidden">
                                            <img src={movie.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 font-medium text-white text-base">
                                        {movie.title}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                            movie.type === 'series' 
                                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                        }`}>
                                            {movie.type || "Movie"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">{movie.genre}</td>
                                    <td className="px-6 py-3">{movie.year}</td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Edit Button */}
                                            <Link href={`/admin/movies/edit/${movie._id}`} className="p-2 hover:bg-gray-700 rounded-lg text-blue-400 transition">
                                                <PencilSquareIcon className="w-5 h-5" />
                                            </Link>
                                            {/* Delete Button */}
                                            <button 
                                                onClick={() => handleDelete(movie._id)} 
                                                className="p-2 hover:bg-red-900/20 rounded-lg text-red-500 transition"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}