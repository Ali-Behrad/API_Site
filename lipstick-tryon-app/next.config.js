// next.config.js
/** @type {import('next').NextConfig} */

module.exports = {
    reactStrictMode: false,
    // images:{}, Could  specify the domain attribute to download the images from there.
    async redirects() {
      return [
        {
          source: '/api/upload',
          destination: 'http://127.0.0.1:4000/upload', // express
          permanent: true
        },
        {
          source: '/api/output',
          destination: 'http://127.0.0.1:4000/output',
          permanent: true
        },
        {
          source: "/api/set-cookie",
          destination: "http://127.0.0.1:4000/",
          permanent: true
        }
      ];
    },
    // If you're using TypeScript, you might want to add
    typescript: {
      ignoreBuildErrors: true
    }
  };
  
// module.exports = {
//   nextConfig,
//   reactStrictMode: false,
// };