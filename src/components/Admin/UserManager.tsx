'use client';

import React, { useState, useEffect } from 'react';
import { User, Role, PanelRole } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Shield,
  ShieldCheck,
  UserX,
  UserCheck,
  Crown,
  Search,
  CheckCircle,
  AlertTriangle,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';

export default function UserManager() {
  const { t, language } = useLanguage();
  const { isSuperAdmin: authIsSuperAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Transfer / Assign Super Admin State
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState(false);

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
    setErrorMsg(null);
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
        setErrorMsg(data.error || 'Action failed');
      }
    } catch {
      setErrorMsg('Error updating user');
    }
  };

  const handleRoleUpdate = async (
    userId: string,
    role: Role,
    teamId: string | null,
    panelRole: PanelRole | null
  ) => {
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'updateRole', role, teamId, panelRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg('User role & assignment updated successfully');
        fetchUsers();
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        setErrorMsg(data.error || 'Failed to update user role');
      }
    } catch {
      setErrorMsg('Error updating user role');
    }
  };

  // Dedicated Super Admin Promotion & Transfer Handler
  const handleSuperAdminPromotion = async (transferOwnership: boolean) => {
    if (!selectedCandidateId) {
      alert('Please select a verified user to promote/transfer.');
      return;
    }

    const candidate = users.find((u) => u.id === selectedCandidateId);
    if (!candidate) return;

    const actionTitle = transferOwnership
      ? `Transfer Super Admin ownership to ${candidate.name} (${candidate.email})?`
      : `Promote ${candidate.name} (${candidate.email}) to Super Admin?`;

    if (!confirm(actionTitle)) return;

    setIsTransferring(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedCandidateId,
          action: 'promoteSuperAdmin',
          transferOwnership,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg(
          transferOwnership
            ? `Super Admin ownership successfully transferred to ${candidate.email}!`
            : `${candidate.name} has been promoted to Super Admin with full administrative privileges!`
        );
        fetchUsers();
        setTimeout(() => setStatusMsg(null), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to execute Super Admin action');
      }
    } catch {
      setErrorMsg('Network error while processing Super Admin request');
    } finally {
      setIsTransferring(false);
    }
  };

  const currentSuperAdmins = users.filter((u) => u.role === 'super_admin');
  const eligibleCandidates = users.filter(
    (u) => u.isVerified && u.status === 'active' && u.role !== 'super_admin'
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-theme-primary" />
            <span>{t('adminUsers')}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'সুপার অ্যাডমিন ক্ষমতা বণ্টন, অ্যাডমিন/মডারেটর নির্ধারণ, কিক/ব্যান এবং দলীয় গ্রুপ দায়িত্ব'
              : 'Super Admin authority, role-based access control, kick/ban, and debate team assignments'}
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
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 border border-emerald-200">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-200">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ========================================================
          DEDICATED SUPER ADMIN MANAGEMENT & OWNERSHIP TRANSFER
          (Visible strictly to active Super Admin users)
      ======================================================== */}
      {authIsSuperAdmin && (
        <div className="p-6 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-900/5 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 rounded-3xl border-2 border-amber-500/40 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-black uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" />
                <span>Super Admin Command</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>সুপার অ্যাডমিন পদবী হস্তান্তর ও নতুন সুপার অ্যাডমিন নিয়োগ</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {language === 'bn'
                  ? 'বর্তমান সুপার অ্যাডমিন (exploviaweb.bd@gmail.com) যেকোনো সময় অন্য যাচাইকৃত সদস্যকে সুপার অ্যাডমিন ক্ষমতা প্রদান অথবা সম্পূর্ণ ওনারশিপ হস্তান্তর করতে পারেন।'
                  : 'Current Super Admin can grant full super_admin authority or transfer primary ownership to another verified user.'}
              </p>
            </div>

            {/* Current Super Admin Badge */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-2xl border border-amber-500/30">
              <Crown className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                  Active Super Admin
                </span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  {currentSuperAdmins.map((s) => s.email).join(', ') || 'exploviaweb.bd@gmail.com'}
                </span>
              </div>
            </div>
          </div>

          {/* Transfer & Promote Form */}
          <div className="p-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-amber-500/20 space-y-3">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Choose Verified User to Promote or Transfer Super Admin:
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <select
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
                className="w-full sm:flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                <option value="">-- Select a User --</option>
                {eligibleCandidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email}) — Current Role: {c.role}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={!selectedCandidateId || isTransferring}
                  onClick={() => handleSuperAdminPromotion(false)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Promote to Super Admin</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedCandidateId || isTransferring}
                  onClick={() => handleSuperAdminPromotion(true)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Transfer Ownership</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3.5">Name & Gmail</th>
              <th className="p-3.5">System Role (RBAC)</th>
              <th className="p-3.5">Team Assignment</th>
              <th className="p-3.5">Panel Role</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.map((u) => {
              const isSuper = u.role === 'super_admin';
              const isPrimaryExplovia = u.email.toLowerCase() === 'exploviaweb.bd@gmail.com';

              return (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                      {isSuper && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white font-black text-[9px] uppercase tracking-wider flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5" />
                          <span>Super Admin</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                  </td>

                  {/* System Role Selector */}
                  <td className="p-3.5">
                    <select
                      value={u.role}
                      disabled={isPrimaryExplovia || (!authIsSuperAdmin && isSuper)}
                      onChange={(e) =>
                        handleRoleUpdate(
                          u.id,
                          e.target.value as Role,
                          u.teamId || null,
                          u.panelRole || null
                        )
                      }
                      className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 capitalize"
                    >
                      <option value="member">Member</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      {authIsSuperAdmin && <option value="super_admin">Super Admin</option>}
                    </select>
                  </td>

                  {/* Team Assignment */}
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

                  {/* Panel Role */}
                  <td className="p-3.5">
                    <select
                      value={u.panelRole || ''}
                      onChange={(e) =>
                        handleRoleUpdate(
                          u.id,
                          u.role,
                          u.teamId || null,
                          (e.target.value as PanelRole) || null
                        )
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

                  {/* Status Badge */}
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

                  {/* Moderation Actions (Protected against kicking/banning super admins) */}
                  <td className="p-3.5 text-right space-x-1.5">
                    {!isPrimaryExplovia && !isSuper && (
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
