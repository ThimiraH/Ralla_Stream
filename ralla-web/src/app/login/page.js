"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
      toast.error("Invalid Email or Password!");
      setLoading(false);
    } else {
      toast.success("Login Successful!");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden pt-15">

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full  max-w-md bg-black/40 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 mb-2">
            RALLA
          </h1>
          <p className="text-gray-400 text-sm">Welcome back! Please login to continue watching.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs uppercase font-bold ml-1 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase font-bold ml-1 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition pr-10"
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-blue-400 transition">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6  pt-6">
          
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-700 flex-1"></div>
            <span className="text-gray-500 text-xs uppercase">Or continue with</span>
            <div className="h-px bg-gray-700 flex-1"></div>
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl: "/" })}
            className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
            Continue with Google
          </button>
        </div>

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