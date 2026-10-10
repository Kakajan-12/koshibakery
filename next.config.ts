import type { NextConfig } from "next";

// Картинки грузятся с API (/uploads). Адрес берём из NEXT_PUBLIC_API_URL,
// чтобы не переключать конфиг руками между localhost и продом.
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");

const uploadsPattern = {
    protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
    hostname: apiUrl.hostname,
    port: apiUrl.port,
    pathname: "/uploads/**",
};

// Защитные заголовки для всех страниц: сайт нельзя встроить в чужой фрейм (кликджекинг),
// браузер не угадывает тип файлов, в чужие сайты не уходит полный адрес страницы,
// а HTTPS запоминается на год. На localhost браузеры HSTS игнорируют.
const securityHeaders = [
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
    poweredByHeader: false,
    images: {
        unoptimized: true,
        remotePatterns: [uploadsPattern],
    },
    async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
    },
};

export default nextConfig;
