module.exports = {
  swcMinify: false,
  trailingSlash: true,
  env: {
    // MICRO SERVIÇOS
    NEXT_APP_URL_MS_AUTH: process.env.NEXT_APP_URL_MS_AUTH,
    NEXT_APP_URL_MS_PARTNER: process.env.NEXT_APP_URL_MS_PARTNER,
    NEXT_APP_URL_MS_CATALOG: process.env.NEXT_APP_URL_MS_CATALOG,
    NEXT_APP_URL_MS_COMMUNICATION: process.env.NEXT_APP_URL_MS_COMMUNICATION,
    NEXT_APP_URL_MS_ORDER: process.env.NEXT_APP_URL_MS_ORDER,
    NEXT_APP_URL_MS_CONSUMER: process.env.NEXT_APP_URL_MS_CONSUMER,
    NEXT_APP_URL_MS_BILLING: process.env.NEXT_APP_URL_MS_BILLING,
    NEXT_APP_GOOGLE_API_KEY: process.env.NEXT_APP_GOOGLE_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'meugas.app',
      },
      {
        protocol: 'https',
        hostname: 'storage.meugas.app',
      },
      {
        protocol: 'https',
        hostname: 'minio.meugas.app',
        port: '9000',
      },
    ],
  },
};
