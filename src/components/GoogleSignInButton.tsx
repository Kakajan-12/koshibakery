"use client";

import {useEffect, useRef, useState} from "react";
import Script from "next/script";

// Минимальная типизация Google Identity Services (скрипт accounts.google.com/gsi/client)
type GoogleId = {
    initialize: (options: {
        client_id: string;
        callback: (response: { credential?: string }) => void;
        ux_mode?: "popup" | "redirect";
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
    }) => void;
    renderButton: (parent: HTMLElement, options: Record<string, string | number>) => void;
};

declare global {
    interface Window {
        google?: { accounts?: { id?: GoogleId } };
    }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * Кнопка «Sign in with Google». Google отдаёт ID-токен, сервер проверяет его (POST /api/login/google)
 * и ставит httpOnly-cookie входа. Без NEXT_PUBLIC_GOOGLE_CLIENT_ID кнопка не показывается.
 */
export default function GoogleSignInButton({remember, text = "continue_with", onSuccess, onError}: {
    remember: boolean;
    text?: "signin_with" | "signup_with" | "continue_with";
    onSuccess: () => void;
    onError: (message: string) => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    const [busy, setBusy] = useState(false);

    // Колбэк Google вызывается позже — берём актуальные значения через ref, а не из замыкания
    const latest = useRef({remember, onSuccess, onError});
    latest.current = {remember, onSuccess, onError};

    useEffect(() => {
        // Скрипт мог загрузиться раньше (переход между страницами) — тогда onLoad не сработает
        if (window.google?.accounts?.id) setReady(true);
    }, []);

    useEffect(() => {
        const gid = window.google?.accounts?.id;
        const container = containerRef.current;
        if (!CLIENT_ID || !ready || !gid || !container) return;

        gid.initialize({
            client_id: CLIENT_ID,
            ux_mode: "popup",
            cancel_on_tap_outside: true,
            callback: async ({credential}) => {
                if (!credential) return latest.current.onError("Google sign-in was cancelled.");
                setBusy(true);
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/google`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        credentials: "include",
                        body: JSON.stringify({credential, remember: latest.current.remember}),
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(data.message || data.error || "Google sign-in failed. Please try again.");
                    latest.current.onSuccess();
                } catch (err) {
                    const message = err instanceof Error ? err.message : "";
                    latest.current.onError(message === "Failed to fetch"
                        ? "We couldn't reach the server. Please check your connection and try again."
                        : message || "Google sign-in failed. Please try again.");
                } finally {
                    setBusy(false);
                }
            },
        });

        container.innerHTML = "";
        gid.renderButton(container, {
            type: "standard",
            theme: "outline",
            size: "large",
            shape: "pill",
            text,
            logo_alignment: "center",
            // Ширина кнопки Google задаётся в пикселях (не больше 400)
            width: Math.min(400, Math.max(200, Math.round(container.getBoundingClientRect().width))),
        });
    }, [ready, text]);

    if (!CLIENT_ID) return null;

    return (
        <>
            <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setReady(true)}/>
            <div className={`relative w-full flex justify-center min-h-11 ${busy ? "opacity-60 pointer-events-none" : ""}`} aria-busy={busy}>
                <div ref={containerRef} className="w-full flex justify-center"/>
            </div>
        </>
    );
}
