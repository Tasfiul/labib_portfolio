"use client";

import React, { useEffect, useState } from "react";
import { ResumeCategory, ResumeItem } from "@/types";
import {
  Save,
  Plus,
  Trash2,
  FolderPlus,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Briefcase,
  Layers,
} from "lucide-react";

export default function AdminResumePage() {
  const [categories, setCategories] = useState<ResumeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/resume")
      .then((res) => res.json())
      .then((data: ResumeCategory[]) => {
        setCategories(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load resume", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categories),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save resume", err);
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    const newCat: ResumeCategory = {
      id: "cat-" + Date.now(),
      name: "New Section",
      slug: "new-section-" + Date.now(),
      order: categories.length + 1,
      subtitle: "",
      summary: "",
      items: [],
    };
    setCategories([...categories, newCat]);
  };

  const removeCategory = (catId: string) => {
    if (!confirm("Are you sure you want to delete this category and all its items?"))
      return;
    setCategories(categories.filter((c) => c.id !== catId));
  };

  const updateCategoryField = (
    catId: string,
    field: keyof ResumeCategory,
    value: unknown
  ) => {
    setCategories(
      categories.map((c) => (c.id === catId ? { ...c, [field]: value } : c))
    );
  };

  const addItemToCategory = (catId: string) => {
    const newItem: ResumeItem = {
      id: "item-" + Date.now(),
      title: "Position / Role",
      organization: "Organization / University",
      period: "2024 - Present",
      location: "",
      description: "",
      tags: [],
    };
    setCategories(
      categories.map((c) =>
        c.id === catId ? { ...c, items: [...(c.items || []), newItem] } : c
      )
    );
  };

  const removeItemFromCategory = (catId: string, itemId: string) => {
    setCategories(
      categories.map((c) =>
        c.id === catId
          ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
          : c
      )
    );
  };

  const updateItemField = (
    catId: string,
    itemId: string,
    field: keyof ResumeItem,
    value: unknown
  ) => {
    setCategories(
      categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, [field]: value } : i
              ),
            }
          : c
      )
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading resume categories...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Curriculum Vitae Management
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Resume Sections & Items
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addCategory}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-emerald-400" />
            <span>Add Category</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Resume"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Resume sections saved successfully!</span>
        </div>
      )}

      {/* Categories Accordions */}
      <div className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div
            key={cat.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6"
          >
            {/* Category Header Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) =>
                      updateCategoryField(cat.id, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    value={cat.subtitle || ""}
                    onChange={(e) =>
                      updateCategoryField(cat.id, "subtitle", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Display Order (Number)
                  </label>
                  <input
                    type="number"
                    value={cat.order || catIdx + 1}
                    onChange={(e) =>
                      updateCategoryField(
                        cat.id,
                        "order",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  type="button"
                  onClick={() => addItemToCategory(cat.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeCategory(cat.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Summary */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase">
                Section Summary / Overview Paragraph
              </label>
              <textarea
                rows={2}
                value={cat.summary || ""}
                onChange={(e) =>
                  updateCategoryField(cat.id, "summary", e.target.value)
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Items Inside Category */}
            <div className="space-y-4 pt-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Entries in {cat.name} ({cat.items?.length || 0})</span>
              </div>

              {cat.items?.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">
                        Title / Role
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateItemField(cat.id, item.id, "title", e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">
                        Organization / Inst.
                      </label>
                      <input
                        type="text"
                        value={item.organization}
                        onChange={(e) =>
                          updateItemField(
                            cat.id,
                            item.id,
                            "organization",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">
                        Period / Years
                      </label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) =>
                          updateItemField(cat.id, item.id, "period", e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1 flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">
                          Location (Opt.)
                        </label>
                        <input
                          type="text"
                          value={item.location || ""}
                          onChange={(e) =>
                            updateItemField(
                              cat.id,
                              item.id,
                              "location",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItemFromCategory(cat.id, item.id)}
                        className="p-2 text-slate-500 hover:text-red-400 mt-4 rounded"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">
                      Description / Key Highlights
                    </label>
                    <textarea
                      rows={2}
                      value={item.description || ""}
                      onChange={(e) =>
                        updateItemField(
                          cat.id,
                          item.id,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={item.tags?.join(", ") || ""}
                        onChange={(e) =>
                          updateItemField(
                            cat.id,
                            item.id,
                            "tags",
                            e.target.value.split(",").map((t) => t.trim())
                          )
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">
                        Link URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.link || ""}
                        onChange={(e) =>
                          updateItemField(cat.id, item.id, "link", e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
