import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
 showSearch: boolean;
  search: string;
}

const initialState: SearchState = {
  search: '',
  showSearch: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    selectQuery: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    resetQuery: () => initialState,
    setShowSearch: (state, action: PayloadAction<boolean>) => {
       state.showSearch = action.payload;
     },
  },
});

export const { selectQuery, resetQuery, setShowSearch } = searchSlice.actions;
export default searchSlice.reducer;
