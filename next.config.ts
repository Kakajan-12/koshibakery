import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // images: {
    //     remotePatterns: [
    //         {
    //             protocol: 'https',
    //             hostname: 'api.koshibakery.com',
    //             pathname: '/uploads/**',
    //         },
    //     ],
    // },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;
