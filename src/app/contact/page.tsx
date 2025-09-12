import {quicksand, sora} from "@/app/fonts";
import {MdOutlineMail} from "react-icons/md";
import {FiPhone} from "react-icons/fi";

const Contact = () => {
    return (
        <div className="my-container mx-auto pt-[64px]">
            <div className="containeer mx-auto px-4">
                <div className="flex flex-col justify-center items-center py-4">
                    <h6 className={`${sora.className} mb-4 font-bold text-xl md:text-3xl`}>Contact Us</h6>
                    <p className={`${quicksand.className} text-sm max-w-96 md:max-w-[500px] text-center text-[#6F5E53] md:text-lg`}>We’d
                        love to hear from you! Whether you have a question about our menu, want to place a custom order,
                        or just want to say hello — feel free to reach out.</p>
                </div>
                <div className="h-20 bg-repeat-x bg-bottom md:h-35"
                     style={{
                         backgroundImage: "url('/images/cookie1.webp')",
                         backgroundSize: "auto 100%;"
                     }}>
                </div>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 py-8">
                        <div className="flex flex-col justify-center space-y-3 md:w-1/2">
                            <div className="flex flex-col justify-center space-y-3 xl:flex-row xl:space-x-2">
                                <div className="flex bg-[#FFF2BB] py-2 px-3 rounded-md space-x-2 xl:h-full xl:w-full">
                                    <MdOutlineMail className="w-20 h-20"/>
                                    <div className="flex flex-col justify-center">
                                        <div className={`${sora.className} font-bold text-lg`}>E-mail</div>
                                        <p className={`${quicksand.className} text-md font-light`}>koshibakery@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex bg-[#FFF2BB] py-2 px-3 rounded-md space-x-2 xl:h-full xl:w-full">
                                    <FiPhone className="w-20 h-20"/>
                                    <div className="flex flex-col justify-center">
                                        <div className={`${sora.className} font-bold text-lg`}>Phone</div>
                                        <p className={`${quicksand.className} text-md font-light`}>+9936-00-00-00</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1188567.3066077211!2d-2.57284307151887!3d54.67354639498585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2snl!4v1757660675537!5m2!1sen!2snl"
                                    width="100%" height="250px" loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                        </div>
                        <div className="space-y-2 md:w-1/2">
                            <h6 className={`${sora.className} font-bold md:text-2xl`}>Get In Touch</h6>
                            <p className={`${quicksand.className} text-[#6F5E53] text-sm md:text-md leading-4`}>Duis
                                euismod, magna a cursus
                                bibendum, ligula eros suscipit nisl, nec tempus est velit nec nibh. Quisque at velit
                                vitae nulla pretium hendrerit in eget augue.</p>
                            <form action="#" className="space-y-4 md:h-64 md:flex md:flex-col justify-between">

                                <input type="text" name="name" placeholder="Name"
                                       className="border-b-2 w-full text-sm"/>

                                <input type="text" name="mail" placeholder="Email"
                                       className="border-b-2 w-full text-sm"/>
                                <textarea
                                    name="message"
                                    placeholder="Message"
                                    className="border-b-2 w-full text-sm"
                                ></textarea>
                                <button className={`${sora.className} font-bold w-full text-center border-2 border-[#264D30] rounded-xl py-1`}>Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Contact