"use client";

import {useState} from "react";
import Image from "next/image";
import {CakeSlice} from "lucide-react";

// Миниатюра товара в заказе. Если картинки нет или она не загрузилась (товар удалён, старая ссылка) —
// аккуратная иконка вместо значка битой картинки.
export default function OrderItemThumb({src, size = 56}: { src?: string | null; size?: number }) {
    const [failed, setFailed] = useState(false);
    return (
        <span className="relative shrink-0 overflow-hidden rounded-xl bg-[#F6EEEC] flex items-center justify-center"
              style={{width: size, height: size}}>
            {src && !failed ? (
                <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" onError={() => setFailed(true)}/>
            ) : (
                <CakeSlice className="w-1/2 h-1/2 text-[#B8485B]/40" aria-hidden="true"/>
            )}
        </span>
    );
}
