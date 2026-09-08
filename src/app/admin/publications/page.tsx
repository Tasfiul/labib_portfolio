"use client";

import React, { useEffect, useState } from "react";
import { Publication } from "@/types";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  CheckCircle,
  Image as ImageIcon,
  BookOpen,
} from "lucide-react";

export default function AdminPublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activePubId, setActivePubId] = useState<string>("");
  const [totalCitations, setTotalCitations] = useState<string>("145+");
  const [uploadingFig, setUploadingFig] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/publications")
      .then((res) => res.json())
      .then((data) => {
        const pubList = Array.isArray(data) ? data : (data.publications || []);
        setPublications(pubList);
        if (data.totalCitations) {
          setTotalCitations(data.totalCitations);
        } else {
          const sum = pubList.reduce(
            (acc: number, pub: Publication) => acc + (pub.citationCount || 0),
            0
          );
          setTotalCitations(sum > 0 ? `${sum}+` : "145+");
        }
        if (pubList.length > 0) setActivePubId(pubList[0].id);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load publications", err);
        setLoading(false);
      });
  }, []);

  const activePub = publications.find((p) => p.id === activePubId) || publications[0];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publications,
          totalCitations,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save publications", err);
    } finally {
      setSaving(false);
    }
  };

  const addPublication = () => {
    const newPub: Publication = {
      id: "pub-" + Date.now(),
      title: "New Research Paper Title",
      authors: "F. Labib, et al.",
      publishedIn: "IEEE Transactions / Journal",
      year: new Date().getFullYear(),
      doi: "",
      url: "",
      citationCount: 0,
      abstract: "",
      figures: [],
      featured: false,
    };
    setPublications([newPub, ...publications]);
    setActivePubId(newPub.id);
  };

  const removePublication = (id: string) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;
    const remaining = publications.filter((p) => p.id !== id);
    setPublications(remaining);
    if (remaining.length > 0) setActivePubId(remaining[0].id);
  };

  const updateActiveField = (field: keyof Publication, value: unknown) => {
    if (!activePub) return;
    setPublications(
      publications.map((p) => (p.id === activePub.id ? { ...p, [field]: value } : p))
    );
  };

  const addFigure = () => {
    if (!activePub) return;
    updateActiveField("figures", [
      ...(activePub.figures || []),
      {
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
        caption: "Fig. Experimental setup / waveform",
      },
    ]);
  };

  const handleFigureUpload = async (
    figIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !activePub) return;

    const key = `${activePub.id}-${figIdx}`;
    setUploadingFig(key);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        const updatedFigs = [...(activePub.figures || [])];
        updatedFigs[figIdx] = { ...updatedFigs[figIdx], url: data.url };
        updateActiveField("figures", updatedFigs);
      }
    } catch (err) {
      console.error("Figure upload failed", err);
    } finally {
      setUploadingFig(null);
    }
  };

  const removeFigure = (figIdx: number) => {
    if (!activePub) return;
    updateActiveField(
      "figures",
      activePub.figures.filter((_, idx) => idx !== figIdx)
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading publications...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Scholarly Papers
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Publications &amp; Waveform Sliders
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addPublication}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Publication</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Publications"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Publications and citations saved successfully!</span>
        </div>
      )}

      {/* Total Citations Metric Configuration Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Total Citations Badge (Public Publication Page)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Customize the total citation count displayed in the top-right badge of the public publications page.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="space-y-1 w-full sm:w-48">
            <label className="text-[11px] font-mono text-slate-400 uppercase">
              Total Citations
            </label>
            <input
              type="text"
              placeholder="e.g. 145+ or 300+"
              value={totalCitations}
              onChange={(e) => setTotalCitations(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-emerald-400 font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Two-column: List + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Publication Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block px-1">
            Publications List ({publications.length})
          </label>
          <div className="space-y-1.5 max-h-[75vh] overflow-y-auto pr-1">
            {publications.map((pub) => {
              const isActive = pub.id === activePubId;
              return (
                <div
                  key={pub.id}
                  onClick={() => setActivePubId(pub.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-emerald-500/10 border-emerald-500/60 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex-none flex items-center justify-center">
                      <BookOpen className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate leading-tight">
                        {pub.title}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-mono">
                        {pub.publishedIn} · {pub.year}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePublication(pub.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded flex-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Publication Editor */}
        {activePub && (
          <div className="lg:col-span-8 space-y-6">
            {/* Metadata Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              {/* Title + Featured row */}
              <div className="flex items-start gap-4">
                <div className="space-y-1 flex-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Paper Title
                  </label>
                  <input
                    type="text"
                    value={activePub.title}
                    onChange={(e) => updateActiveField("title", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="pt-6 flex-none">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activePub.featured || false}
                      onChange={(e) => updateActiveField("featured", e.target.checked)}
                      className="rounded border-slate-800 text-emerald-500 focus:ring-0 w-4 h-4"
                    />
                    <span>Featured</span>
                  </label>
                </div>
              </div>

              {/* Published In / Authors / Year / Citations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Published In
                  </label>
                  <input
                    type="text"
                    value={activePub.publishedIn}
                    onChange={(e) => updateActiveField("publishedIn", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Authors
                  </label>
                  <input
                    type="text"
                    value={activePub.authors}
                    onChange={(e) => updateActiveField("authors", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Year
                  </label>
                  <input
                    type="number"
                    value={activePub.year}
                    onChange={(e) =>
                      updateActiveField("year", parseInt(e.target.value) || 2025)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Citations Count
                  </label>
                  <input
                    type="number"
                    value={activePub.citationCount || 0}
                    onChange={(e) =>
                      updateActiveField("citationCount", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* DOI / URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    DOI
                  </label>
                  <input
                    type="text"
                    placeholder="10.1109/..."
                    value={activePub.doi || ""}
                    onChange={(e) => updateActiveField("doi", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    External Paper URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://doi.org/..."
                    value={activePub.url || ""}
                    onChange={(e) => updateActiveField("url", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Abstract */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase">
                  Abstract
                </label>
                <textarea
                  rows={4}
                  value={activePub.abstract || ""}
                  onChange={(e) => updateActiveField("abstract", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Figures Slider Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Slide Figures &amp; Waveforms ({activePub.figures?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={addFigure}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Figure Slide</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activePub.figures?.map((fig, figIdx) => (
                  <div
                    key={figIdx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fig.url}
                        alt="Figure"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-400 cursor-pointer flex items-center gap-1 flex-none">
                        <Upload className="w-3 h-3" />
                        <span>
                          {uploadingFig === `${activePub.id}-${figIdx}`
                            ? "Uploading..."
                            : "Upload"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFigureUpload(figIdx, e)}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="text"
                        placeholder="Image URL"
                        value={fig.url}
                        onChange={(e) => {
                          const updated = [...(activePub.figures || [])];
                          updated[figIdx] = { ...updated[figIdx], url: e.target.value };
                          updateActiveField("figures", updated);
                        }}
                        className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-white font-mono focus:outline-none focus:border-emerald-500"
                      />

                      <button
                        type="button"
                        onClick={() => removeFigure(figIdx)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded flex-none"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Figure Caption"
                      value={fig.caption || ""}
                      onChange={(e) => {
                        const updated = [...(activePub.figures || [])];
                        updated[figIdx] = { ...updated[figIdx], caption: e.target.value };
                        updateActiveField("figures", updated);
                      }}
                      className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
