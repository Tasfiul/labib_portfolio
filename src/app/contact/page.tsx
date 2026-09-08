"use client";

import React, { useEffect, useState } from "react";
import { SiteConfig } from "@/types";
import PageTransition from "@/components/PageTransition";
import SocialIcon from "@/components/SocialIcon";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

export default function ContactPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error("Failed to load contact settings", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setStatusMsg(data.message || "Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setStatusMsg(data.error || "Failed to send message. Please try again.");
      }
    } catch {
      setStatus("error");
      setStatusMsg("A network error occurred. Please try again later.");
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-[#086972] dark:text-[#68b6c4]">
            Get in Touch
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1c2830] dark:text-white mt-1">
            Contact & Academic Inquiries
          </h1>
          <p className="text-sm sm:text-base text-[#4a606a] dark:text-[#9bb0bb] mt-2 max-w-2xl">
            {config?.contactIntro || "Feel free to reach out for research collaborations, STEM speaking engagements, or engineering consultations."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Message Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#1c2830] dark:text-white border-b border-[#edf1f2] dark:border-[#243640] pb-4">
                Send a Direct Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-[#768d97] dark:text-[#9bb0bb]">
                      Your Name <span className="text-[#086972] dark:text-[#68b6c4]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Jane Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#d6e2e6] dark:border-[#243640] bg-[#f4f6f5] dark:bg-[#121a20] text-base text-[#1c2830] dark:text-white focus:outline-none focus:border-[#086972] dark:focus:border-[#68b6c4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-[#768d97] dark:text-[#9bb0bb]">
                      Email Address <span className="text-[#086972] dark:text-[#68b6c4]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jane@institution.edu"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#d6e2e6] dark:border-[#243640] bg-[#f4f6f5] dark:bg-[#121a20] text-base text-[#1c2830] dark:text-white focus:outline-none focus:border-[#086972] dark:focus:border-[#68b6c4]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-[#768d97] dark:text-[#9bb0bb]">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Research Collaboration / Keynote Invitation"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#d6e2e6] dark:border-[#243640] bg-[#f4f6f5] dark:bg-[#121a20] text-base text-[#1c2830] dark:text-white focus:outline-none focus:border-[#086972] dark:focus:border-[#68b6c4]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-[#768d97] dark:text-[#9bb0bb]">
                    Message <span className="text-[#086972] dark:text-[#68b6c4]">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#d6e2e6] dark:border-[#243640] bg-[#f4f6f5] dark:bg-[#121a20] text-base text-[#1c2830] dark:text-white focus:outline-none focus:border-[#086972] dark:focus:border-[#68b6c4] resize-y"
                  />
                </div>

                {status === "success" && (
                  <div className="p-4 rounded-xl bg-teal-500/10 border border-[#086972]/30 text-[#086972] dark:text-[#68b6c4] text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 flex-none" />
                    <span>{statusMsg}</span>
                  </div>
                )}

                {status === "error" && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-none" />
                    <span>{statusMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-[#086972] hover:bg-[#06535a] dark:bg-[#68b6c4] dark:hover:bg-[#85c8d4] text-white dark:text-[#121a20] shadow-md shadow-[#086972]/15 dark:shadow-[#68b6c4]/15 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === "sending" ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Multi-Contact Info & Standout Links */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Details Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#1c2830] dark:text-white border-b border-[#edf1f2] dark:border-[#243640] pb-3">
                Contact Information
              </h2>

              {/* Emails List */}
              {config?.emails && config.emails.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-bold uppercase tracking-wider text-[#086972] dark:text-[#68b6c4]">
                    Email Addresses
                  </p>
                  <div className="space-y-1.5">
                    {config.emails.map((email, idx) => (
                      <a
                        key={idx}
                        href={`mailto:${email}`}
                        className="block text-base text-[#4a606a] dark:text-[#d0dee4] font-mono select-text hover:text-[#086972] dark:hover:text-[#68b6c4] transition-colors"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Phone Numbers List */}
              {config?.phoneNumbers && config.phoneNumbers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-bold uppercase tracking-wider text-[#086972] dark:text-[#68b6c4]">
                    Phone / Mobile
                  </p>
                  <div className="space-y-1.5">
                    {config.phoneNumbers.map((phone, idx) => (
                      <p
                        key={idx}
                        className="block text-base text-[#4a606a] dark:text-[#d0dee4] font-mono select-text cursor-default"
                      >
                        {phone}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Addresses List */}
              {config?.addresses && config.addresses.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-bold uppercase tracking-wider text-[#086972] dark:text-[#68b6c4]">
                    Locations / Affiliations
                  </p>
                  <div className="space-y-2">
                    {config.addresses.map((addr, idx) => (
                      <p
                        key={idx}
                        className="text-base text-[#4a606a] dark:text-[#d0dee4] leading-relaxed text-justify bg-[#f4f6f5] dark:bg-[#121a20] p-4 rounded-xl border border-[#d6e2e6] dark:border-[#243640]"
                      >
                        {addr}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Standout External Links Grid */}
            {config?.socialLinks && config.socialLinks.length > 0 && (
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#768d97] dark:text-[#9bb0bb]">
                  Connect on Academic & Social Platforms
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {config.socialLinks.map((item) => (
                    <a
                      key={item.id || item.platform}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl border border-[#d6e2e6] dark:border-[#243640] bg-[#f4f6f5] dark:bg-[#121a20] hover:border-[#086972]/40 dark:hover:border-[#68b6c4]/40 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#086972] dark:text-[#68b6c4] group-hover:scale-110 transition-transform">
                          <SocialIcon platform={item.platform} className="w-4 h-4" />
                        </span>
                        <span className="text-sm font-semibold text-[#1c2830] dark:text-[#f0f4f5] group-hover:text-[#086972] dark:group-hover:text-[#68b6c4]">
                          {item.platform}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#768d97] group-hover:text-[#086972] dark:group-hover:text-[#68b6c4] group-hover:translate-x-0.5 transition-all" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
