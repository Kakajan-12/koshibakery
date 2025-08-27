import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
      images: {
        remotePatterns: [
          {
            protocol:"https",
            hostname:'cdn.dummyjson.com',
            port:""
          }
        ]
  },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);