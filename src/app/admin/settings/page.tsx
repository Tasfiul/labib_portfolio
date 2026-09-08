"use client";

import React, { useEffect, useState } from "react";
import { SiteConfig, SocialLink } from "@/types";
import {
  Save,
  Plus,
  Trash2,
  Settings,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Share2,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data: SiteConfig) => {
        setConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load settings", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setSaving(false);
    }
  };

  // Emails management
  const addEmail = () => {
    if (!config) return;
    setConfig({ ...config, emails: [...(config.emails || []), ""] });
  };
  const updateEmail = (idx: number, val: string) => {
    if (!config) return;
    const updated = [...config.emails];
    updated[idx] = val;
    setConfig({ ...config, emails: updated });
  };
  const removeEmail = (idx: number) => {
    if (!config) return;
    setConfig({
      ...config,
      emails: config.emails.filter((_, i) => i !== idx),
    });
  };

  // Phone numbers management
  const addPhone = () => {
    if (!config) return;
    setConfig({ ...config, phoneNumbers: [...(config.phoneNumbers || []), ""] });
  };
  const updatePhone = (idx: number, val: string) => {
    if (!config) return;
    const updated = [...config.phoneNumbers];
    updated[idx] = val;
    setConfig({ ...config, phoneNumbers: updated });
  };
  const removePhone = (idx: number) => {
    if (!config) return;
    setConfig({
      ...config,
      phoneNumbers: config.phoneNumbers.filter((_, i) => i !== idx),
    });
  };

  // Addresses management
  const addAddress = () => {
    if (!config) return;
    setConfig({ ...config, addresses: [...(config.addresses || []), ""] });
  };
  const updateAddress = (idx: number, val: string) => {
    if (!config) return;
    const updated = [...config.addresses];
    updated[idx] = val;
    setConfig({ ...config, addresses: updated });
  };
  const removeAddress = (idx: number) => {
    if (!config) return;
    setConfig({
      ...config,
      addresses: config.addresses.filter((_, i) => i !== idx),
    });
  };

  // Social Links management
  const addSocialLink = () => {
    if (!config) return;
    const newLink: SocialLink = {
      id: "soc-" + Date.now(),
      platform: "New Platform",
      url: "https://...",
    };
    setConfig({
      ...config,
      socialLinks: [...(config.socialLinks || []), newLink],
    });
  };
  const updateSocialLink = (
    id: string,
    field: keyof SocialLink,
    val: string
  ) => {
    if (!config) return;
    setConfig({
      ...config,
      socialLinks: config.socialLinks.map((s) =>
        s.id === id ? { ...s, [field]: val } : s
      ),
    });
  };
  const removeSocialLink = (id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      socialLinks: config.socialLinks.filter((s) => s.id !== id),
    });
  };

  if (loading || !config) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading site settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Global Site Config
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Contact Channels & Social Links
          </h1>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Brand & Scholar Link */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Site Identity & Scholar Profile
        </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 uppercase">
              Brand Name / Navbar Logo Text
            </label>
            <input
              type="text"
              value={config.siteName}
              onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 uppercase">
              Google Scholar Profile URL (Navbar Button)
            </label>
            <input
              type="text"
              value={config.googleScholarUrl}
              onChange={(e) =>
                setConfig({ ...config, googleScholarUrl: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase">
              Contact Page Introduction Paragraph
            </label>
            <textarea
              rows={3}
              value={config.contactIntro || ""}
              onChange={(e) =>
                setConfig({ ...config, contactIntro: e.target.value })
              }
              placeholder="Feel free to reach out for research collaborations, STEM speaking engagements, or engineering consultations."
              className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500 resize-y"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase">
              Footer Copyright Text
            </label>
            <input
              type="text"
              value={config.footerText}
              onChange={(e) =>
                setConfig({ ...config, footerText: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Multiple Contact Information Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Emails List */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Email List</span>
            </div>
            <button
              type="button"
              onClick={addEmail}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {config.emails?.map((em, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="email"
                  value={em}
                  onChange={(e) => updateEmail(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => removeEmail(idx)}
                  className="p-1.5 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Phone Numbers List */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phone List</span>
            </div>
            <button
              type="button"
              onClick={addPhone}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {config.phoneNumbers?.map((ph, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={ph}
                  onChange={(e) => updatePhone(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => removePhone(idx)}
                  className="p-1.5 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Addresses List */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Address List</span>
            </div>
            <button
              type="button"
              onClick={addAddress}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {config.addresses?.map((addr, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <textarea
                  rows={2}
                  value={addr}
                  onChange={(e) => updateAddress(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => removeAddress(idx)}
                  className="p-1.5 text-slate-500 hover:text-red-400 mt-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Standout Social / External Links */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              External & Social Links Section ({config.socialLinks?.length || 0})
            </h2>
          </div>
          <button
            type="button"
            onClick={addSocialLink}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Social Link</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {config.socialLinks?.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Platform Name (e.g. GitHub)"
                  value={item.platform}
                  onChange={(e) =>
                    updateSocialLink(item.id, "platform", e.target.value)
                  }
                  className="font-bold text-xs text-white bg-slate-900 px-2 py-1 rounded border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(item.id)}
                  className="p-1 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                placeholder="URL (https://...)"
                value={item.url}
                onChange={(e) => updateSocialLink(item.id, "url", e.target.value)}
                className="w-full text-xs text-emerald-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
