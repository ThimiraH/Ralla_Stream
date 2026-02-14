"use client";

import { useState, useEffect } from "react";
import { 
  TrashIcon, 
  MagnifyingGlassIcon,
  ShieldCheckIcon, // Admin Icon
  UserIcon 
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 1. Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Toggle Admin Status
  const toggleAdmin = async (user) => {
    const newStatus = !user.isAdmin;
    const confirmMsg = newStatus 
        ? `Are you sure you want to make ${user.name} an Admin?` 
        : `Remove Admin rights from ${user.name}?`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user._id, isAdmin: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(newStatus ? "User Promoted to Admin! 🛡️" : "Admin rights removed.");
        fetchUsers(); 
      } else {
        toast.error("Failed to update role");
      }
    } catch (error) {
      toast.error("Error updating role");
    }
  };

  // 3. Delete User
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User deleted successfully");
        setUsers(users.filter((user) => user._id !== id));
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  // Search Filter
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white">Users Management</h2>
            <p className="text-gray-400 text-sm">Manage user access and roles</p>
        </div>
        
        <div className="bg-blue-900/20 text-blue-400 px-4 py-2 rounded-lg text-sm font-bold border border-blue-500/20">
            Total Users: {users.length}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full bg-[#111] border border-gray-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:border-blue-500 focus:outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/40 text-gray-200 uppercase font-bold text-xs">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joined Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No users found.</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr 
                                    key={user._id} 
                                    // 👇 Admin නම් පසුබිම (Background) ටිකක් නිල් පාට කරනවා
                                    className={`transition ${user.isAdmin ? 'bg-blue-900/10 hover:bg-blue-900/20' : 'hover:bg-gray-800/50'}`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar Circle */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold uppercase ${
                                                user.isAdmin ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-800 text-gray-400'
                                            }`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            
                                            <div>
                                                <div className="font-bold text-white text-base flex items-center gap-2">
                                                    {user.name}
                                                    {/* 👇 Admin Tag එක නම ඉස්සරහින් */}
                                                    {user.isAdmin && (
                                                        <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isAdmin ? (
                                            <span className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs font-bold border border-purple-500/20">
                                                <ShieldCheckIcon className="w-3 h-3" /> Administrator
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs font-bold border border-gray-700">
                                                <UserIcon className="w-3 h-3" /> Member
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Toggle Admin Button */}
                                            <button 
                                                onClick={() => toggleAdmin(user)}
                                                className={`p-2 rounded-lg transition ${
                                                    user.isAdmin 
                                                    ? 'text-yellow-500 hover:bg-yellow-500/10' 
                                                    : 'text-gray-500 hover:text-blue-400 hover:bg-blue-500/10'
                                                }`}
                                                title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                                            >
                                                <ShieldCheckIcon className="w-5 h-5" />
                                            </button>

                                            {/* Delete Button */}
                                            <button 
                                                onClick={() => handleDelete(user._id)} 
                                                className="p-2 hover:bg-red-900/20 rounded-lg text-red-500 transition"
                                                title="Delete User"
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