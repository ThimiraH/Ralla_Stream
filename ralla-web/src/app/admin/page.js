"use client";

import { 
  UsersIcon, 
  FilmIcon, 
  PlayIcon, 
  CurrencyDollarIcon 
} from "@heroicons/react/24/solid";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy Data for Chart
const data = [
  { name: 'Mon', views: 4000 },
  { name: 'Tue', views: 3000 },
  { name: 'Wed', views: 5000 },
  { name: 'Thu', views: 2780 },
  { name: 'Fri', views: 1890 },
  { name: 'Sat', views: 9390 },
  { name: 'Sun', views: 3490 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      
      {/* 1. Welcome Message */}
      <div>
        <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-gray-400">Welcome back! Here is what's happening with Ralla today.</p>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="1,234" icon={<UsersIcon />} color="bg-blue-500" change="+12%" />
        <StatCard title="Total Movies" value="450" icon={<FilmIcon />} color="bg-purple-500" change="+5" />
        <StatCard title="Total Views" value="85.2K" icon={<PlayIcon />} color="bg-green-500" change="+24%" />
        <StatCard title="Revenue" value="$4,300" icon={<CurrencyDollarIcon />} color="bg-yellow-500" change="+8%" />
      </div>

      {/* 3. Analytics Chart */}
      <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Weekly Views Trend</h3>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" tick={{fill: '#888'}} />
                    <YAxis stroke="#666" tick={{fill: '#888'}} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Recent Activity Table (Example) */}
      <div className="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden">
         <div className="p-6 border-b border-gray-800">
             <h3 className="font-bold text-white">Recent Uploads</h3>
         </div>
         <table className="w-full text-left text-sm text-gray-400">
             <thead className="bg-black/40 text-gray-200 uppercase font-bold text-xs">
                 <tr>
                     <th className="px-6 py-4">Title</th>
                     <th className="px-6 py-4">Category</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Date</th>
                 </tr>
             </thead>
             <tbody className="divide-y divide-gray-800">
                 {/* Dummy Rows */}
                 <tr className="hover:bg-gray-800/50 transition">
                     <td className="px-6 py-4 font-medium text-white">Solo Leveling</td>
                     <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-bold">Series</span></td>
                     <td className="px-6 py-4 text-green-400">Published</td>
                     <td className="px-6 py-4">Oct 24, 2025</td>
                 </tr>
                 <tr className="hover:bg-gray-800/50 transition">
                     <td className="px-6 py-4 font-medium text-white">Avengers: Secret Wars</td>
                     <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold">Movie</span></td>
                     <td className="px-6 py-4 text-yellow-400">Draft</td>
                     <td className="px-6 py-4">Oct 23, 2025</td>
                 </tr>
             </tbody>
         </table>
      </div>

    </div>
  );
}

// Helper Component for Stats
function StatCard({ title, value, icon, color, change }) {
    return (
        <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition group relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition`}>
                 <div className={`w-24 h-24 rounded-full ${color} blur-2xl`}></div>
            </div>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shadow-lg`}>
                    <div className="w-6 h-6">{icon}</div>
                </div>
                <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">{change}</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
    );
}