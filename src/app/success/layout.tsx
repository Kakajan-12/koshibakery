import type {Metadata} from "next";

// Страница клиентская, поэтому заголовок вкладки задаём здесь. noindex — служебная страница после Stripe
export const metadata: Metadata = {
    title: "Thank you for your order",
    robots: {index: false},
};

export default function SuccessLayout({children}: { children: React.ReactNode }) {
    return children;
}
