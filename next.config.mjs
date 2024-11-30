/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ik.imagekit.io",
                port: "",
            },{
                protocol: "https",
                hostname: "source.unsplash.com",
                port: "",
            },
        ]
    },
   
};

export default nextConfig;
