import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  description?:string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    increaseQuantity:(state,action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if(item) item.quantity += 1;
    },
    increaseQuantityZero:(state,action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if(item && item.quantity >= 0) item.quantity += 1;
    },
    decreaseQuantity:(state,action) => {
      const item = state.items.find((i) => i.id === action.payload)
      if( item && item.quantity > 1) item.quantity -= 1;
    },
   decreaseQuantityzero: (state, action) => {
  const itemIndex = state.items.findIndex((i) => i.id === action.payload);
  const item = state.items[itemIndex];
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      state.items.splice(itemIndex, 1); // удаляем товар полностью
    }
  }
},
  },
});

export const { addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity, decreaseQuantityzero,increaseQuantityZero} = cartSlice.actions;
export default cartSlice.reducer;
