import { configureStore } from '@reduxjs/toolkit'
import { productApi } from './services/productApi'
import cartReducer from './features/cartSlice'
import { loadState, saveState } from './localStorage'
import  searchReducer from './features/searchQuery';

// Загружаем сохранённое состояние из localStorage
const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    // Основные редьюсеры
    cart: cartReducer,
    search: searchReducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
  preloadedState,  
})

// Подписываемся на изменения в store и сохраняем корзину в localStorage
store.subscribe(() => {
  saveState(store.getState());
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
