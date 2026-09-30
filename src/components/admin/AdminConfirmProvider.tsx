"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  Trash2,
} from "lucide-react";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
}

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AdminConfirmContextType {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
  notify: (message: string, type?: "success" | "error" | "info") => void;
}

const AdminConfirmContext = createContext<AdminConfirmContextType | undefined>(
  undefined
);

export function useAdminConfirm() {
  const ctx = useContext(AdminConfirmContext);
  if (!ctx) {
    throw new Error(
      "useAdminConfirm must be used within an AdminConfirmProvider"
    );
  }
  return ctx;
}

export function AdminConfirmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dialogState, setDialogState] = useState<{
    options: ConfirmOptions;
    resolve: (val: boolean) => void;
  } | null>(null);

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const confirm = useCallback((options: ConfirmOptions | string) => {
    const opts: ConfirmOptions =
      typeof options === "string"
        ? {
            title: "Please Confirm",
            message: options,
            confirmText: "Yes, Confirm",
            cancelText: "No, Cancel",
            variant: "danger",
          }
        : {
            title: options.title || "Please Confirm",
            message: options.message,
            confirmText: options.confirmText || "Yes, Confirm",
            cancelText: options.cancelText || "No, Cancel",
            variant: options.variant || "danger",
          };

    return new Promise<boolean>((resolve) => {
      setDialogState({
        options: opts,
        resolve: (result: boolean) => {
          resolve(result);
          setDialogState(null);
        },
      });
    });
  }, []);

  const notify = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const id =
        "toast-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  useEffect(() => {
    if (!dialogState) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dialogState.resolve(false);
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        dialogState.resolve(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dialogState]);

  return (
    <AdminConfirmContext.Provider value={{ confirm, notify }}>
      {children}

      {/* In-Website Confirmation Modal */}
      {dialogState && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => dialogState.resolve(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`relative w-full max-w-md rounded-2xl bg-slate-900 border p-6 shadow-2xl shadow-black/80 space-y-5 transform transition-all ${
              dialogState.options.variant === "danger"
                ? "border-red-500/40 shadow-red-500/10"
                : dialogState.options.variant === "warning"
                ? "border-amber-500/40 shadow-amber-500/10"
                : "border-[#68b6c4]/40 shadow-[#68b6c4]/10"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl border flex-none ${
                  dialogState.options.variant === "danger"
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : dialogState.options.variant === "warning"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-[#086972]/20 text-[#68b6c4] border-[#086972]/40"
                }`}
              >
                {dialogState.options.variant === "danger" ? (
                  <Trash2 className="w-6 h-6" />
                ) : dialogState.options.variant === "warning" ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Info className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {dialogState.options.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {dialogState.options.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => dialogState.resolve(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => dialogState.resolve(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer"
              >
                {dialogState.options.cancelText || "No, Cancel"}
              </button>

              <button
                type="button"
                autoFocus
                onClick={() => dialogState.resolve(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 ${
                  dialogState.options.variant === "danger"
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                    : dialogState.options.variant === "warning"
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20"
                    : "bg-[#68b6c4] hover:bg-[#5aa0ad] text-[#121a20] shadow-[#68b6c4]/20"
                }`}
              >
                {dialogState.options.confirmText || "Yes, Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating In-Website Toasts */}
      <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${
              toast.type === "success"
                ? "bg-slate-900/95 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10"
                : toast.type === "error"
                ? "bg-slate-900/95 border-red-500/40 text-red-400 shadow-red-500/10"
                : "bg-slate-900/95 border-[#68b6c4]/40 text-[#68b6c4] shadow-[#68b6c4]/10"
            }`}
          >
            <div className="flex-none">
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : toast.type === "error" ? (
                <AlertCircle className="w-5 h-5 text-red-400" />
              ) : (
                <Info className="w-5 h-5 text-[#68b6c4]" />
              )}
            </div>
            <p className="text-xs font-medium text-slate-200 flex-1">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </AdminConfirmContext.Provider>
  );
}
