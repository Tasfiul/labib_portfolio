"use client";

import React, { useEffect, useState } from "react";
import { ProfileData, HighlightToken, HoverSubItem } from "@/types";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminHomePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProfile({ ...profile, avatarUrl: data.url });
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  // Highlights management
  const addHighlightToken = () => {
    if (!profile) return;
    const newToken: HighlightToken = {
      id: "hl-" + Date.now(),
      phrase: "",
      url: "",
      subItems: [{ id: "sub-" + Date.now(), label: "", url: "" }],
    };
    setProfile({
      ...profile,
      highlights: [...(profile.highlights || []), newToken],
    });
  };

  const removeHighlightToken = (id: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      highlights: profile.highlights.filter((h) => h.id !== id),
    });
  };

  const updateHighlightField = (
    id: string,
    field: keyof HighlightToken,
    value: unknown
  ) => {
    if (!profile) return;
    setProfile({
      ...profile,
      highlights: profile.highlights.map((h) =>
        h.id === id ? { ...h, [field]: value } : h
      ),
    });
  };

  const addSubItemToToken = (tokenId: string) => {
    if (!profile) return;
    const newSub: HoverSubItem = {
      id: "sub-" + Date.now(),
      label: "",
      url: "",
    };
    setProfile({
      ...profile,
      highlights: profile.highlights.map((h) =>
        h.id === tokenId ? { ...h, subItems: [...h.subItems, newSub] } : h
      ),
    });
  };

  const updateSubItem = (
    tokenId: string,
    subId: string,
    field: keyof HoverSubItem,
    value: string
  ) => {
    if (!profile) return;
    setProfile({
      ...profile,
      highlights: profile.highlights.map((h) =>
        h.id === tokenId
          ? {
              ...h,
              subItems: h.subItems.map((sub) =>
                sub.id === subId ? { ...sub, [field]: value } : sub
              ),
            }
          : h
      ),
    });
  };

  const removeSubItem = (tokenId: string, subId: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      highlights: profile.highlights.map((h) =>
        h.id === tokenId
          ? { ...h, subItems: h.subItems.filter((sub) => sub.id !== subId) }
          : h
      ),
    });
  };

  if (loading || !profile) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading profile settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Content Management
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Home Profile & Interactive Highlights
          </h1>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Profile changes saved and published successfully!</span>
        </div>
      )}

      {/* Main Info */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
          Personal Information & Avatar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Tagline / Subheading
              </label>
              <input
                type="text"
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Pill Titles (comma separated)
              </label>
              <input
                type="text"
                value={profile.titles.join(", ")}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    titles: e.target.value.split(",").map((t) => t.trim()),
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Total Citations Count
              </label>
              <input
                type="number"
                value={profile.currentCitations || 0}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    currentCitations: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Avatar Upload (Optimized with Sharp to WebP) */}
          <div className="space-y-4">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              Hero Avatar (High-Quality Sharp WebP)
            </label>

            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500/50 bg-slate-950 flex-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatarUrl}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-slate-700 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? "Processing Sharp WebP..." : "Upload New Picture"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-500">
                  Processed losslessly with Sharp into crystal-clear WebP.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Or Direct Image URL
              </label>
              <input
                type="text"
                value={profile.avatarUrl}
                onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Bio Text */}
        <div className="space-y-1.5 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Biography / Intro Paragraph
            </label>
            <span className="text-[11px] text-emerald-400 font-mono">
              Highlighted words configured below will automatically pop up with hover sub-lists!
            </span>
          </div>
          <textarea
            rows={5}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm leading-relaxed focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Interactive Highlight & Sub-List Builder */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Interactive Hover Highlight Sub-Lists ({profile.highlights?.length || 0})
            </h2>
          </div>

          <button
            type="button"
            onClick={addHighlightToken}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Highlight Token</span>
          </button>
        </div>

        <div className="space-y-4">
          {profile.highlights?.map((token) => (
            <div
              key={token.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Matching Phrase in Bio
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. power electronics"
                    value={token.phrase}
                    onChange={(e) =>
                      updateHighlightField(token.id, "phrase", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Direct Hyperlink (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /projects or https://scholar.google.com"
                    value={token.url || ""}
                    onChange={(e) =>
                      updateHighlightField(token.id, "url", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end pt-5">
                  <button
                    type="button"
                    onClick={() => removeHighlightToken(token.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete highlight token"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sub-items list */}
              <div className="pl-4 border-l-2 border-emerald-500/30 space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    Hover Dropdown Sub-Items
                  </span>
                  <button
                    type="button"
                    onClick={() => addSubItemToToken(token.id)}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                {token.subItems?.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex flex-col sm:flex-row items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Item Label (e.g. DSP Processors)"
                      value={sub.label}
                      onChange={(e) =>
                        updateSubItem(token.id, sub.id, "label", e.target.value)
                      }
                      className="w-full sm:w-1/2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Item Link (e.g. https://... or /projects)"
                      value={sub.url || ""}
                      onChange={(e) =>
                        updateSubItem(token.id, sub.id, "url", e.target.value)
                      }
                      className="w-full sm:w-1/2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubItem(token.id, sub.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded transition-colors self-end sm:self-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
