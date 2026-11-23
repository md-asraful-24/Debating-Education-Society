'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ChatMessage, Debate } from '@/lib/types';
import {
  Send,
  MessageSquare,
  Users,
  Shield,
  Lock,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function ChatRoom() {
  const { user } = useAuth();
  const { t, loc, language } = useLanguage();

  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [activeDebates, setActiveDebates] = useState<Debate[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch active debates to populate private team rooms
  useEffect(() => {
    fetch('/api/debates')
      .then((res) => res.json())
      .then((data) => {
        if (data.debates) {
          setActiveDebates(data.debates);
        }
      })
      .catch((err) => console.error('Failed to load debates for chat:', err));
  }, []);

  const fetchMessages = async (channelId: string) => {
    try {
      const res = await fetch(`/api/chat/messages?channelId=${encodeURIComponent(channelId)}`);
      if (res.status === 403) {
        setIsRestricted(true);
        setMessages([]);
        return;
      }
      setIsRestricted(false);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    setLoadingMessages(true);
    fetchMessages(activeChannel).finally(() => setLoadingMessages(false));

    // Polling every 3.5s for real-time conversation updates
    const interval = setInterval(() => {
      fetchMessages(activeChannel);
    }, 3500);

    return () => clearInterval(interval);
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: activeChannel,
          message: inputMessage.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setInputMessage('');
      } else {
        alert(data.error || 'Failed to send message');
      }
    } catch {
      alert('Network error sending message.');
    } finally {
      setSending(false);
    }
  };

  const getChannelTitle = (ch: string) => {
    if (ch === 'general') return t('generalChat');
    if (ch.endsWith('_teamA')) return t('teamAChat');
    if (ch.endsWith('_teamB')) return t('teamBChat');
    if (ch.endsWith('_panel')) return t('panelChat');
    return ch;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row h-[650px]">
      {/* Sidebar Channels List */}
      <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-theme-primary" />
            <span>{t('chatTitle')}</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === 'bn' ? 'সরাসরি যুক্তিবাদী চ্যাট ফোরাম' : 'Live debate discussion hub'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Universal Bangla General Chat */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
              {language === 'bn' ? 'সার্বজনীন রুম' : 'Public Forum'}
            </span>
            <button
              type="button"
              onClick={() => setActiveChannel('general')}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                activeChannel === 'general'
                  ? 'bg-theme-primary text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Users className="w-4 h-4 shrink-0" />
                <span className="text-xs truncate">{t('generalChat')}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </button>
          </div>

          {/* Private Debate Team Groups */}
          {activeDebates.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                {language === 'bn' ? 'নির্ধারিত বিতর্ক গ্রুপ (প্রাইভেট)' : 'Assigned Debate Groups (Private)'}
              </span>

              {activeDebates.slice(0, 2).map((deb) => (
                <div key={deb.id} className="space-y-1 pl-1">
                  <div className="text-[11px] font-semibold text-slate-500 truncate px-2">
                    {loc(deb.topic).slice(0, 28)}...
                  </div>

                  {/* Team A Channel */}
                  <button
                    type="button"
                    onClick={() => setActiveChannel(`${deb.id}_teamA`)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                      activeChannel === `${deb.id}_teamA`
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{deb.teamA.name || 'Team A (Govt)'}</span>
                    </div>
                  </button>

                  {/* Team B Channel */}
                  <button
                    type="button"
                    onClick={() => setActiveChannel(`${deb.id}_teamB`)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                      activeChannel === `${deb.id}_teamB`
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{deb.teamB.name || 'Team B (Opp)'}</span>
                    </div>
                  </button>

                  {/* Panel Channel */}
                  <button
                    type="button"
                    onClick={() => setActiveChannel(`${deb.id}_panel`)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                      activeChannel === `${deb.id}_panel`
                        ? 'bg-purple-600 text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Shield className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span className="truncate">{t('panelChat')}</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Status Bar */}
        {user && (
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-theme-primary text-white flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 truncate">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                {user.role} {user.teamId ? `• ${user.teamId}` : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Conversation Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-theme-light text-theme-primary">
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {getChannelTitle(activeChannel)}
              </h4>
              <p className="text-[11px] text-slate-500">
                {activeChannel === 'general' ? t('generalChatNotice') : 'Private Debate Group'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchMessages(activeChannel)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Refresh messages"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
          {isRestricted ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600">
                <Lock className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {t('unauthorizedChat')}
              </h5>
              <p className="text-xs text-slate-500 max-w-sm">
                {language === 'bn'
                  ? 'এই প্রাইভেট বিতর্ক গ্রুপে শুধুমাত্র নির্ধারিত দলের ৩ জন সদস্য, বিচারক এবং অ্যাডমিন প্রবেশ করতে পারেন।'
                  : 'Only assigned 3-member team participants and adjudicators can access this private room.'}
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
              <span>{language === 'bn' ? 'এখনও কোনো বার্তা নেই। যুক্তির আলোচনা শুরু করুন!' : 'No messages yet. Start the debate dialogue!'}</span>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = user?.id === msg.senderId;
              const timeStr = new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {msg.senderName}
                    </span>
                    {msg.senderRole === 'admin' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white">
                        Admin
                      </span>
                    )}
                    {msg.senderRole === 'moderator' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-600 text-white">
                        Mod
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{timeStr}</span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-theme-primary text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs rounded-bl-xs'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        {!isRestricted && (
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('typeMessage')}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={sending || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-theme-primary hover:bg-theme-hover disabled:opacity-50 text-white transition-all shadow-md shadow-emerald-700/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
