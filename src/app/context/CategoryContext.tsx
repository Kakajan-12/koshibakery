"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CategoryContextType = {
    selectedCategory: number | null;
    setSelectedCategory: (id: number | null) => void;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    return (
        <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) throw new Error("useCategory must be used within a CategoryProvider");
    return context;
};
