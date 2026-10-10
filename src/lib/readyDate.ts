// Дата готовности заказа «yyyy-mm-dd» → подписи. Разбираем как местную дату, без сдвига часовых поясов.
const parse = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
};

const isDate = (value?: string | null): value is string => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);

// «Sat 12 Oct»
export const shortDate = (value: string) =>
    parse(value).toLocaleDateString("en-GB", {weekday: "short", day: "numeric", month: "short"});

// «Sat 12 Oct, 14:00» или «Saturday, 12 October, 14:00»; null — у старых заказов без даты
export const readyLabel = (date?: string | null, time?: string | null, style: "short" | "long" = "short"): string | null => {
    if (!isDate(date)) return null;
    const day = style === "long"
        ? parse(date).toLocaleDateString("en-GB", {weekday: "long", day: "numeric", month: "long"})
        : shortDate(date);
    return time ? `${day}, ${time}` : day;
};
