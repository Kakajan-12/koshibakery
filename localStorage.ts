export function loadState() {
  try {
    if (typeof window === 'undefined') return undefined; // Если сервер — не грузим

    const serializedState = localStorage.getItem('cart');
    if (!serializedState) return undefined;

    return { cart: JSON.parse(serializedState) };
  } catch (err) {
    console.error('Ошибка загрузки из localStorage:', err);
    return undefined;
  }
}

export function saveState(state: any) {
  try {
    if (typeof window === 'undefined') return; // Если сервер — не сохраняем

    const serializedState = JSON.stringify(state.cart);
    localStorage.setItem('cart', serializedState);
  } catch (err) {
    console.error('Ошибка сохранения в localStorage:', err);
  }
}
