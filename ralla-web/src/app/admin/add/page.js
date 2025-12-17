"use client";

import React, { useState } from 'react';

export default function AddMoviePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    year: '',
    genre: '',
    category: 'movie', // Default select
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Input වෙනස් වෙද්දී State එක update කිරීම
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form එක Submit කළාම
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Movie Uploaded Successfully!');
        // Form එක clear කරන්න
        setFormData({ title: '', description: '', videoUrl: '', thumbnailUrl: '', year: '', genre: '', category: 'movie' });
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-[#111] p-8 rounded-xl border border-gray-800 shadow-2xl">
        
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">Admin Panel - Upload Movie</h1>

        {message && (
            <div className={`p-4 mb-4 rounded text-center font-bold ${message.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
                {message}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Movie Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required 
                className="w-full bg-black/50 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none" placeholder="e.g. Avatar: The Way of Water" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4"
                className="w-full bg-black/50 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none" placeholder="Movie plot..."></textarea>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm text-gray-400 mb-1">Thumbnail URL (Image)</label>
                <input type="text" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} required 
                    className="w-full bg-black/50 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none" placeholder="https://..." />
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-1">Video URL (MP4/Stream)</label>
                <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} required 
                    className="w-full bg-black/50 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none" placeholder="https://..." />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
                <label className="block text-sm text-gray-400 mb-1">Year</label>
                <input type="text" name="year" value={formData.year} onChange={handleChange} 
                    className="w-full bg-black/50 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none" placeholder="2023" />
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-1">Genre</label>
                <input type="text" name="genre" value={formData.genre} onChange={handleChange} 
                    className="w-full bg-black/50 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none" placeholder="Action, Sci-Fi" />
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} 
                    className="w-full bg-black/50 border border-gray-700 rounded p-3 focus:border-blue-500 outline-none">
                    <option value="movie">Movie</option>
                    <option value="series">TV Series</option>
                    <option value="drama">Drama</option>
                    <option value="anime">Anime</option>
                </select>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition mt-4 disabled:opacity-50">
            {loading ? 'Uploading...' : 'Upload Movie'}
          </button>

        </form>
      </div>
    </div>
  );
}