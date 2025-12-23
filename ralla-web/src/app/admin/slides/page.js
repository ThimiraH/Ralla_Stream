"use client";

import { useState, useEffect } from "react";
import {
    PhotoIcon,
    VideoCameraIcon,
    TrashIcon,
    PlusIcon,
    CheckCircleIcon,
    PencilSquareIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function SlidesAdminPage() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // Edit Mode State
    const [editingId, setEditingId] = useState(null); // Edit කරන Slide එකේ ID එක

    // Form Data
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "image", // Default 'image'
        imageUrl: "", // Poster or Main Image
        videoUrl: "", // Only for video
        tag: "NEW",
        link: ""
    });

    // 1. Fetch Slides
    const fetchSlides = async () => {
        try {
            const res = await fetch("/api/slides?admin=true"); // Admin=true නිසා Active නැති ඒවාත් එනවා
            const data = await res.json();
            if (data.success) setSlides(data.data);
        } catch (error) {
            console.error("Error", error);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    // 2. Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 3. Edit Click (Form එකට Data පුරවනවා)
    const handleEdit = (slide) => {
        setEditingId(slide._id);
        setFormData({
            title: slide.title,
            description: slide.description,
            type: slide.type,
            imageUrl: slide.imageUrl,
            videoUrl: slide.videoUrl || "",
            tag: slide.tag,
            link: slide.link || ""
        });
        // Form එක තියෙන උඩට Scroll කරනවා
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 4. Cancel Edit
    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: "", description: "", type: "image", imageUrl: "", videoUrl: "", tag: "NEW", link: "" });
    };

    // 5. Submit Form (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const method = editingId ? "PUT" : "POST"; // Edit නම් PUT, නැත්නම් POST
            const payload = editingId ? { ...formData, _id: editingId } : formData;

            const res = await fetch("/api/slides", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                toast.success(editingId ? "Slide Updated! 🔄" : "Slide Added! 🎉");
                cancelEdit(); // Form Reset
                fetchSlides(); // Refresh List
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Error saving slide");
        } finally {
            setLoading(false);
        }
    };

    // 6. Delete Slide
    const handleDelete = async (id) => {
        if (!confirm("Delete this slide?")) return;
        try {
            await fetch(`/api/slides?id=${id}`, { method: "DELETE" });
            toast.success("Deleted");
            fetchSlides();
        } catch (error) {
            toast.error("Error deleting");
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <h2 className="text-3xl font-bold text-white">Hero Slides Manager</h2>

            {/* --- ADD / EDIT FORM --- */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${editingId ? "bg-blue-900/20 border-blue-500/50" : "bg-[#111] border-gray-800"}`}>
                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${editingId ? "text-blue-400" : "text-gray-200"}`}>
                    {editingId ? <PencilSquareIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                    {editingId ? "Edit Slide" : "Add New Slide"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Type Selection (Image vs Video) */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "image" })}
                            className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${formData.type === "image" ? "bg-blue-600 border-blue-600 text-white" : "bg-black border-gray-700 text-gray-400 hover:border-gray-500"
                                }`}
                        >
                            <PhotoIcon className="w-5 h-5" /> Image Slide
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "video" })}
                            className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${formData.type === "video" ? "bg-purple-600 border-purple-600 text-white" : "bg-black border-gray-700 text-gray-400 hover:border-gray-500"
                                }`}
                        >
                            <VideoCameraIcon className="w-5 h-5" /> Video Slide
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input name="title" required value={formData.title} onChange={handleChange} placeholder="Slide Title (e.g. Avatar)" className="bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                        <input name="tag" value={formData.tag} onChange={handleChange} placeholder="Tag (e.g. NEW, TRENDING)" className="bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                    </div>

                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description..." rows="3" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" />

                    {/* Dynamic Inputs based on Type */}
                    <div className="space-y-4 bg-black/30 p-4 rounded-xl border border-gray-800">

                        {formData.type === "video" && (
                            <div>
                                <label className="text-xs text-purple-400 font-bold mb-1 block">VIDEO URL (R2 Link - .mp4)</label>
                                <input name="videoUrl" required value={formData.videoUrl} onChange={handleChange} placeholder="https://..." className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-purple-500" />
                            </div>
                        )}

                        <div>
                            <label className="text-xs text-blue-400 font-bold mb-1 block">
                                {formData.type === "video" ? "POSTER IMAGE URL (Shows while loading)" : "MAIN IMAGE URL"}
                            </label>
                            <input name="imageUrl" required value={formData.imageUrl} onChange={handleChange} placeholder="https://..." className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <input name="link" value={formData.link} onChange={handleChange} placeholder="Click Link (e.g. /movie/123)" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" />

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        {editingId && (
                            <button type="button" onClick={cancelEdit} className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold text-white transition flex items-center gap-2">
                                <XMarkIcon className="w-5 h-5" /> Cancel
                            </button>
                        )}

                        <button type="submit" disabled={loading} className={`${editingId ? "bg-blue-600 hover:bg-blue-500" : "bg-green-600 hover:bg-green-500"} px-8 py-3 rounded-xl font-bold text-white shadow-lg transition disabled:opacity-50 flex items-center gap-2`}>
                            {loading ? "Saving..." : editingId ? "Update Slide" : "Add Slide"}
                        </button>
                    </div>
                </form>
            </div>

            {/* --- EXISTING SLIDES LIST --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fetchLoading ? <p className="text-gray-500">Loading slides...</p> : slides.map((slide) => (
                    <div key={slide._id} className="bg-[#111] rounded-xl overflow-hidden border border-gray-800 group relative">

                        {/* Media Preview */}
                        <div className="h-40 relative">
                            {slide.type === "video" ? (
                                <>
                                    <video src={slide.videoUrl} className="w-full h-full object-cover opacity-50" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <VideoCameraIcon className="w-10 h-10 text-white drop-shadow-lg" />
                                    </div>
                                </>
                            ) : (
                                <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                            )}
                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-bold text-white border border-gray-600 uppercase">
                                {slide.type}
                            </div>
                        </div>

                        <div className="p-4">
                            <h4 className="font-bold text-white text-lg line-clamp-1">{slide.title}</h4>
                            <p className="text-gray-500 text-sm line-clamp-2 mt-1">{slide.description}</p>

                            <div className="flex justify-between items-center mt-4 border-t border-gray-800 pt-3">
                                <span className="text-xs font-bold text-blue-400 bg-blue-900/20 px-2 py-1 rounded">{slide.tag}</span>

                                <div className="flex gap-2">
                                    {/* Edit Button */}
                                    <button onClick={() => handleEdit(slide)} className="text-blue-500 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-900/20" title="Edit">
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>
                                    {/* Delete Button */}
                                    <button onClick={() => handleDelete(slide._id)} className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-900/20" title="Delete">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}