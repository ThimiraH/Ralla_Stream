"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  VideoCameraIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function EditMoviePage({ params }) {
  // Next.js 15+ Params Unwrap
  const { id } = use(params);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // --- Initial States ---
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoSources: [],
    trailerUrl: "",
    genre: "",
    category: "",
    year: "",
    rating: "",
    type: "movie",
    subtitles: [],
  });

  const [seasons, setSeasons] = useState([]);
  const [cast, setCast] = useState([]);

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // 👇 නිවැරදි කිරීම 1: cache: "no-store" දැම්මා (පරණ Data පෙන්වීම වලක්වන්න)
        const res = await fetch(`/api/movies/${id}`, { cache: "no-store" });
        const data = await res.json();

        if (data.success) {
          const movie = data.data;

          setFormData({
            title: movie.title || "",
            description: movie.description || "",
            thumbnailUrl: movie.thumbnailUrl || "",
            // videoUrl: movie.videoUrl || "",
            videoSources: movie.videoSources || [],
            trailerUrl: movie.trailerUrl || "",
            genre: movie.genre || "",
            category: movie.category || "",
            year: movie.year || "",
            rating: movie.rating || "",
            type: movie.type || "movie",
            subtitles: movie.subtitles || [],
          });

          // Arrays වලට Default [] දානවා (Error එන එක නවතී)
          setSeasons(movie.seasons || []);
          setCast(movie.cast || []);
        } else {
          toast.error("Failed to load movie data");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching data");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) fetchMovieData();
  }, [id]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- Cast Logic ---
  const addActor = () => setCast([...cast, { name: "", image: "" }]);

  const removeActor = (index) => setCast(cast.filter((_, i) => i !== index));

  const handleCastChange = (index, field, value) => {
    const updatedCast = [...cast];
    updatedCast[index][field] = value;
    setCast(updatedCast);
  };

  // --- Seasons Logic ---
  const addSeason = () => setSeasons([...seasons, { seasonNumber: seasons.length + 1, episodes: [] }]);

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

  // 👇 Episode Remove Function (Renumbering එක්ක)
  const removeEpisode = (seasonIndex, episodeIndex) => {
    const updatedSeasons = [...seasons];

    // Episode එක අයින් කරනවා
    updatedSeasons[seasonIndex].episodes = updatedSeasons[seasonIndex].episodes.filter((_, i) => i !== episodeIndex);

    // අංක පිළිවෙලට හදනවා (1, 2, 3...)
    updatedSeasons[seasonIndex].episodes = updatedSeasons[seasonIndex].episodes.map((ep, i) => ({
      ...ep,
      episodeNumber: i + 1
    }));

    setSeasons(updatedSeasons);
  };

  const handleEpisodeChange = (seasonIndex, episodeIndex, field, value) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[seasonIndex].episodes[episodeIndex][field] = value;
    setSeasons(updatedSeasons);
  };

  // Subtitle එකක් අලුතින් එකතු කරන්න
  const addSubtitle = () => {
    setFormData({
      ...formData,
      subtitles: [...(formData.subtitles || []), { label: "", langCode: "", url: "" }]
    });
  };

  // Subtitle එකක් අයින් කරන්න
  const removeSubtitle = (index) => {
    const updatedSubs = formData.subtitles.filter((_, i) => i !== index);
    setFormData({ ...formData, subtitles: updatedSubs });
  };

  // Subtitle විස්තර වෙනස් කරන්න
  const handleSubtitleChange = (index, field, value) => {
    const updatedSubs = [...formData.subtitles];
    updatedSubs[index][field] = value;
    setFormData({ ...formData, subtitles: updatedSubs });
  };

  const handleEpisodeSubtitleChange = (seasonIndex, episodeIndex, subIndex, field, value) => {
    const updatedSeasons = [...seasons];
    // Subtitles array එක නැත්නම් හදනවා
    if (!updatedSeasons[seasonIndex].episodes[episodeIndex].subtitles) {
      updatedSeasons[seasonIndex].episodes[episodeIndex].subtitles = [];
    }
    updatedSeasons[seasonIndex].episodes[episodeIndex].subtitles[subIndex][field] = value;
    setSeasons(updatedSeasons);
  };

  // අලුත් Subtitle Row එකක් එකතු කරන්න
  const addEpisodeSubtitle = (seasonIndex, episodeIndex) => {
    const updatedSeasons = [...seasons];
    if (!updatedSeasons[seasonIndex].episodes[episodeIndex].subtitles) {
      updatedSeasons[seasonIndex].episodes[episodeIndex].subtitles = [];
    }
    updatedSeasons[seasonIndex].episodes[episodeIndex].subtitles.push({ label: "", langCode: "", url: "" });
    setSeasons(updatedSeasons);
  };

  // Subtitle එකක් මකන්න
  const removeEpisodeSubtitle = (seasonIndex, episodeIndex, subIndex) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[seasonIndex].episodes[episodeIndex].subtitles =
      updatedSeasons[seasonIndex].episodes[episodeIndex].subtitles.filter((_, i) => i !== subIndex);
    setSeasons(updatedSeasons);
  };

  const addVideoSource = () => {
    setFormData({
      ...formData,
      videoSources: [...(formData.videoSources || []), { quality: "1080p", url: "" }]
    });
  };

  // Video Source එකක් අයින් කරන්න
  const removeVideoSource = (index) => {
    const updated = formData.videoSources.filter((_, i) => i !== index);
    setFormData({ ...formData, videoSources: updated });
  };

  // Video Source Change
  const handleVideoSourceChange = (index, field, value) => {
    const updated = [...formData.videoSources];
    updated[index][field] = value;
    setFormData({ ...formData, videoSources: updated });
  };

  // 2. Submit Logic (PUT Request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      cast: cast,
      seasons: formData.type === "series" ? seasons : []
    };

    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Updated Successfully! 🎉");
        router.push("/admin/movies");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Error updating movie");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="text-white text-center py-20">Loading Data...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">

      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
          <ArrowLeftIcon className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Edit Content: <span className="text-blue-500">{formData.title}</span></h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic Info */}
        <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 space-y-6">
          <h3 className="text-lg font-bold text-gray-200 border-b border-gray-800 pb-2">Basic Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Title</label>
              <input name="title" required value={formData.title} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none">
                <option value="movie">Movie</option>
                <option value="series">TV Series</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea name="description" required value={formData.description} onChange={handleChange} rows="4" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Thumbnail URL</label>
              <input name="thumbnailUrl" required value={formData.thumbnailUrl} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select name="category" required value={formData.category} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white text-sm">
                <option value="">Select...</option>
                <option value="Hollywood">Hollywood</option>
                <option value="Bollywood">Bollywood</option>
                <option value="K-Drama">K-Drama</option>
                <option value="C-Drama">C-Drama</option>
                <option value="J-Drama">J-Drama</option>
                <option value="Anime">Anime</option>
                <option value="Donghua">Donghua</option>
                <option value="Other Animations">Other Animations</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Genre</label>
              <input name="genre" required value={formData.genre} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <input name="year" value={formData.year} onChange={handleChange} placeholder="Year" className="bg-black border border-gray-700 rounded-lg p-3 text-white text-sm" />
            <input name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating" className="bg-black border border-gray-700 rounded-lg p-3 text-white text-sm" />
          </div>
        </div>

        {/* CAST Section */}
        <div className="bg-[#111] p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4">
            <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2"><UserGroupIcon className="w-5 h-5 text-blue-400" /> Cast & Crew</h3>
            <button type="button" onClick={addActor} className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"><PlusIcon className="w-4 h-4" /> Add Actor</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cast.map((actor, index) => (
              <div key={index} className="flex gap-3 bg-black border border-gray-800 p-3 rounded-xl relative group">
                <div className="w-12 h-12 bg-gray-800 rounded-full overflow-hidden shrink-0 border border-gray-700">
                  {actor.image ? <img src={actor.image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">IMG</div>}
                </div>
                <div className="flex-1 space-y-2">
                  {/* 👇 නිවැරදි කිරීම 2: value={actor.name || ""} දැම්මා */}
                  <input placeholder="Actor Name" className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none" value={actor.name || ""} onChange={(e) => handleCastChange(index, 'name', e.target.value)} />
                  <input placeholder="Photo URL" className="w-full bg-transparent border-b border-gray-700 text-gray-500 text-xs outline-none" value={actor.image || ""} onChange={(e) => handleCastChange(index, 'image', e.target.value)} />
                </div>
                <button type="button" onClick={() => removeActor(index)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><TrashIcon className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Content Logic */}
        {formData.type === "movie" ? (
          <div className="space-y-6">
            {/* VIDEO SOURCES SECTION (New) */}
            <div className="bg-[#111] p-6 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4">
                <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                  <VideoCameraIcon className="w-5 h-5" /> Video Sources
                </h3>
                <button type="button" onClick={addVideoSource} className="text-sm font-bold text-green-500 hover:text-green-400">
                  + Add Quality
                </button>
              </div>

              <div className="space-y-3">
                {formData.videoSources && formData.videoSources.map((source, index) => (
                  <div key={index} className="flex gap-3 items-center bg-black p-3 rounded-xl border border-gray-800">
                    <select
                      className="bg-black border-b border-gray-700 text-white text-sm outline-none pb-1 w-24"
                      value={source.quality}
                      onChange={(e) => handleVideoSourceChange(index, "quality", e.target.value)}
                    >
                      <option value="Auto">Auto</option>
                      <option value="1080p">1080p</option>
                      <option value="720p">720p</option>
                      <option value="540p">540p</option>
                      <option value="480p">480p</option>
                      <option value="360p">360p</option>
                    </select>

                    <input
                      placeholder="Paste Video URL..."
                      className="flex-1 bg-transparent border-b border-gray-700 text-blue-400 text-sm outline-none pb-1"
                      value={source.url}
                      onChange={(e) => handleVideoSourceChange(index, "url", e.target.value)}
                    />

                    <button type="button" onClick={() => removeVideoSource(index)} className="text-red-500 hover:bg-red-900/20 p-2 rounded-lg">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* --- SUBTITLES SECTION --- */}
            <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 mt-6">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4">
                <h3 className="text-lg font-bold text-gray-200">Subtitles / Captions</h3>
                <button type="button" onClick={addSubtitle} className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  + Add Subtitle
                </button>
              </div>

              <div className="space-y-3">
                {formData.subtitles && formData.subtitles.map((sub, index) => (
                  <div key={index} className="flex gap-3 items-center bg-black p-3 rounded-xl border border-gray-800">

                    {/* Language Label (e.g. Sinhala) */}
                    <input
                      placeholder="Label (e.g. Sinhala)"
                      className="w-1/4 bg-transparent border-b border-gray-700 text-white text-sm outline-none pb-1"
                      value={sub.label}
                      onChange={(e) => handleSubtitleChange(index, "label", e.target.value)}
                    />

                    {/* Lang Code (e.g. si) */}
                    <input
                      placeholder="Code (e.g. si, en)"
                      className="w-1/6 bg-transparent border-b border-gray-700 text-gray-400 text-sm outline-none pb-1"
                      value={sub.langCode}
                      onChange={(e) => handleSubtitleChange(index, "langCode", e.target.value)}
                    />

                    {/* URL (Paste R2 Link here) */}
                    <input
                      placeholder="Paste .vtt URL here..."
                      className="flex-1 bg-transparent border-b border-gray-700 text-blue-400 text-sm outline-none pb-1"
                      value={sub.url}
                      onChange={(e) => handleSubtitleChange(index, "url", e.target.value)}
                    />

                    {/* Remove Button */}
                    <button type="button" onClick={() => removeSubtitle(index)} className="text-red-500 hover:bg-red-900/20 p-2 rounded-lg">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!formData.subtitles || formData.subtitles.length === 0) && (
                  <p className="text-gray-600 text-sm text-center">No subtitles added yet.</p>
                )}
              </div>
            </div>
          </div>

        ) : (
          <div className="space-y-6">
            {seasons.map((season, sIndex) => (
              <div key={sIndex} className="bg-[#111] p-6 rounded-2xl border border-gray-800 relative mb-6">
                <h3 className="text-lg font-bold text-purple-400 mb-4">Season {season.seasonNumber}</h3>

                {/* Episodes List */}
                <div className="space-y-4 mb-4 pl-4 border-l-2 border-gray-800">
                  {season.episodes.map((ep, eIndex) => ( // 👈 Loop එක පටන් ගන්න තැන
                    <div key={eIndex} className="relative group bg-black/40 p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition">

                      {/* Delete Episode Button */}
                      <button
                        type="button"
                        onClick={() => removeEpisode(sIndex, eIndex)}
                        className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        title="Remove Episode"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-6">
                        <div className="md:col-span-1">
                          <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Episode {ep.episodeNumber} Title</label>
                          <input
                            placeholder="Title"
                            className="w-full bg-transparent border-b border-gray-700 text-white text-sm focus:border-purple-500 outline-none pb-1"
                            value={ep.title || ""}
                            onChange={(e) => handleEpisodeChange(sIndex, eIndex, 'title', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Video Sources</label>

                          {/* 👇 පරණ Single Input එක අයින් කරලා මේක දාන්න */}
                          <div className="space-y-2">
                            {ep.videoSources && ep.videoSources.map((source, vIndex) => (
                              <div key={vIndex} className="flex gap-2 mb-2 items-center">
                                {/* Quality Select */}
                                <select
                                  className="bg-black border border-gray-700 rounded px-2 py-1 text-xs text-white outline-none w-20"
                                  value={source.quality}
                                  onChange={(e) => {
                                    const updatedSeasons = [...seasons];
                                    updatedSeasons[sIndex].episodes[eIndex].videoSources[vIndex].quality = e.target.value;
                                    setSeasons(updatedSeasons);
                                  }}
                                >
                                  <option value="Auto">Auto</option>
                                  <option value="1080p">1080p</option>
                                  <option value="720p">720p</option>
                                  <option value="480p">480p</option>
                                </select>

                                {/* URL Input */}
                                <input
                                  placeholder="Video URL"
                                  className="flex-1 bg-black border border-gray-700 rounded px-2 py-1 text-xs text-blue-400 outline-none"
                                  value={source.url}
                                  onChange={(e) => {
                                    const updatedSeasons = [...seasons];
                                    updatedSeasons[sIndex].episodes[eIndex].videoSources[vIndex].url = e.target.value;
                                    setSeasons(updatedSeasons);
                                  }}
                                />

                                {/* Remove Source Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedSeasons = [...seasons];
                                    updatedSeasons[sIndex].episodes[eIndex].videoSources =
                                      updatedSeasons[sIndex].episodes[eIndex].videoSources.filter((_, i) => i !== vIndex);
                                    setSeasons(updatedSeasons);
                                  }}
                                  className="text-red-500 hover:text-red-400 p-1"
                                >
                                  <TrashIcon className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Add Source Button for Episode */}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedSeasons = [...seasons];
                              if (!updatedSeasons[sIndex].episodes[eIndex].videoSources) {
                                updatedSeasons[sIndex].episodes[eIndex].videoSources = [];
                              }
                              updatedSeasons[sIndex].episodes[eIndex].videoSources.push({ quality: "1080p", url: "" });
                              setSeasons(updatedSeasons);
                            }}
                            className="text-[10px] text-green-500 font-bold mt-1 flex items-center gap-1"
                          >
                            + Add Video Source
                          </button>
                        </div>
                      </div>

                      {/* 👇 Subtitle Section එක Loop එක ඇතුලටම ගත්තා */}
                      <div className="mt-4 bg-gray-900 p-3 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs text-gray-400 font-bold uppercase">Episode Subtitles</label>
                          <button
                            type="button"
                            onClick={() => addEpisodeSubtitle(sIndex, eIndex)}
                            className="text-[10px] bg-blue-600 px-2 py-1 rounded text-white hover:bg-blue-500"
                          >
                            + Add Sub
                          </button>
                        </div>

                        {ep.subtitles && ep.subtitles.map((sub, subIndex) => (
                          <div key={subIndex} className="flex gap-2 mb-2 items-center">
                            <input
                              placeholder="Label (Si)"
                              className="w-20 bg-black border border-gray-700 rounded px-2 py-1 text-xs text-white"
                              value={sub.label}
                              onChange={(e) => handleEpisodeSubtitleChange(sIndex, eIndex, subIndex, "label", e.target.value)}
                            />
                            <input
                              placeholder="Lang (si)"
                              className="w-14 bg-black border border-gray-700 rounded px-2 py-1 text-xs text-white"
                              value={sub.langCode}
                              onChange={(e) => handleEpisodeSubtitleChange(sIndex, eIndex, subIndex, "langCode", e.target.value)}
                            />
                            <input
                              placeholder="Subtitle URL (.vtt)"
                              className="flex-1 bg-black border border-gray-700 rounded px-2 py-1 text-xs text-blue-400"
                              value={sub.url}
                              onChange={(e) => handleEpisodeSubtitleChange(sIndex, eIndex, subIndex, "url", e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => removeEpisodeSubtitle(sIndex, eIndex, subIndex)}
                              className="text-red-500 hover:text-red-400 p-1"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))} {/* 👈 Loop එක ඉවර වෙන්නේ මෙතනින් */}
                </div>

                <button type="button" onClick={() => addEpisode(sIndex)} className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" /> Add Episode
                </button>
              </div>
            ))}

            {/* Add New Season Button */}
            <button type="button" onClick={addSeason} className="w-full py-4 border-2 border-dashed border-gray-800 rounded-2xl text-gray-400 hover:border-gray-600 hover:text-white font-bold transition flex flex-col items-center gap-2">
              <PlusIcon className="w-6 h-6" /> Add New Season
            </button>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-green-600/20 transition disabled:opacity-50">
            {loading ? "Updating..." : "Update Content"}
          </button>
        </div>

      </form>
    </div>
  );
}