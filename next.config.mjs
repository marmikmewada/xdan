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
            {
                protocol: "https",
                hostname: "www.sunspawellness.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "static.wixstatic.com",
                port: "",
            },
            
            {
                protocol: "https",
                hostname: "via.placeholder.com",
                port: "",
            },
            
        ]
    },
   
};

export default nextConfig;
