import type {Metadata} from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import {PRIVACY_INTRO, PRIVACY_SECTIONS, PRIVACY_UPDATED} from "@/content/privacy";

export const metadata: Metadata = {
    // Шаблон в layout.tsx допишет « | Koşi Bakery»
    title: "Privacy Policy",
    description: "How Koşi Bakery collects, uses and protects your personal data.",
};

export default function PrivacyPage() {
    return (
        <LegalDocument
            title="Privacy Policy"
            updated={PRIVACY_UPDATED}
            intro={PRIVACY_INTRO}
            sections={PRIVACY_SECTIONS}
            contactTitle="Questions about your data?"
            related={{href: "/termsandconditions", label: "Terms and Conditions"}}
        />
    );
}
