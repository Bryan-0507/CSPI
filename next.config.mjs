/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  images: {
    unoptimized: true,
  },

  basePath: "/CSPI",
  assetPrefix: "/CSPI/",
}

export default nextConfig