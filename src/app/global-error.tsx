"use client";

// Последний рубеж: ошибка в самом layout (шапка, провайдеры). Обычные стили и шрифты здесь могут быть
// недоступны, поэтому всё инлайн и без зависимостей.
export default function GlobalError({reset}: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang="en">
        <body style={{margin: 0, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#833B45", fontFamily: "Helvetica, Arial, sans-serif"}}>
        <div style={{background: "#F6EEEC", borderRadius: 24, padding: "48px 32px", maxWidth: 440, margin: 16, textAlign: "center"}}>
            <div style={{fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, color: "#B8485B"}}>Koşi</div>
            <h1 style={{fontSize: 24, color: "#12100F", margin: "16px 0 8px"}}>Something went wrong</h1>
            <p style={{fontSize: 15, lineHeight: 1.6, color: "#6F5E53", margin: "0 0 24px"}}>
                Sorry, the site couldn&apos;t load. Please try again in a moment.
            </p>
            <button type="button" onClick={reset}
                    style={{background: "#B8485B", color: "#fff", border: 0, borderRadius: 999, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer"}}>
                Try again
            </button>
        </div>
        </body>
        </html>
    );
}
