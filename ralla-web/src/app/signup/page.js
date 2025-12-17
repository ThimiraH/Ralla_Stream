"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. අපේ Register API එකට Data යවනවා
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
      } else {
        // 2. Register වුනාම Login Page එකට යවනවා
        router.push('/login');
      }
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600 tracking-tighter mb-2">
                Join RELLA
            </h1>
            <p className="text-gray-400 text-sm">Create an account to start watching.</p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-gray-400 text-xs uppercase font-bold ml-1 mb-1 block">Full Name</label>
                <input 
                    type="text" 
                    name="name"
                    placeholder="John Doe"
                    className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label className="text-gray-400 text-xs uppercase font-bold ml-1 mb-1 block">Email Address</label>
                <input 
                    type="email" 
                    name="email"
                    placeholder="name@example.com"
                    className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label className="text-gray-400 text-xs uppercase font-bold ml-1 mb-1 block">Password</label>
                <input 
                    type="password" 
                    name="password"
                    placeholder="Create a password"
                    className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    onChange={handleChange}
                    required
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 mt-4"
            >
                {loading ? "Creating Account..." : "Sign Up"}
            </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account? {' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 transition font-medium">
                Sign In
            </Link>
        </p>

      </div>
    </div>
  );
}