import {mapEmbedSrc} from "@/lib/html";

// Карта из контактов. Из кода встраивания, который вставили в админке, берём только адрес Google Maps
// и рисуем свой iframe — любой другой HTML (скрипты, чужие сайты) на страницу не попадает.
export default function MapEmbed({html, className = "w-full h-full"}: { html?: string | null; className?: string }) {
    const src = mapEmbedSrc(html);
    if (!src) return <p className="text-gray-500 text-center">Map not available</p>;

    return (
        <iframe
            src={src}
            title="Koshi Bakery on the map"
            className={className}
            style={{border: 0}}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
        />
    );
}
