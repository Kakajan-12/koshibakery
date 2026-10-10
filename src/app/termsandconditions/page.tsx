import type {Metadata} from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import {TERMS_INTRO, TERMS_SECTIONS} from "@/content/terms";

export const metadata: Metadata = {
    // Шаблон в layout.tsx допишет « | Koşi Bakery»
    title: "Terms and Conditions",
    description: "Terms and conditions for using the Koşi Bakery website and ordering our cakes and biscuits.",
};

export default function TermsPage() {
    return <LegalDocument title="Terms and Conditions" intro={TERMS_INTRO} sections={TERMS_SECTIONS}/>;
}
