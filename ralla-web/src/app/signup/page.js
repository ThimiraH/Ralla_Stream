"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast'; // Popup
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // Icons

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Password Toggle

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong"); // Error Popup
        setLoading(false);
      } else {
        toast.success("Account Created Successfully! Please Login."); // Success Popup
        router.push('/login');
      }
    } catch (err) {
      toast.error("Network Error. Try again.");
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

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-gray-400 text-xs uppercase font-bold ml-1 mb-1 block">Full Name</label>
                <input 
                    type="text" 
                    name="name"
                    placeholder="John Doe"
                    className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
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
                    className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                    onChange={handleChange}
                    required
                />
            </div>
            
            {/* Password Field with Eye Icon */}
            <div>
                <label className="text-gray-400 text-xs uppercase font-bold ml-1 mb-1 block">Password</label>
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a password"
                        className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition pr-10"
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition cursor-pointer"
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 mt-4 cursor-pointer"
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