"use client";

import React, { useEffect, useState } from "react";
import { SiteConfig, SocialLink } from "@/types";
import {
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Share2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useAdminConfirm } from "@/components/admin/AdminConfirmProvider";
import SocialIcon from "@/components/SocialIcon";

const POPULAR_PLATFORMS = [
  { name: "Instagram", url: "https://instagram.com/" },
  { name: "Google Scholar", url: "https://scholar.google.com/" },
  { name: "GitHub", url: "https://github.com/" },
  { name: "LinkedIn", url: "https://linkedin.com/in/" },
  { name: "ResearchGate", url: "https://researchgate.net/profile/" },
  { name: "Facebook", url: "https://facebook.com/" },
  { name: "X (Twitter)", url: "https://x.com/" },
  { name: "YouTube", url: "https://youtube.com/" },
];

export default function AdminSettingsPage() {
  const { confirm, notify } = useAdminConfirm();
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
        const updated = await res.json().catch(() => null);
        if (updated && typeof updated === "object") {
          setConfig(updated);
        }
        setSaveSuccess(true);
        notify("Site configuration saved successfully!", "success");
        setTimeout(() => setSaveSuccess(false), 3000);
      } else if (res.status === 401) {
        notify("Session expired or unauthorized. Please re-login to save.", "error");
      } else {
        const data = await res.json().catch(() => ({}));
        notify(data.error || "Failed to save settings", "error");
      }
    } catch (err) {
      console.error("Failed to save settings", err);
      notify("Network error: Failed to save settings", "error");
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
  const addSocialLink = (preset?: { name: string; url: string }) => {
    if (!config) return;
    const newLink: SocialLink = {
      id: "soc-" + Date.now(),
      platform: preset ? preset.name : "Instagram",
      url: preset ? preset.url : "https://instagram.com/",
      iconName: preset ? preset.name : "Instagram",
    };
    setConfig({
      ...config,
      socialLinks: [...(config.socialLinks || []), newLink],
    });
  };
  const moveSocialLink = (idx: number, direction: "up" | "down") => {
    if (!config || !config.socialLinks) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= config.socialLinks.length) return;
    const updated = [...config.socialLinks];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    setConfig({ ...config, socialLinks: updated });
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
  const removeSocialLink = async (id: string) => {
    if (!config) return;
    const link = config.socialLinks.find((s) => s.id === id);
    const confirmed = await confirm({
      title: "Remove Social Link",
      message: `Are you sure you want to remove link for ${link?.platform || "this channel"}?`,
      confirmText: "Yes, Remove",
      cancelText: "No, Keep",
      variant: "danger",
    });
    if (!confirmed) return;
    setConfig({
      ...config,
      socialLinks: config.socialLinks.filter((s) => s.id !== id),
    });
    notify("Social link removed", "info");
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

      {/* Scholar Profile & Contact Intro */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Scholar Profile &amp; Contact Introduction
        </h2>

        <div className="grid grid-cols-1 gap-4">
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

          <div className="space-y-1">
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

          <div className="space-y-1">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              External & Social Links Section ({config.socialLinks?.length || 0})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => addSocialLink()}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Social Link</span>
          </button>
        </div>

        {/* Quick-add Platform Presets */}
        <div className="flex items-center flex-wrap gap-1.5 pb-2">
          <span className="text-[11px] font-mono text-slate-400 mr-1">Quick add:</span>
          {POPULAR_PLATFORMS.filter(
            (p) =>
              !config.socialLinks?.some((s) =>
                s.platform.toLowerCase().includes(p.name.toLowerCase().split(" ")[0])
              )
          ).map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => addSocialLink(preset)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              <SocialIcon platform={preset.name} className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ {preset.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {config.socialLinks?.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    title={`Icon preview for ${item.platform || "Platform"}`}
                    className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0"
                  >
                    <SocialIcon platform={item.platform} iconName={item.iconName} className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    list="platform-suggestions"
                    placeholder="Platform (e.g. Instagram)"
                    value={item.platform}
                    onChange={(e) =>
                      updateSocialLink(item.id, "platform", e.target.value)
                    }
                    className="flex-1 font-bold text-xs text-white bg-slate-900 px-2 py-1 rounded border border-slate-800 focus:outline-none focus:border-emerald-500 min-w-0"
                  />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSocialLink(idx, "up")}
                    title="Move up"
                    className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === (config.socialLinks?.length || 0) - 1}
                    onClick={() => moveSocialLink(idx, "down")}
                    title="Move down"
                    className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSocialLink(item.id)}
                    title="Remove"
                    className="p-1 text-slate-500 hover:text-red-400 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <input
                type="text"
                placeholder="URL (https://...)"
                value={item.url}
                onChange={(e) => updateSocialLink(item.id, "url", e.target.value)}
                className="w-full text-xs text-emerald-400 bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          ))}
        </div>

        <datalist id="platform-suggestions">
          {POPULAR_PLATFORMS.map((p) => (
            <option key={p.name} value={p.name} />
          ))}
        </datalist>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-800">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>
    </form>
  );
}
