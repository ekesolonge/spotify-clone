/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.scdn.co",
      "wrapped-images.spotifycdn.com",
      "blend-playlist-covers.spotifycdn.com",
      "mosaic.scdn.co",
    ],
  },
};

module.exports = nextConfig;
