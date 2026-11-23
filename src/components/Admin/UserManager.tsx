'use client';

import React, { useState, useEffect } from 'react';
import { User, Role, PanelRole } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  Users,
  Shield,
  UserX,
  UserCheck,
  ShieldAlert,
  Search,
  CheckCircle,
} from 'lucide-react';

export default function UserManager() {
  const { t, language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (userId: string, action: 'ban' | 'kick' | 'activate') => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg(`User status updated to ${action}`);
        fetchUsers();
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        alert(data.error || 'Action failed');
      }
    } catch {
      alert('Error updating user');
    }
  };

  const handleRoleUpdate = async (userId: string, role: Role, teamId: string | null, panelRole: PanelRole | null) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'updateRole', role, teamId, panelRole }),
      });
      if (res.ok) {
        setStatusMsg('User role & assignment updated');
        fetchUsers();
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch {
      alert('Error updating user role');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-theme-primary" />
            <span>{t('adminUsers')}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'সদস্য অনুমোদন, কিক/ব্যান, বিতর্ক দল ও বিচারক প্যানেল দায়িত্ব বণ্টন'
              : 'Kick/Ban members, assign roles, teams (Team A/B), and adjudicator panels'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or Gmail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3.5">Name & Gmail</th>
              <th className="p-3.5">System Role</th>
              <th className="p-3.5">Team Assignment</th>
              <th className="p-3.5">Panel Role</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5">
                  <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                </td>

                <td className="p-3.5">
                  <select
                    value={u.role}
                    disabled={u.email === 'admin@gmail.com'}
                    onChange={(e) =>
                      handleRoleUpdate(u.id, e.target.value as Role, u.teamId || null, u.panelRole || null)
                    }
                    className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 capitalize"
                  >
                    <option value="member">Member</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="p-3.5">
                  <select
                    value={u.teamId || ''}
                    onChange={(e) =>
                      handleRoleUpdate(u.id, u.role, e.target.value || null, u.panelRole || null)
                    }
                    className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="">(No Team)</option>
                    <option value="team-a">Team A (Government)</option>
                    <option value="team-b">Team B (Opposition)</option>
                  </select>
                </td>

                <td className="p-3.5">
                  <select
                    value={u.panelRole || ''}
                    onChange={(e) =>
                      handleRoleUpdate(u.id, u.role, u.teamId || null, (e.target.value as PanelRole) || null)
                    }
                    className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 capitalize"
                  >
                    <option value="">(None)</option>
                    <option value="debater">Debater</option>
                    <option value="chairperson">Chairperson / Speaker</option>
                    <option value="vice_chairperson">Vice-Chairperson</option>
                    <option value="panel_member">Panel Adjudicator</option>
                    <option value="audience">Audience</option>
                  </select>
                </td>

                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : u.status === 'banned'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="p-3.5 text-right space-x-1.5">
                  {u.email !== 'admin@gmail.com' && (
                    <>
                      {u.status !== 'banned' ? (
                        <button
                          type="button"
                          onClick={() => handleAction(u.id, 'ban')}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                        >
                          {t('adminBanUser')}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAction(u.id, 'activate')}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                        >
                          {t('adminActivateUser')}
                        </button>
                      )}

                      {u.status === 'active' && (
                        <button
                          type="button"
                          onClick={() => handleAction(u.id, 'kick')}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                        >
                          {t('adminKickUser')}
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
