"use client";

import {AlertCircle, Loader2} from "lucide-react";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {manrope, raleway} from "@/app/fonts";

/**
 * Модальное подтверждение действия. Пока идёт запрос (busy), окно не закрывается;
 * ошибка показывается внутри окна, чтобы можно было повторить.
 */
export default function ConfirmDialog({
    open, title, description, confirmLabel, busyLabel, tone = "default", busy, error, onConfirm, onClose,
}: {
    open: boolean;
    title: string;
    description: React.ReactNode;
    confirmLabel: string;
    busyLabel?: string;
    tone?: "default" | "danger";
    busy?: boolean;
    error?: string;
    onConfirm: () => void;
    onClose: () => void;
}) {
    const confirmColor = tone === "danger" ? "bg-[#B42318] hover:bg-[#912018]" : "main-button-color hover:brightness-110";

    return (
        <Dialog open={open} onOpenChange={(next) => !next && !busy && onClose()}>
            <DialogContent showCloseButton={!busy} className="sm:max-w-md rounded-2xl p-6 gap-5 bg-white">
                <DialogHeader className="text-left">
                    <DialogTitle className={`${raleway.className} text-xl font-bold text-[#12100F]`}>{title}</DialogTitle>
                    <DialogDescription asChild>
                        <div className={`${manrope.className} text-sm leading-relaxed text-[#6F5E53]`}>{description}</div>
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div role="alert" className="flex items-start gap-3 rounded-xl bg-[#FEF3F2] ring-1 ring-[#B42318]/20 p-3">
                        <AlertCircle className="w-5 h-5 shrink-0 text-[#B42318]" aria-hidden="true"/>
                        <p className={`${manrope.className} text-sm text-[#912018]`}>{error}</p>
                    </div>
                )}

                <DialogFooter className="gap-3">
                    <button type="button" onClick={onClose} disabled={busy}
                            className={`${manrope.className} h-11 px-5 rounded-full bg-white text-[#3B302B] text-sm font-semibold ring-1 ring-[#B8485B]/25 cursor-pointer transition hover:ring-[#B8485B] disabled:opacity-60`}>
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} disabled={busy} autoFocus
                            className={`${manrope.className} inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full text-white text-sm font-semibold shadow-sm cursor-pointer transition disabled:opacity-70 disabled:cursor-wait ${confirmColor}`}>
                        {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true"/>}
                        {busy ? busyLabel ?? confirmLabel : confirmLabel}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
