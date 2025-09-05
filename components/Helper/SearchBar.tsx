'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setShowSearch, selectQuery } from '@/features/searchQuery';

interface Page {
    setPage:(value: number) => void
}

const SearchBar = ({setPage}:Page) => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [localInput, setLocalInput] = useState('');
  const dispatch = useDispatch();
  const showSearch = useSelector((state: RootState) => state.search.showSearch);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(selectQuery(localInput)); 
      setPage(0)
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [localInput, dispatch]);

  useEffect(() => {
    setVisible(pathname.includes('order'));
  }, [pathname]);


  return (
    <div className="bg-white text-center">
      <div className="inline-flex items-center justify-center shadow-2xl px-5 py-2 my-5 w-full rounded ">
      <img src="/search_icon.png" alt="search_icon" className="w-4" />
        <input
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          type="text"
          placeholder="Search Type Here..."
          className="flex-1 outline-none bg-inherit text-sm ml-5 "
        />
        <button className='py-1 px-5 bg-darkGreen text-white rounded font-semibold'>Search</button>
      </div>
    </div>
  );
};

export default SearchBar;
