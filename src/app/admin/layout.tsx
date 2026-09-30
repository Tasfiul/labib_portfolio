"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  BookOpen,
  Layers,
  Trophy,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { AdminConfirmProvider } from "@/components/admin/AdminConfirmProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Login form state (used when unauthenticated on any admin route)
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/messages");
      const msgs = await res.json();
      if (Array.isArray(msgs)) {
        const unread = msgs.filter((m) => !m.read).length;
        setUnreadCount(unread);
      }
    } catch {
      // silently ignore
    }
  };

  useEffect(() => {
    let active = true;

    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setIsAuthenticated(data.authenticated === true);
        }
      })
      .catch(() => {
        if (active) {
          setIsAuthenticated(false);
        }
      });

    fetch("/api/messages")
      .then((res) => res.json())
      .then((msgs) => {
        if (active && Array.isArray(msgs)) {
          const unread = msgs.filter((m) => !m.read).length;
          setUnreadCount(unread);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

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
        setPasscode("");
        fetchUnreadCount();
      } else {
        setLoginError(data.error || "Incorrect passcode");
      }
    } catch {
      setLoginError("Login failed due to a network error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      router.push("/admin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    {
      name: "Overview & Inbox",
      href: "/admin",
      icon: LayoutDashboard,
      badge: unreadCount,
    },
    { name: "Home & Highlights", href: "/admin/home", icon: User },
    { name: "Resume Categories", href: "/admin/resume", icon: FileText },
    { name: "Publications", href: "/admin/publications", icon: BookOpen },
    { name: "Projects (Blocks)", href: "/admin/projects", icon: Layers },
    { name: "Awards & Certificates", href: "/admin/awards", icon: Trophy },
    { name: "Gallery Showcase", href: "/admin/gallery", icon: ImageIcon },
    { name: "Site & Contact Config", href: "/admin/settings", icon: Settings },
  ];

  // 1. Loading state while verifying token
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-400">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Render centralized Master Passcode Login Screen
  // This ensures no admin subpage ever renders in a broken, sidebar-less state.
  if (!isAuthenticated) {
    return (
      <AdminConfirmProvider>
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 text-white">
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter passcode (default: admin123)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
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
                <span>
                  {loginLoading ? "Authenticating..." : "Unlock Dashboard"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800 text-center">
              <Link
                href="/"
                className="text-xs text-slate-500 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Return to Public Portfolio</span>
              </Link>
            </div>
          </div>
        </div>
      </AdminConfirmProvider>
    );
  }

  // 3. Authenticated: Render full Admin Shell with Sidebar and in-website modals
  return (
    <AdminConfirmProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
        {/* Sticky Header for Mobile / Narrow Viewports / High Zoom */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#086972]/20 text-[#68b6c4] border border-[#086972]/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block leading-tight">
                Portfolio Admin
              </span>
              <span className="text-[10px] text-[#68b6c4] font-mono">
                Authenticated CMS
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-sm"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? (
              <X className="w-4 h-4 text-emerald-400" />
            ) : (
              <Menu className="w-4 h-4 text-[#68b6c4]" />
            )}
            <span>{mobileNavOpen ? "Close Menu" : "Admin Menu"}</span>
          </button>
        </header>

        {/* Backdrop for Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 md:z-30 w-64 h-screen bg-slate-900/95 md:bg-slate-900 border-r border-slate-800/80 p-4 flex flex-col justify-between transform transition-transform duration-300 overflow-y-auto md:translate-x-0 ${
            mobileNavOpen
              ? "translate-x-0 shadow-2xl shadow-black"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="space-y-6">
            {/* Admin Brand Header */}
            <div className="px-2 py-1 flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#086972]/20 text-[#68b6c4] border border-[#086972]/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white tracking-tight">
                    Admin CMS
                  </h1>
                  <p className="text-[11px] text-[#68b6c4] font-mono">
                    Session Active
                  </p>
                </div>
              </div>

              {/* Close button inside drawer on mobile */}
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav List */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#68b6c4] text-[#121a20] font-bold shadow-md shadow-[#68b6c4]/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-[#121a20]" : "text-slate-400"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 ? (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-[#121a20] text-[#68b6c4]"
                            : "bg-[#086972]/40 text-[#68b6c4]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions: View Live Site & Logout */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Public Site</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Session</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-h-screen bg-slate-950">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </AdminConfirmProvider>
  );
}
