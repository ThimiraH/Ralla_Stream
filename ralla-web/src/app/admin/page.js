"use client";

import { useEffect, useState } from "react";
import { 
  UsersIcon, 
  FilmIcon, 
  TvIcon, 
  PhotoIcon,
  CurrencyDollarIcon,
  PlayCircleIcon
} from "@heroicons/react/24/solid";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    series: 0,
    slides: 0
  });
  const [loading, setLoading] = useState(true);

  // 1. API එකෙන් Data ගන්නවා
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch"); // Error handling
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Card Component (පරණ ලස්සන Design එක)
  const DashboardCard = ({ title, count, icon: Icon, color, subText }) => (
    <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-gray-700 transition-all duration-300">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color.replace('bg-', 'text-')}`}>
        <Icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">{title}</span>
        </div>
        
        <div>
          {loading ? (
             <div className="h-10 w-24 bg-gray-800 rounded animate-pulse mb-2"></div>
          ) : (
             <h3 className="text-4xl font-extrabold text-white mb-1">{count}</h3>
          )}
          <p className="text-xs text-green-400 font-medium flex items-center gap-1">
             {subText}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
           <p className="text-gray-400 mt-1">Welcome back! Here is what's happening with Ralla today.</p>
        </div>
      </div>

      {/* Stats Grid (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
            title="Total Users" 
            count={stats.users} 
            icon={UsersIcon} 
            color="bg-blue-600"
            subText="+12% from last week"
        />
        <DashboardCard 
            title="Total Movies" 
            count={stats.movies} 
            icon={FilmIcon} 
            color="bg-purple-600" 
            subText="Active Content"
        />
        <DashboardCard 
            title="TV Series" 
            count={stats.series} 
            icon={TvIcon} 
            color="bg-pink-600" 
            subText="Ongoing Shows"
        />
        {/* Revenue සහ Views දැනට බොරු Data (අපිට DB එකේ තාම නෑ) */}
        <DashboardCard 
            title="Total Slides" 
            count={stats.slides} 
            icon={PhotoIcon} 
            color="bg-orange-600" 
            subText="Hero Images"
        />
      </div>

      {/* --- CHART SECTION (Visual Only) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-[#111] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Weekly Views Trend</h3>
              
              {/* Simple CSS/SVG Chart (No Libraries needed) */}
              <div className="relative h-64 w-full flex items-end justify-between px-2 gap-2">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-600">
                      <span>10k</span>
                      <span>5k</span>
                      <span>2.5k</span>
                      <span>0</span>
                  </div>
                  
                  {/* The Graph Curve (SVG) */}
                  <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M0,200 C50,150 100,180 150,100 C200,20 250,80 300,120 C350,150 400,100 450,50 L450,256 L0,256 Z" 
                      fill="url(#gradient)" 
                    />
                    <path 
                      d="M0,200 C50,150 100,180 150,100 C200,20 250,80 300,120 C350,150 400,100 450,50" 
                      fill="none" 
                      stroke="#3B82F6" 
                      strokeWidth="3" 
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-4 px-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
          </div>

          {/* Recent Activity / Uploads */}
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/20 text-green-500 rounded-lg"><CurrencyDollarIcon className="w-5 h-5"/></div>
                          <div>
                              <p className="text-sm font-bold text-white">Ad Revenue</p>
                              <p className="text-xs text-gray-500">Monthly Est.</p>
                          </div>
                      </div>
                      <span className="text-green-400 font-bold">$1,240</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"><PlayCircleIcon className="w-5 h-5"/></div>
                          <div>
                              <p className="text-sm font-bold text-white">Active Streams</p>
                              <p className="text-xs text-gray-500">Real-time</p>
                          </div>
                      </div>
                      <span className="text-blue-400 font-bold">45</span>
                  </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-800">
                  <p className="text-sm text-gray-400 mb-3">Storage Used (R2)</p>
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                      <div className="bg-linear-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">45% Used</p>
              </div>
          </div>
      </div>
    </div>
  );
}