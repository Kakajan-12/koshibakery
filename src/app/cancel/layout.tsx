import type {Metadata} from "next";

// Страница клиентская, поэтому заголовок вкладки задаём здесь. noindex — служебная страница после Stripe
export const metadata: Metadata = {
    title: "Payment cancelled",
    robots: {index: false},
};

export default function CancelLayout({children}: { children: React.ReactNode }) {
    return children;
}
