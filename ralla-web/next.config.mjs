/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org', // 1. අපි Cast එකට ගන්න පින්තූර එන්නේ මෙතනින්
      },
      {
        protocol: 'https',
        hostname: 'wallpaperaccess.com', // 2. Hero image එකට ගත්ත සයිට් එක (අවශ්‍ය නම් විතරයි)
      },
      {
        protocol: 'https',
        hostname: 'commondatastorage.googleapis.com', // 3. Google Storage images
      },
      {
        protocol: 'https',
        hostname: 'www.imdb.com', // 3. Google Storage images
      },
      // මෙන්න මේක අලුතින් එකතු කරන්න:
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Drive images සමහර විට එන්නේ මේකෙන්
      }
    ],
  },

  reactCompiler: true,
};

export default nextConfig;
