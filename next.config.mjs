/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // for STT audio uploads
    },
    // Avoid bundling the Google Cloud SDKs into client code
    serverComponentsExternalPackages: [
      '@google-cloud/firestore',
      '@google-cloud/vertexai',
      '@google-cloud/text-to-speech',
      '@google-cloud/speech',
    ],
  },
};

export default nextConfig;
