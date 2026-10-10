// Email, который нужно подставить на следующей странице (вход, «забыли пароль»).
// Передаём через sessionStorage, а не в адресе страницы: адрес попадает в историю браузера и логи сервера.
const KEY = "koshi-prefill-email";

export function rememberEmail(email: string) {
    try {
        if (email.trim()) sessionStorage.setItem(KEY, email.trim());
    } catch {
        // хранилище недоступно — поле просто останется пустым
    }
}

// Читает и сразу удаляет, чтобы email не подставлялся снова при следующих визитах
export function takeEmail(): string {
    try {
        const value = sessionStorage.getItem(KEY) ?? "";
        sessionStorage.removeItem(KEY);
        return value;
    } catch {
        return "";
    }
}
