"use client";

import React, { useEffect, useState } from "react";
import { Project, ProjectBlock, BlockType } from "@/types";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  Layers,
  CheckCircle,
  Video,
  Image as ImageIcon,
  Type,
  Heading,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string>("");
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingBlock, setUploadingBlock] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data: Project[]) => {
        setProjects(data || []);
        if (data.length > 0) {
          setActiveProjectId(data[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load projects", err);
        setLoading(false);
      });
  }, []);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projects),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save projects", err);
    } finally {
      setSaving(false);
    }
  };

  const addProject = () => {
    const newProj: Project = {
      id: "proj-" + Date.now(),
      title: "New Engineering Project",
      slug: "new-project-" + Date.now(),
      subtitle: "",
      summary: "",
      thumbnail:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
      category: "Power Electronics",
      tags: ["Power Electronics", "PCB Design"],
      featured: false,
      createdAt: new Date().toISOString(),
      blocks: [
        {
          id: "b-1",
          type: "title",
          content: "Project Architecture & Innovation",
          highlight: true,
        },
        {
          id: "b-2",
          type: "text",
          content: "Detailed description of the design and experimentation...",
          highlight: false,
        },
      ],
    };
    setProjects([newProj, ...projects]);
    setActiveProjectId(newProj.id);
  };

  const removeProject = (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const remaining = projects.filter((p) => p.id !== id);
    setProjects(remaining);
    if (remaining.length > 0) {
      setActiveProjectId(remaining[0].id);
    }
  };

  const updateActiveField = (field: keyof Project, value: unknown) => {
    if (!activeProject) return;
    setProjects(
      projects.map((p) =>
        p.id === activeProject.id ? { ...p, [field]: value } : p
      )
    );
  };

  const addBlock = (type: BlockType) => {
    if (!activeProject) return;
    const newBlock: ProjectBlock = {
      id: "b-" + Date.now(),
      type,
      content:
        type === "image"
          ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85"
          : type === "video"
          ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          : "",
      caption: type === "image" || type === "video" ? "Caption..." : undefined,
      highlight: false,
    };
    updateActiveField("blocks", [...(activeProject.blocks || []), newBlock]);
  };

  const removeBlock = (blockId: string) => {
    if (!activeProject) return;
    updateActiveField(
      "blocks",
      activeProject.blocks.filter((b) => b.id !== blockId)
    );
  };

  const updateBlock = (
    blockId: string,
    field: keyof ProjectBlock,
    value: unknown
  ) => {
    if (!activeProject) return;
    updateActiveField(
      "blocks",
      activeProject.blocks.map((b) =>
        b.id === blockId ? { ...b, [field]: value } : b
      )
    );
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !activeProject) return;

    setUploadingThumb(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        updateActiveField("thumbnail", data.url);
      }
    } catch (err) {
      console.error("Thumbnail upload failed", err);
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleBlockImageUpload = async (
    blockId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBlock(blockId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        updateBlock(blockId, "content", data.url);
      }
    } catch (err) {
      console.error("Block image upload failed", err);
    } finally {
      setUploadingBlock(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading projects...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Block-Type CMS
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Projects & Embedded Media Blocks
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addProject}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Project</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save All Projects"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Projects saved successfully!</span>
        </div>
      )}

      {/* Two column: Project Selector + Active Project Blocks Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Project Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block px-1">
            Projects List ({projects.length})
          </label>
          <div className="space-y-1.5 max-h-[75vh] overflow-y-auto pr-1">
            {projects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveProjectId(proj.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-emerald-500/10 border-emerald-500/60 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-950 flex-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proj.thumbnail || ""}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">
                        {proj.title}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-mono">
                        {proj.category}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProject(proj.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Project Settings & Block Builder */}
        {activeProject && (
          <div className="lg:col-span-8 space-y-6">
            {/* Project Metadata Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={activeProject.title}
                    onChange={(e) => updateActiveField("title", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={activeProject.slug}
                    onChange={(e) => updateActiveField("slug", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Category (e.g. Power Electronics)
                  </label>
                  <input
                    type="text"
                    value={activeProject.category}
                    onChange={(e) => updateActiveField("category", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Subtitle / Catchphrase
                  </label>
                  <input
                    type="text"
                    value={activeProject.subtitle}
                    onChange={(e) => updateActiveField("subtitle", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Summary (Short card description)
                  </label>
                  <textarea
                    rows={2}
                    value={activeProject.summary || ""}
                    onChange={(e) => updateActiveField("summary", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Thumbnail upload */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Project Thumbnail (Sharp WebP Upload or URL)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 font-semibold cursor-pointer flex items-center gap-1.5 flex-none">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingThumb ? "Uploading..." : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={activeProject.thumbnail}
                      onChange={(e) => updateActiveField("thumbnail", e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={activeProject.tags?.join(", ") || ""}
                    onChange={(e) =>
                      updateActiveField(
                        "tags",
                        e.target.value.split(",").map((t) => t.trim())
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    GitHub URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={activeProject.githubUrl || ""}
                    onChange={(e) => updateActiveField("githubUrl", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Live Demo / Paper URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={activeProject.demoUrl || ""}
                    onChange={(e) => updateActiveField("demoUrl", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Blocks Builder */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Content Blocks</h3>
                  <p className="text-xs text-slate-400">
                    Add headers, rich text, full-resolution images, and YouTube/Drive video embeds.
                  </p>
                </div>

                {/* Block Add Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => addBlock("title")}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Heading className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Title</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("subtitle")}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Type className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Subtitle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("text")}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("image")}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("video")}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Video</span>
                  </button>
                </div>
              </div>

              {/* Blocks List */}
              <div className="space-y-4">
                {activeProject.blocks?.map((block, bIdx) => (
                  <div
                    key={block.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                        Block #{bIdx + 1}: {block.type}
                      </span>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={block.highlight || false}
                            onChange={(e) =>
                              updateBlock(block.id, "highlight", e.target.checked)
                            }
                            className="rounded border-slate-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                          />
                          <span>Highlight Style</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => removeBlock(block.id)}
                          className="p-1 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Block inputs based on type */}
                    {block.type === "title" || block.type === "subtitle" ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder={`Enter ${block.type} text...`}
                          value={block.content}
                          onChange={(e) =>
                            updateBlock(block.id, "content", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500"
                        />
                        <input
                          type="text"
                          placeholder="Optional Hyperlink for this title..."
                          value={block.url || ""}
                          onChange={(e) =>
                            updateBlock(block.id, "url", e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    ) : block.type === "text" ? (
                      <textarea
                        rows={4}
                        placeholder="Enter paragraph text..."
                        value={block.content}
                        onChange={(e) =>
                          updateBlock(block.id, "content", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500"
                      />
                    ) : block.type === "image" ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <label className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 cursor-pointer flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {uploadingBlock === block.id
                                ? "Uploading..."
                                : "Upload Image"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleBlockImageUpload(block.id, e)}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={block.content}
                            onChange={(e) =>
                              updateBlock(block.id, "content", e.target.value)
                            }
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Image Caption"
                          value={block.caption || ""}
                          onChange={(e) =>
                            updateBlock(block.id, "caption", e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    ) : block.type === "video" ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="YouTube Video URL (https://www.youtube.com/watch?v=...) or Google Drive Link"
                          value={block.content}
                          onChange={(e) =>
                            updateBlock(block.id, "content", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                        />
                        <input
                          type="text"
                          placeholder="Video Caption"
                          value={block.caption || ""}
                          onChange={(e) =>
                            updateBlock(block.id, "caption", e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    ) : null}
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
