"use client";

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";

// Вошёл ли покупатель. Токен в httpOnly-cookie, странице он не виден — спрашиваем у сервера.
// "unknown" — пока ответа нет (или сервер недоступен): ссылки ведут как обычно, профиль проверит сам.
export type AuthStatus = "unknown" | "guest" | "user";

interface AuthContextType {
    status: AuthStatus;
    // Перепроверить у сервера (после входа)
    refresh: () => Promise<AuthStatus>;
    // Сразу выставить состояние, когда оно уже известно (выход, ответ 401)
    setStatus: (status: AuthStatus) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [status, setStatus] = useState<AuthStatus>("unknown");

    const refresh = useCallback(async (): Promise<AuthStatus> => {
        try {
            // /session отвечает гостю 200 с user: null — без ошибки 401 в консоли браузера
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check/session`, {credentials: "include"});
            const next: AuthStatus = res.ok ? ((await res.json()).user ? "user" : "guest") : "unknown";
            setStatus(next);
            return next;
        } catch {
            setStatus("unknown");
            return "unknown";
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return <AuthContext.Provider value={{status, refresh, setStatus}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
