import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollTop from '@/components/Helper/ScrollTop';
import Footer from '@/components/Footer';
import ReduxWrapper from '@/ReduxWrapper';



export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  return (
    <html>
      <body>
          <NextIntlClientProvider>
            <ReduxWrapper>
        <div className='container mx-auto'>
            <Navbar/>
            {children}
            <ScrollTop/>
        </div>
            <Footer/>
            </ReduxWrapper>
            </NextIntlClientProvider>
      </body>
    </html>
  );
}