'use client'

import {GoPlus} from "react-icons/go";
import React, {useState} from "react";

const Terms = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const termsData = [
        {
            title: "1. Information About Us",
            content: `
        <p>1.1 This site is owned and operated by CAKESJANDK. Trading is carried out under the registered company name of CAKESJANDK limited. Registered Office: 185 Edgware Road W2 1ET. Registered in England and Wales. Company Registration Number: <span class="font-bold">15369008</span>.</p>
        <p>1.2 All rights, including copyright are owned by and licensed to CAKESJANDK Limited.</p>
      `,
        },
        {
            title: "2. Your Status",
            content: `
        <p>2.1 By placing an order through our site, you warrant that you are legally capable of entering into binding contracts.</p>      `,
        },
        {
            title: "3. How The Contract Is Formed Between You and Us",
            content: `
        <p>3.1 After placing an order, you will receive an e-mail from us acknowledging that we have received your order. Please note that this does not mean that your order has been accepted. Your order constitutes an offer to us to buy a Product. All orders are subject to acceptance by us, and we will confirm such acceptance to you by sending you an e-mail that confirms that the Product is available (Availability Confirmation) The contract between us (Contract) will only be formed when we send you the Availability Confirmation. </p>
        <p>3.2 The Contract will relate only to those Products ("Products") whose availabilty we have confirmed in the Availability Confirmation.</p>
        <p>3.3 CAKESJANDK Limited is entitled to withdraw from any Contract in the case of obvious errors or inaccuracies or for unavailability. CAKESJANDK Limited reserves the right to place restrictions on the volume of Products ordered. </p>
      `,
        },
        {
            title: "4. Our Status",
            content: `
        <p>4.1 Please note that, we may provide links on our site to the websites of other companies, whether affiliated with us or not. We cannot give any undertaking that Products you purchase from third party sellers through our site, or from companies to whose website we have provided a link on our site, will be of satisfactory quality, and any such warranties are DISCLAIMED by us absolutely. This DISCLAIMER does not affect your statutory rights against the third party seller. If you would like information about your legal rights you should contact your local trading standards or citizens advice bureaux.</p>
      `,
        },
        {
            title: "5. Availability And Delivery",
            content: `
        <p>5.1 Your order will be fulfilled by the delivery date set out in the Availability Confirmation or, if no delivery date is specified, then within 30 business days of the date of the Availability Confirmation, unless there are exceptional circumstances.</p>
      `,
        },
        {
            title: "6. Risk And Title",
            content: `
        <p>6.1 The Products will be your responsibility from the time of delivery or collection. </p>
        <p>6.2 Ownership of the Products will only pass to you when we receive full payment of all sums due in respect of the Products, including delivery charges. </p>
      `,
        },
        {
            title: "7. Purchase of Product and Cancellation Rights",
            content: `
        <p>7.1 Prices and Delivery Charges are displayed and accepted in British Pounds Sterling (£ GBP) only. Product and Delivery Charges are liable to change at any time, but changes will not affect orders in respect of which we have already sent you a Dispatch Confirmation. </p>
        <p>7.2 Products are subject to availability. As there is a delay between the order being placed and when the order is accepted, the stock position relating to particular Product may change. If an Product you have ordered becomes out of stock before we accept the order, we shall notify you as soon as possible and you will not be charged for the out of stock Products. </p>
      `,
        },
        {
            title: "8. Process of Payments",
            content: `
        <p>8.1 Payment for a CAKESJANDK limited Product is made through Stripe, a registered and secure electronic payment system, and through Paypal, a registered and secure electronic payment system </p>
        <p>8.2 All payments are subject to validation by the card issuer. CAKESJANDK Limited does not accept responsibility for the refusal of a card payment and will not be held liable for any delay or non-delivery that results from this. </p>
        <p>8.3 CAKESJANDK limited does not store any of your card details. </p>
      `,
        },
        {
            title: "9. Descriptions",
            content: `
        <p>9.1 Stated sizes are accurate within reason. Variations may occur due to the handmade nature of the Product. Colours may vary from illustrations due to variations in computer monitors. </p>
        <p>9.2 We reserve the right to refuse orders where product information has been mis-published, including prices and promotions. </p>
      `,
        },
        {
            title: "10. Delivery",
            content: `
        <p>10.1. Subject to clause 1.2 below Products, which are in stock, will be ready within 72 hours, unless otherwise agreed in writing.</p>
        <p>10.2. Made to order Products require longer preparation. Your order will be fulfilled by the delivery date set out in the Availability Confirmation, if no delivery date is specified, then within 45 days of the date of the Availability Confirmation, unless there are exceptional circumstances. </p>
      `,
        },
        {
            title: "11. Exchanges and Returns",
            content: `
        <p>11.1. CAKESJANDK limited are not required to offer money back guarantee's on purchases as food is exempt from this. </p>
        <p>11.2. Should the Product you have purchased need to be returned due to a fault or an error of Product, please contact CAKESJANDK Limited directly for a Return Reference Number. Upon receiving a return reference number, please package the Product securely with padding and return to the address below by a registered form of post. You will also need to include a copy of your receipt, which you will receive by email upon the acceptance of you order. CAKESJANDK limited, 185 Edgware Road W2 1ET</p>
        <p>11.3. Should the Product you have purchased need to be returned due to a fault or an error of Product, CAKESJANDK Limited will refund the full cost including any delivery charges. This return of delivery charge will not apply if there is not a fault or error made. </p>
        <p>11.4. You are responsible for the safe carriage of Products to CAKESJANDK Limited. For your own protection, we recommend that you send the parcel using a delivery service that insures you for the value of the Products. We cannot be held responsible for returns that are lost in transit. You have a legal obligation to take reasonable care of the Products while they are in your possession. If you fail to comply with this obligation, we may have a right of action against you for compensation. </p>
        <p>11.5. Refund payments will be made within 30 business days of receipt of the returned product. Refunds will only be made to the original card the Products were purchased with. This is to protect our customers from card fraud. </p>
        <p>11.6. Your statutory rights are not affected by the CAKESJANDK Limited return policy. </p>
        <p> 11.7. In the event that your refund is rejected CAKESJANDK Limited may have the ability to offer an exchange or credit note. </p>
      `,
        },
        {
            title: "12. Safety of Products",
            content: `
        <p>12.1 CAKESJANDK Limited makes every effort to ensure that its Products are safe. Should you experience any problems, please do not hesitate to email </p>
      `,
        },
        {
            title: "13. Copyright",
            content: `
        <p>13.1 CAKESJANDK Limited retains copyright of all designs, photography, text and other content on this website All such rights are reserved. No responsibility can be taken for content on external websites which this site may link to or for any loss or damage that may arise from your use of them.</p>
        <p> 13.2 Any use of the site or its content, including copying or storing any part other than for your own personal, non-commercial use, is prohibited without the permission of CAKESJANDK Limited. You must not modify the paper or digital copies of any materials you have printed off or downloaded in any way, and you must not use any illustrations, photographs, video or audio sequences or any graphics separately from any accompanying text. CAKESJANDK Limited's status (and that of any identified contributors) as the authors of material on our site must always be acknowledged. If you print off, copy or download any part of our site in breach of these Terms and Conditions, your right to use our site will cease immediately and you must, at our option, return or destroy any copies of the materials you have made. </p>
      `,
        },
        {
            title: "14. Reliance on Information Posted",
            content: `
        <p>14.1 Commentary and other materials posted on our site are not intended to amount to advice on which reliance should be placed. We therefore disclaim all liability and responsibility arising from any reliance placed on such materials by any visitor to our site, or by anyone who may be informed of any of its contents.</p>
      `,
        },
        {
            title: "15. Our Site Changes Regularly",
            content: `
        <p>15.1 We aim to update our site regularly, and may change the content at any time. If the need arises, we may suspend access to our site, or close it indefinitely. Any of the material on our site may be out of date at any given time, and we are under no obligation to update such material.</p>
      `,
        },
        {
            title: "16. Our Liability",
            content: `
        <p>16.1 The material displayed on our site is provided without any guarantees, conditions or warranties as to its accuracy. To the extent permitted by law, we, other members of our group of companies and third parties connected to us hereby expressly exclude: </p>
        <p>16.2 All conditions, warranties and other terms, which might otherwise be implied by statute, common law or the law of equity.  </p>
        <p>16.3 Any liability for any direct, indirect or consequential loss or damage incurred by any user in connection with the supply of goods from CAKESJANDK Limited, the use our site or in connection with the use, inability to use, or results of the use of our site, any websites linked to it and any materials posted on it, including: </p>
        <p>(a) loss of income or revenue;</p>
        <p>(b) loss of business;</p>
        <p>(c) loss of profits or contracts;</p>
        <p>(d) loss of anticipated savings;</p>
        <p>(e) loss of data; </p>
        <p>(f) loss of goodwill; </p>
        <p>(g) wasted management or office time; and </p>
        <p>whether caused by tort (including negligence), breach of contract or otherwise, even if foreseeable, provided that this condition shall not prevent claims for loss of or damage to your tangible property or any other claims for direct financial loss that are not excluded by any of the categories set out above. </p>
        <p>16.4 This does not affect our liability for death or personal injury arising from our negligence, nor our liability for fraudulent misrepresentation or misrepresentation as to a fundamental matter, nor any other liability which cannot be excluded or limited under applicable law. </p>
        <p>16.5 CAKESJANDK Limited's total liability to you in respect of all other losses arising under or in connection with any Contract with you, whether in contract, tort (including negligence), breach of statutory duty, or otherwise, shall in no circumstances exceed 100% of the price of the Product ordered under that Contract. </p>
      `,
        },
        {
            title: "17. Written Communications",
            content: `
        <p>17.1 Applicable laws require that some of the information or communications we send to you should be in writing. When using our site, you accept that communication with us will be mainly electronic. We will contact you by e-mail or provide you with information by posting notices on our website. For contractual purposes, you agree to this electronic means of communication and you acknowledge that all contracts, notices, information and other communications that we provide to you electronically comply with any legal requirement that such communications be in writing. This condition does not affect your statutory rights.</p>      
      `,
        },
        {
            title: "18. Notices",
            content: `
        <p>18.1 All notices given by you to us must be given in writing to CAKESJANDK Limited, 185 Edgware Road W2 1ET, London or at <span class="font-bold">hello@koshibakery.com</span>. We may give notice to you at either the e-mail or postal address you provide to us when placing an order, or in any of the ways specified in clause 17 above. Notice will be deemed received and properly served immediately when posted on our website, 24 hours after an e-mail is sent, or three days after the date of posting of any letter. In proving the service of any notice, it will be sufficient to prove, in the case of a letter, that such letter was properly addressed, stamped and placed in the post and, in the case of an e-mail that such e-mail was sent to the specified e-mail address of the addressee. </p>      
      `,
        },
        {
            title: "19. Transfer of Right and Obligations",
            content: `
        <p>19.1 The contract between you and us is binding on you and us and on our respective successors and assignees. </p>      
        <p>19.2 You may not transfer, assign, charge or otherwise dispose of a Contract, or any of your rights or obligations arising under it, without our prior written consent. </p>      
        <p>19.3 We may transfer, assign, charge, sub-contract or otherwise dispose of a Contract, or any of our rights or obligations arising under it, at any time during the term of the Contract. </p>      
      `,
        },
        {
            title: "20. Events Outside Our Control",
            content: `
        <p>20.1 We will not be liable or responsible for any failure to perform, or delay in performance of, any of our obligations under a Contract that is caused by events outside our reasonable control (Force Majeure Event). </p>      
        <p>20.2 A Force Majeure Event includes any act, event, non-happening, omission or accident beyond our reasonable control and includes in particular (without limitation) the following: </p>      
        <p> (a) strikes, lock-outs or other industrial action; </p>      
        <p> (b) civil commotion, riot, invasion, terrorist attack or threat of terrorist attack, war (whether declared or not) or threat or preparation for war </p>      
        <p> (c) fire, explosion, storm, flood, earthquake, subsidence, epidemic or other natural disaster; </p>
        <p> (d) impossibility of the use of railways, shipping, aircraft, motor transport or other means of public or private transport; </p>
        <p> (e) impossibility of the use of public or private telecommunications networks; </p>
        <p> (f) the acts, decrees, legislation, regulations or restrictions of any government; and </p>
        <p> (g) pandemic or epidemic. </p>
        <p> 20.3 Our performance under any Contract is deemed to be suspended for the period that the Force Majeure Event continues, and we will have an extension of time for performance for the duration of that period. We will use our reasonable endeavours to bring the Force Majeure Event to a close or to find a solution by which our obligations under the Contract may be performed despite the Force Majeure Event. </p>
      `,
        },
        {
            title: "21. Waiver",
            content: `
        <p>21.1 If we fail, at any time during the term of a Contract, to insist upon strict performance of any of your obligations under the Contract or any of these terms and conditions, or if we fail to exercise any of the rights or remedies to which we are entitled under the Contract, this will not constitute a waiver of such rights or remedies and will not relieve you from compliance with such obligations. </p>      
        <p>21.2 A waiver by us of any default will not constitute a waiver of any subsequent default. </p>      
        <p>21.3 No waiver by us of any of these terms and conditions will be effective unless it is expressly stated to be a waiver and is communicated to you in writing in accordance with clause 18 above. </p>      
      `,
        },
        {
            title: "22. SEVERABILITY",
            content: `
        <p>22.1 If any court or competent authority decides that any of the provisions of these terms and Conditions or any provisions of a Contract are invalid, unlawful or unenforceable to any extent, the term will, to that extent only, be severed from the remaining terms, which will continue to be valid to the fullest extent permitted by law.</p>      
      `,
        },
        {
            title: "23. ENTIRE AGREEMENT",
            content: `
        <p>23.1 We intend to rely upon these terms and conditions and any document expressly referred to in them in relation to the subject matter of any Contract. While we accept responsibility for statements and representations made by our duly authorised agents, please make sure you ask for any variations from these terms and conditions to be confirmed in writing.</p>      
      `,
        },
        {
            title: "24. OUR RIGHT TO VARY THESE TERMS AND CONDITIONS",
            content: `
        <p>24.1 We have the right to revise and amend these terms and conditions from time to time. </p>      
        <p> 24.2 You will be subject to the policies and terms and conditions in force at the time that you order Products from us, unless any change to those policies or these terms and conditions is required to be made by law or governmental authority (in which case it will apply to orders previously placed by you), or if we notify you of the change to those policies or these terms and conditions before we send you the Availabilty Confirmation (in which case we have the right to assume that you have accepted the change to the terms and conditions, unless you notify us to the contrary within seven working days of receipt by you of the Products). </p>      
      `,
        },
        {
            title: "25. LAW AND JURISDICTION",
            content: `
        <p>25.1 Contracts for the purchase of Products through our site and any dispute or claim arising out of or in connection with them or their subject matter or formation (including non-contractual disputes or claims) will be governed by English law. Any dispute or claim arising out of or in connection with such Contracts or their formation (including non-contractual disputes or claims) will be subject to the non-exclusive jurisdiction of the courts of England and Wales.</p>      
      `,
        },
        {
            title: "26. DATA PROTECTION",
            content: `
        <p>26.1 Please refer to our Privacy Policy for the general privacy terms of the CAKESJANDK Limited Website. </p>      
        <p>26.2 Personal details you provide when placing an order will only be held by CAKESJANDK Limited for the purpose of completing your order. Information will not be shared with any other party except for the purposes outlined in our Privacy Notice. You can unsubscribe to this service at any time by emailing <span class="font-bold">hello@koshibakery.com</span>  with 'unsubscribe' in the subject line. </p>      
        <p>26.3 Financial data will be encrypted by up-to-date encryption technology that will be sent directly to the payment service provider where it will be processed securely. For your own protection you must not divulge credit card information via email. </p>      
      `,
        },
        {
            title: "27. DISPUTES",
            content: `
        <p>27.1 To resolve any disputes please contact Evgeny Ksenzenko on evgeny@zemallow.com, placing disputes in the subject box.</p>      
      `,
        },
        {
            title: "28. GOVERNING LAW",
            content: `
        <p>28.1 The English courts will have non-exclusive jurisdiction over any claim arising from, or related to, a visit to our site, although we retain the right to bring proceedings against you for breach of these conditions in your country of residence or any other relevant country. These Terms and Conditions and any dispute or claim arising out of or in connection with them or their subject matter or formation (including non-contractual disputes or claims) shall be governed by and construed in accordance with the law of England and Wales.</p>      
      `,
        },
        {
            title: "29. THIRD PARTY RIGHTS",
            content: `
        <p>29.1 A person who is not party to these terms and conditions or a Contract shall not have any rights under or in connection with them under the Contracts (Rights of Third Parties) Act 1999.</p>      
      `,
        },
        {
            title: "30. YOUR CONCERNS",
            content: `
        <p>30.1 At Zemallow Limited, we strive to offer an excellent level of customer service. We maintain a high level of care and attention as expected by law. Should you have any issues with our goods, services, prices or any other matter, please contact us by email to <span class="font-bold">hello@koshibakery.com</span></p>      
      `,
        },
    ];


    return (
        <div className="container mx-auto px-4">
            <div className="py-24">
                <div className="text-center text-xl sm:text-2xl lg:text-3xl xl:text-4xl">
                    Terms and conditions
                </div>
                <div className="max-w-[950px] mx-auto space-y-2">
                    <p className="text-md xl:text-lg">
                        Please read these terms and conditions (the "Terms and Conditions") carefully before using this
                        website. By using this website/placing an order you (as website user and / or customer) agree to
                        be bound by the Terms and Conditions set out below. Please ensure you have also read the Privacy
                        Policy. Any questions or complaints regarding our service or terms and conditions, please
                        contact us at: <span className="font-bold">hello@koshibakery.com</span> or on <span
                        className="font-bold">15369008</span>
                    </p>
                    <p>
                        Please note that all card transactions processed on our shop page are handled securely by Stripe
                        (For T's & C's see 8.0)
                    </p>

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

export default Terms