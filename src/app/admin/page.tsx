"use client";

import React, { useEffect, useState } from "react";
import { ContactMessage } from "@/types";
import {
  Lock,
  ArrowRight,
  Mail,
  CheckCircle2,
  Trash2,
  MessageSquare,
  Clock,
  Eye,
  EyeOff,
  Layers,
  BookOpen,
  Trophy,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState({
    projects: 0,
    publications: 0,
    awards: 0,
    gallery: 0,
    unreadMessages: 0,
  });

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        loadData();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const loadData = async () => {
    try {
      const [msgsRes, projRes, pubRes, awardRes, galRes] = await Promise.all([
        fetch("/api/messages"),
        fetch("/api/projects"),
        fetch("/api/publications"),
        fetch("/api/awards"),
        fetch("/api/gallery"),
      ]);

      const [msgs, projs, pubs, awards, gal] = await Promise.all([
        msgsRes.json(),
        projRes.json(),
        pubRes.json(),
        awardRes.json(),
        galRes.json(),
      ]);

      if (Array.isArray(msgs)) {
        setMessages(msgs);
        setStats({
          projects: Array.isArray(projs) ? projs.length : 0,
          publications: Array.isArray(pubs) ? pubs.length : (pubs?.publications?.length || 0),
          awards: Array.isArray(awards) ? awards.length : 0,
          gallery: gal?.items?.length || 0,
          unreadMessages: msgs.filter((m) => !m.read).length,
        });
      }
    } catch (err) {
      console.error("Failed to load admin stats", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        loadData();
      } else {
        setLoginError(data.error || "Incorrect passcode");
      }
    } catch {
      setLoginError("Login failed due to a network error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: !currentRead }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
        );
        setStats((prev) => ({
          ...prev,
          unreadMessages: currentRead
            ? prev.unreadMessages + 1
            : Math.max(0, prev.unreadMessages - 1),
        }));
      }
    } catch (err) {
      console.error("Failed to toggle read", err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/messages?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const deletedMsg = messages.find((m) => m.id === id);
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setStats((prev) => ({
          ...prev,
          unreadMessages:
            deletedMsg && !deletedMsg.read
              ? Math.max(0, prev.unreadMessages - 1)
              : prev.unreadMessages,
        }));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete message");
      }
    } catch (err) {
      console.error("Failed to delete message", err);
      alert("Failed to delete message due to network error");
    }
  };

  // If not authenticated, render the Master Passcode Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Portfolio Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Enter your admin passcode to access content management.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Master Passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode (default: admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-sm"
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all cursor-pointer font-bold"
            >
              <span>{loginLoading ? "Authenticating..." : "Unlock Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-500 font-mono">
            Default initial passcode: <code className="text-emerald-400">admin123</code> (configurable via .env)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">
          Admin Dashboard
        </p>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Overview & Message Inbox
        </h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-mono">Projects</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.projects}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-mono">Publications</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.publications}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-mono">Awards</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.awards}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 text-emerald-400">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-mono">Unread Inquiries</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.unreadMessages}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Messages Inbox */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Contact Form Inquiries</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {messages.length} total messages
          </span>
        </div>

        {messages.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center font-mono">
            No incoming messages yet.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border transition-all ${
                  msg.read
                    ? "bg-slate-950/50 border-slate-800/80 text-slate-400"
                    : "bg-slate-950 border-emerald-500/40 text-slate-200 shadow-md shadow-emerald-500/5"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                      <h3 className="font-bold text-white text-sm">{msg.name}</h3>
                      <span className="text-xs text-emerald-400 font-mono">
                        &lt;{msg.email}&gt;
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-300">
                      Subject: {msg.subject}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mr-2">
                      <Clock className="w-3 h-3" />
                      {msg.createdAt?.split("T")[0]}
                    </span>

                    <button
                      onClick={() => handleToggleRead(msg.id, msg.read)}
                      className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 ${
                        msg.read
                          ? "border-slate-800 text-slate-400 hover:text-white"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      }`}
                      title={msg.read ? "Mark as unread" : "Mark as read"}
                    >
                      {msg.read ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>

                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                      title="Reply via Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 whitespace-pre-wrap bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
