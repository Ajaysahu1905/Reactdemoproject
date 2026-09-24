/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Pin the Turbopack workspace root to this project so it doesn't try to
  // walk up into the sibling react-practice project's lockfile.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
