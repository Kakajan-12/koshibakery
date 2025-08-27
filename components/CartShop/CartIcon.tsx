'use client';

import { useSelector } from 'react-redux';
import Badge from '@mui/material/Badge';
import Link from 'next/link';
import { RootState } from '@/store';
import Image from 'next/image';

export default function CartIcon() {
  const totalItems = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <Link href="/cart" aria-label="Go to cart" className="relative inline-block">
      <Badge
        badgeContent={totalItems}
        overlap="rectangular"
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: '#8EDFB5',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            minWidth: '20px',
            height: '20px',
            borderRadius: '50%',
          },
        }}
      >
        <Image src="/shopCart.svg" alt="Cart" width={24} height={24} />
      </Badge>
    </Link>
  );
}
