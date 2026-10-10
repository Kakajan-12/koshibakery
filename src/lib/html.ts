import DOMPurify from "dompurify";

// Поля из редактора админки (TipTap) приходят как HTML: "<p>текст</p>"; пустое поле — "<p></p>"

const ENTITIES: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
};

// HTML → обычный текст, для коротких подписей вроде карточки товара
export const htmlToText = (html?: string | null): string =>
    (html ?? "")
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<\/(p|li|h[1-6])>/gi, " ")
        .replace(/<[^>]*>/g, "")
        .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m])
        .replace(/\s+/g, " ")
        .trim();

export const isEmptyHtml = (html?: string | null): boolean => htmlToText(html) === "";

// HTML из админки перед вставкой через dangerouslySetInnerHTML: убираем скрипты, обработчики (onerror=...),
// javascript:-ссылки и прочее, что могло бы выполниться у посетителя, если админку взломают.
// DOMPurify нужен DOM — на сервере (пререндер) отдаём пустую строку; данные товара всё равно грузятся в браузере.
export const safeHtml = (html?: string | null): string =>
    typeof window === "undefined" || !html ? "" : DOMPurify.sanitize(html);

// Карта в контактах — HTML-код встраивания из Google Maps. Вставлять его целиком нельзя
// (туда можно положить любой скрипт), поэтому берём только адрес и проверяем, что это Google Maps.
export const mapEmbedSrc = (html?: string | null): string | null => {
    const src = html?.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!src) return null;
    try {
        const url = new URL(src.replace(/&amp;/g, "&"));
        const isGoogle = url.hostname === "www.google.com" || url.hostname === "maps.google.com";
        return url.protocol === "https:" && isGoogle && url.pathname.startsWith("/maps/embed") ? url.href : null;
    } catch {
        return null;
    }
};

// Ссылка из админки (кнопка слайда): только путь на сайте или http(s). javascript: и прочее — отбрасываем.
export const safeHref = (link?: string | null): string | null => {
    const value = link?.trim();
    if (!value) return null;
    if (value.startsWith("/") && !value.startsWith("//")) return value;
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
    } catch {
        return null;
    }
};
