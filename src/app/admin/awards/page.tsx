"use client";

import React, { useEffect, useState } from "react";
import { Award } from "@/types";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  Trophy,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminAwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingAwardId, setUploadingAwardId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/awards")
      .then((res) => res.json())
      .then((data: Award[]) => {
        setAwards(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load awards", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/awards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(awards),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save awards", err);
    } finally {
      setSaving(false);
    }
  };

  const addAward = () => {
    const newAward: Award = {
      id: "award-" + Date.now(),
      title: "Award or Competition Honor",
      issuedDate: "Nov 2025",
      issuedBy: "Awarding Body / Organization",
      description: "Description of the achievement and team role...",
      badgeText: "Honor Badge",
      certificateUrl:
        "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&w=1200&q=85",
      link: "",
    };
    setAwards([newAward, ...awards]);
  };

  const removeAward = (id: string) => {
    if (!confirm("Are you sure you want to delete this award?")) return;
    setAwards(awards.filter((a) => a.id !== id));
  };

  const updateAwardField = (id: string, field: keyof Award, value: unknown) => {
    setAwards(
      awards.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleCertificateUpload = async (
    awardId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAwardId(awardId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        updateAwardField(awardId, "certificateUrl", data.url);
        updateAwardField(awardId, "thumbnail", data.url);
      }
    } catch (err) {
      console.error("Certificate upload failed", err);
    } finally {
      setUploadingAwardId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading awards...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Honors Management
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Awards, Issued Dates & Certificates
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addAward}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Award</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Awards"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Awards saved successfully!</span>
        </div>
      )}

      {/* Awards List */}
      <div className="space-y-6">
        {awards.map((award) => (
          <div
            key={award.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1 flex-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase">
                  Award Title
                </label>
                <input
                  type="text"
                  value={award.title}
                  onChange={(e) =>
                    updateAwardField(award.id, "title", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={() => removeAward(award.id)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-4"
                title="Delete award"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase">
                  Issued Date (e.g. Nov 2025)
                </label>
                <input
                  type="text"
                  value={award.issuedDate}
                  onChange={(e) =>
                    updateAwardField(award.id, "issuedDate", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase">
                  Issued By (Organization / Institution)
                </label>
                <input
                  type="text"
                  value={award.issuedBy}
                  onChange={(e) =>
                    updateAwardField(award.id, "issuedBy", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase">
                  Badge Pill Text (e.g. Silver Medalist)
                </label>
                <input
                  type="text"
                  value={award.badgeText || ""}
                  onChange={(e) =>
                    updateAwardField(award.id, "badgeText", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase">
                Description / Scope
              </label>
              <textarea
                rows={3}
                value={award.description || ""}
                onChange={(e) =>
                  updateAwardField(award.id, "description", e.target.value)
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase">
                  Certificate / Award Image (Sharp WebP Upload or URL)
                </label>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {uploadingAwardId === award.id ? "Uploading..." : "Upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCertificateUpload(award.id, e)}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={award.certificateUrl || award.thumbnail || ""}
                    onChange={(e) => {
                      updateAwardField(award.id, "certificateUrl", e.target.value);
                      updateAwardField(award.id, "thumbnail", e.target.value);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase">
                  Verification / Event Link
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={award.link || ""}
                  onChange={(e) =>
                    updateAwardField(award.id, "link", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
