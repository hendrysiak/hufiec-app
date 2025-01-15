/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/signout',
        destination: '/api/auth/signout',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 