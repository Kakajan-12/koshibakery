'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch} from 'react-redux';
import { selectQuery } from '@/features/searchQuery';
import Image from 'next/image';


interface Page {
    setPage:(value: number) => void
}

const SearchBar = ({setPage}:Page) => {
  const [localInput, setLocalInput] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(selectQuery(localInput)); 
      setPage(0)
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [localInput, dispatch, setPage]);



  return (
    <div className="bg-white text-center">
      <div className="inline-flex items-center justify-center shadow-2xl px-5 py-2 my-5 w-full rounded ">
      <Image width={20} height={10} src="/search_icon.png" alt="search_icon" className="w-4" />
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
