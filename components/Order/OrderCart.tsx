'use client'
import Image from "next/image";
import React, {useRef, useState } from "react";
import { Sora } from "next/font/google";
import { useGetProductQuery } from "@/services/productApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { addToCart, decreaseQuantityzero,increaseQuantityZero } from "@/features/cartSlice";
import SearchBar from "../Helper/SearchBar";
import { Box, CircularProgress, Typography } from '@mui/material';
import CustomSnackbar from "../Helper/CustomSnackbar";
import Link from "next/link";
import PaginationControl from "../Helper/PaginationControl";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-sora",
});


const OrderCart = () => {
  const [page,setPage] = useState(0)
  const [open, setOpen] = useState(false);
  const perPage = 9
  const search = useSelector((state:RootState ) => state.search.search)
  const item = useSelector((state:RootState) => state.cart.items)
  const dispatch = useDispatch()
  const topRef = useRef<HTMLDivElement>(null);


const getQuantity = (id: number) => {
  const cartItem = item.find(i => i.id === id);
  return cartItem ? cartItem.quantity : 0;
};

  const {data, isLoading, error} = useGetProductQuery()
  

 if (isLoading) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height={200}>
      <CircularProgress size={50} />
      <Typography sx={{ ml: 2 }}>Loading...</Typography>
    </Box>
  );
}
  if(error) return <p>error</p>

 const filteredProducts = data.products.filter((item) =>
  item.title.toLowerCase().includes(search.toLowerCase())
);

const totalProduct = Math.ceil(filteredProducts.length / perPage)
const start = page * perPage
const end = start + perPage
const currentItems = filteredProducts.slice(start,end)

  return (
   <div ref={topRef}  className="scroll-mt-10">
    <SearchBar setPage={setPage}/>
     <div
      className={`${sora.variable} max-w-6xl mx-auto p-5 gap-5 2xl:gap-15 grid md:grid-cols-2 xl:grid-cols-3`}
    >
      {currentItems.length === 0 ? (
        <p className="text-gray-600 text-xl">
          Product not found
        </p>
      ):(
        currentItems.map((cake, index) => (
          <div
            key={index} 
            className="bg-white  border rounded-2xl flex gap-5 md:flex-col p-5 hover:scale-105 transition-transform duration-300"
          >
  
        {/* Картинка */}
        <Link href={`/detail/${cake.id}`}>
        <Image
          src={cake.images[0]}
          alt="cake"
          width={300}
          height={300}
          className={`mx-auto w-20 md:w-1/2 object-center rounded-xl transition-opacity duration-300`}/>
          </Link>

            <div className="flex flex-col justify-between w-full h-full">
              <h3 className=" md:text-xl 2xl:text-2xl font-main text-gray-800 mb-2">
                {cake.title}
              </h3>
  
              <p className="text-brown text-sm md:text-base w-full max-w-xs mb-4">
                {cake.description}
              </p>
  
    {getQuantity(cake.id) === 0 ? (
    <div
      className="flex items-center justify-center w-2/3 sm:container border-2 border-[#7DDF9A] hover:bg-green-200 hover:border-green-500 rounded-2xl px-4 py-1 md:py-3 text-sm gap-3 cursor-pointer"
      onClick={() => {
        dispatch(
          addToCart({
            id: cake.id,
            title: cake.title,
            price: cake.price,
            description: cake.description,
            image: cake.images[0],
          })
        );
        setOpen(true);
      }}
    >
      <Image
        src="/cartm.svg"
        alt="cart"
        width={20}
        height={20}
        className="sm:w-7 sm:h-7"
      />
      <p className="font-bold text-base 2xl:text-2xl">£{cake.price}</p>
    </div>
  ) : (
    // Если товар уже добавлен — показываем блок управления количеством
    <div className="flex gap-10 lg:justify-center items-center w-full">
      <button
        onClick={() => dispatch(decreaseQuantityzero(cake.id))}
        className="text-2xl w-8 h-8 sm:w-13 sm:h-13 rounded bg-[#DEFBE6] text-[#29713F] hover:bg-green-300 transition">
        -
      </button>
      <span className="w-8 h-8 sm:w-13 sm:h-13 rounded font-main font-semibold bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center">
        {getQuantity(cake.id)}
      </span>
      <button
        onClick={() => dispatch(increaseQuantityZero(cake.id))}
        className="text-2xl w-8 h-8 sm:w-13 sm:h-13 rounded bg-[#DEFBE6] text-[#29713F] hover:bg-green-300 transition">
        +
      </button>
    </div>
  )}
   </div>
          </div>
        ))
      )}
    </div>
      <div className="flex items-center justify-center font-main gap-5">
    <PaginationControl
  totalPages={totalProduct}
  currentPage={page}
  onChange={setPage}
  scrollToRef={topRef}
/>
       </div> 

       <CustomSnackbar
        open={open}
        onClose={() => setOpen(false)}
        message="Added to cart!"
        severity="success"
      />

   </div>
  );
};

export default OrderCart;
