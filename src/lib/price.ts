// Цены могут быть с пенсами (12.5): показываем "12.50", а целые — как раньше, без ".00"
export const formatPrice = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return "";
    const n = Number(value);
    if (!Number.isFinite(n)) return String(value);
    const rounded = Math.round(n * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
};
