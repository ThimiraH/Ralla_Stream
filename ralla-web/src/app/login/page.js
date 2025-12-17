"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // NextAuth එකෙන් Login වෙන Function එක
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc'; // Google Icon

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Input වෙනස් වෙද්දී State එක Update කිරීම
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Email/Password Login Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false, // Page එක Refresh නොවී වැඩේ කරගන්න
      });

      if (res.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push('/'); // Login වුනාම Home Page එකට යවන්න
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  // 2. Google Login Function
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' }); // Google Login වෙලා කෙලින්ම Home එකට යන්න
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600 tracking-tighter mb-2">
                RELLA
            </h1>
            <p className="text-gray-400 text-sm">Welcome back! Please sign in to continue.</p>
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
                {error}
            </div>
        )}

        {/* --- GOOGLE LOGIN BUTTON --- */}
        <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition mb-6 cursor-pointer"
        >
            <FcGoogle size={24} />
            Sign in with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-700 flex-1"></div>
            <span className="text-gray-500 text-xs uppercase">Or continue with</span>
            <div className="h-px bg-gray-700 flex-1"></div>
        </div>

        {/* --- EMAIL FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="••••••••"
                    className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    onChange={handleChange}
                    required
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 mt-2 cursor-pointer"
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account? {' '}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition font-medium">
                Create Account
            </Link>
        </p>

      </div>
    </div>
  );
}