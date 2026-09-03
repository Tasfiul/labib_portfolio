"use client";

import React, { useEffect, useState } from "react";
import { GalleryItem, GalleryCategory } from "@/types";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  FolderPlus,
} from "lucide-react";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load gallery", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories, items }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save gallery", err);
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    const newCat: GalleryCategory = {
      id: "gal-cat-" + Date.now(),
      name: "New Section",
      slug: "section-" + Date.now(),
    };
    setCategories([...categories, newCat]);
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const updateCategory = (id: string, name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, name, slug } : c))
    );
  };

  const addItem = () => {
    const newItem: GalleryItem = {
      id: "gal-" + Date.now(),
      title: "New Photo Title",
      imageUrl:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
      caption: "Description of the moment or lab experiment...",
      categories: ["research"],
      date: new Date().toISOString().split("T")[0],
    };
    setItems([newItem, ...items]);
  };

  const removeItem = (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof GalleryItem, value: unknown) => {
    setItems(
      items.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const toggleItemCategory = (itemId: string, categorySlug: string) => {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        const current = item.categories || [];
        const updated = current.includes(categorySlug)
          ? current.filter((s) => s !== categorySlug)
          : [...current, categorySlug];
        return { ...item, categories: updated };
      })
    );
  };

  const handleImageUpload = async (
    itemId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingItemId(itemId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        updateItem(itemId, "imageUrl", data.url);
      }
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setUploadingItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading gallery management...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Showcase Management
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Gallery Categories & Pictures
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Picture</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Gallery"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Gallery updated and published successfully!</span>
        </div>
      )}

      {/* Categories Config Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Gallery Sections / Categories
            </h2>
          </div>
          <button
            type="button"
            onClick={addCategory}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800"
            >
              <input
                type="text"
                value={cat.name}
                onChange={(e) => updateCategory(cat.id, e.target.value)}
                className="bg-transparent text-xs text-white font-medium focus:outline-none w-28"
              />
              <span className="text-[10px] text-slate-500 font-mono">
                ({cat.slug})
              </span>
              {cat.slug !== "all" && (
                <button
                  type="button"
                  onClick={() => removeCategory(cat.id)}
                  className="p-1 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pictures Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          All Showcase Pictures ({items.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Image Preview Box */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Upload or URL */}
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {uploadingItemId === item.id ? "Uploading..." : "Upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(item.id, e)}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={item.imageUrl}
                    onChange={(e) =>
                      updateItem(item.id, "imageUrl", e.target.value)
                    }
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Title */}
                <input
                  type="text"
                  placeholder="Photo Title"
                  value={item.title || ""}
                  onChange={(e) => updateItem(item.id, "title", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                />

                {/* Caption */}
                <textarea
                  rows={2}
                  placeholder="Image Caption..."
                  value={item.caption || ""}
                  onChange={(e) => updateItem(item.id, "caption", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500"
                />

                {/* Categories Assignment */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block">
                    Assign to Category / Categories:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories
                      .filter((c) => c.slug !== "all")
                      .map((c) => {
                        const isSelected = item.categories?.includes(c.slug);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => toggleItemCategory(item.id, c.slug)}
                            className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors ${
                              isSelected
                                ? "bg-emerald-500 text-slate-950 font-bold"
                                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {c.name}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <input
                  type="date"
                  value={item.date || ""}
                  onChange={(e) => updateItem(item.id, "date", e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-[11px] text-slate-400 px-2 py-1 rounded font-mono"
                />

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded"
                  title="Delete picture"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
