"use client";

import React, { useEffect, useState } from "react";
import api from "@/src/lib/axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  emailVerifiedAt: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/profile/all');
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          setError(response.data.message || "Failed to load users");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "An error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">System Users</h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Manage all registered users, roles, and permissions across the platform.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-mod-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-all">
          Add New User
        </button>
      </div>

      <div className="rounded-[18px] border border-slate-100 bg-white shadow-sm overflow-hidden mt-8">
        <div className="border-b border-slate-100 px-6 py-5 bg-white">
          <h2 className="text-lg font-semibold text-slate-800">All Registered Users ({users.length})</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-mod-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500 font-medium">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Phone</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{user.name}</td>
                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                    <td className="px-6 py-4 text-slate-500">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-[#FA896B]/10 text-[#FA896B]' : 
                        user.role === 'gov' ? 'bg-[#FFAE1F]/10 text-[#FFAE1F]' : 
                        'bg-mod-primary/10 text-mod-primary'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {user.emailVerifiedAt ? new Date(user.emailVerifiedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
