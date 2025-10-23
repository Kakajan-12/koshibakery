'use client'

import {GoPlus} from "react-icons/go";
import React, {useState} from "react";

const Privacy = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const termsData = [
        {
            title: "Sharing Your Personal Data",
            content: `
        <p>We may share your data with others who help us provide services to you. This includes companies that help us process data, host our digital channels, process payments, send communications, fulfil orders or provide us or you with services. We may store data in the United Kingdom or the rest of the EU. </p>
        <p>We require our service providers to protect your data and use it only as the law allows. They cannot use your data except in helping us provide you with products and services or as allowed by the privacy law and our contracts. </p>
      `,
        },
        {
            title: "Access to Your Personal Data",
            content: `
        <p>You are entitled to access the personal information that we hold on file for free. Email your request to cakesjandk@gmail.com and we will get back to you as soon as possible but no later than 10 days after your request. </p>
        <p>Updating your personal information and unsubscribing: </p>
        <p>You can unsubscribe from our Newsletter at anytime by clicking the unsubscribe link at the bottom of any of our newsletter emails or by emailing us at cakesjandk@gmail.com</p>
`,
        },
        {
            title: "Policy Changes",
            content: `
        <p>By using our website, you consent to the collection and use of the information you provide to us as outlined in this Privacy Notice. We may change this Privacy Notice from time to time, so make sure you check back occasionally. If we change our Privacy Notice, we will publish those changes on this page. If you have any questions or concerns about our collection, use or disclosure of your personal data, please get in touch at cakesjandk@gmail.com. </p>
        <p>This policy was last updated on 23 of January 2020 </p>
      `,
        }
    ];


    return (
        <div className="container mx-auto px-4">
            <div className="py-24">
                <div className="text-center text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-8">
                    Privacy Policy
                </div>
                <div className="max-w-[950px] mb-4 text-sm sm:text-md md:text-lg">
                    CAKESJANDK is the trading name of CAKESJANDK Limited, a UK registered company (company number 15369008), whose registered office address is:
                </div>
                <div className="font-bold text-sm sm:text-md md:text-lg">185 Edgware Road W2 1ET</div>
                <div className="max-w-[950px] mx-auto space-y-2 pt-10">
                    <div className="mb-10">
                        <div className="pb-2 border-b font-semibold text-lg mb-8">Your Privacy</div>
                        <p className="text-md xl:text-lg">
                            At CAKESJANDK we are committed to maintaining the trust and confidence of our visitors to
                            our website. In this privacy notice we explain when and why we collect your personal data,
                            how we use it, when and why we may share it with others and the steps we have taken to keep
                            it secure.
                        </p>
                        <p className="text-md xl:text-lg">
                            We are always glad to assist with any questions or concerns you may have. If you need to get
                            in touch please send us an email at cakesjandk@gmail.com
                        </p>
                    </div>

                    <div className="mb-10">
                        <div className="pb-2 border-b font-semibold text-lg mb-8">Personal Data</div>
                        <p className="text-md xl:text-lg">
                            Personal data refers to any information that may be used to identify you, such as, your name, title, phone number, email address, or mailing address. In general, you can browse our website without giving us any personal information. We use several products to analyse traffic to this website in order to understand our visitors' needs and to continually improve our site for them. We collect only anonymous, aggregate statistics.
                        </p>
                        <p className="text-md xl:text-lg">
                            However, there are additional activities on our site that require you to be registered. For example, to receive our newsletter or purchase products from our store. As part of the registration process, we collect personal information. We use that information for a couple of reasons: to tell you about what you asked us to tell you about, to fulfil your online order, to contact you if we need to obtain or provide additional information, to check our records are right.
                        </p>
                    </div>

                    <div className="mb-10">
                        <div className="pb-2 border-b font-semibold text-lg mb-8">Use of Cookies</div>
                        <p className="text-md xl:text-lg">
                            A cookie is a small text file containing information that a website transfers to your computer's hard disk for certain features of the website to function (such as user accounts in our shop) and allows us to analyse our site traffic patterns. It does not give us access to your computer or to information beyond what you provide us. Most web browsers automatically accept cookies; consult your browser's manual or online help if you want information on restricting or disabling the browser's handling of cookies. If you disable cookies, you can still view the publicly available information on our website although this may affect your user experience. If you are using a shared computer and you have cookies turned on, be sure to log off when you finish to further protect your personal information.
                        </p>
                    </div>


                    {termsData.map((item, index) => (
                        <div key={index} className="border-b border-[#264D30]">
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex justify-between items-center px-4 py-3 cursor-pointer text-left"
                            >
                                <span className="text-lg md:text-xl font-medium">{item.title}</span>
                                <GoPlus
                                    className={`transform transition-transform duration-300 text-[#264D30] ${
                                        openIndex === index ? "rotate-45" : ""
                                    }`}
                                    size={24}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out`}
                                style={{
                                    maxHeight: openIndex === index ? "900px" : "0px",
                                }}
                            >
                                <div
                                    className="px-4 pb-4 text-sm md:text-base text-gray-600 space-y-3"
                                    dangerouslySetInnerHTML={{__html: item.content}}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Privacy