// Политика конфиденциальности. Текст юридический: меняйте только по согласованию с владельцем.
// Адреса почты в тексте страница сама превращает в ссылки.
import type {LegalSection} from "@/components/legal/LegalDocument";

export const PRIVACY_UPDATED = "22 February 2026";

export const PRIVACY_INTRO = [
    "Koşi Bakery is the trading name of CAKESJANDK Limited, a UK registered company (company number 15369008), whose registered office address is: 185 Edgware Road W2 1ET.",
];

export const PRIVACY_SECTIONS: LegalSection[] = [
    {
        id: "section-1",
        number: 1,
        title: "Your Privacy",
        blocks: [
            "At CAKESJANDK we are committed to maintaining the trust and confidence of our visitors to our website. In this privacy notice we explain when and why we collect your personal data, how we use it, when and why we may share it with others and the steps we have taken to keep it secure.",
            "We are always glad to assist with any questions or concerns you may have. If you need to get in touch please send us an email at cakesjandk@gmail.com",
        ],
    },
    {
        id: "section-2",
        number: 2,
        title: "Personal Data",
        blocks: [
            "Personal data refers to any information that may be used to identify you, such as, your name, title, phone number, email address, or mailing address. In general, you can browse our website without giving us any personal information. We use several products to analyse traffic to this website in order to understand our visitors' needs and to continually improve our site for them. We collect only anonymous, aggregate statistics.",
            "However, there are additional activities on our site that require you to be registered. For example, to receive our newsletter or purchase products from our store. As part of the registration process, we collect personal information. We use that information for a couple of reasons:",
            {
                list: [
                    "to tell you about what you asked us to tell you about,",
                    "to fulfil your online order,",
                    "to contact you if we need to obtain or provide additional information,",
                    "to check our records are right.",
                ],
                ordered: false,
            },
        ],
    },
    {
        id: "section-3",
        number: 3,
        title: "Use of Cookies",
        blocks: [
            "A cookie is a small text file containing information that a website transfers to your computer's hard disk for certain features of the website to function (such as user accounts in our shop) and allows us to analyse our site traffic patterns. It does not give us access to your computer or to information beyond what you provide us.",
            "Most web browsers automatically accept cookies; consult your browser's manual or online help if you want information on restricting or disabling the browser's handling of cookies. If you disable cookies, you can still view the publicly available information on our website although this may affect your user experience.",
            "If you are using a shared computer and you have cookies turned on, be sure to log off when you finish to further protect your personal information.",
        ],
    },
    {
        id: "section-4",
        number: 4,
        title: "Sharing Your Personal Data",
        blocks: [
            "We may share your data with others who help us provide services to you. This includes companies that help us process data, host our digital channels, process payments, send communications, fulfil orders or provide us or you with services. We may store data in the United Kingdom or the rest of the EU.",
            "We require our service providers to protect your data and use it only as the law allows. They cannot use your data except in helping us provide you with products and services or as allowed by the privacy law and our contracts.",
        ],
    },
    {
        id: "section-5",
        number: 5,
        title: "Access to Your Personal Data",
        blocks: [
            "You are entitled to access the personal information that we hold on file for free. Email your request to cakesjandk@gmail.com and we will get back to you as soon as possible but no later than 10 days after your request.",
            "Updating your personal information and unsubscribing:",
            "You can unsubscribe from our Newsletter at anytime by clicking the unsubscribe link at the bottom of any of our newsletter emails or by emailing us at cakesjandk@gmail.com",
        ],
    },
    {
        id: "section-6",
        number: 6,
        title: "Policy Changes",
        blocks: [
            "By using our website, you consent to the collection and use of the information you provide to us as outlined in this Privacy Notice. We may change this Privacy Notice from time to time, so make sure you check back occasionally. If we change our Privacy Notice, we will publish those changes on this page. If you have any questions or concerns about our collection, use or disclosure of your personal data, please get in touch at cakesjandk@gmail.com.",
            "This policy was last updated on 22 of February 2026",
        ],
    },
];
