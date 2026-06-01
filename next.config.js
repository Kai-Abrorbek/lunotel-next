/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ['swiper', 'swiper/css'],
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
		KAKAO_JAVASCRIPT_KEY_MAP: process.env.KAKAO_JAVASCRIPT_KEY_MAP,
		LUNOTEL_API_GRAPHQL_URL: process.env.LUNOTEL_API_GRAPHQL_URL,
	},
	experimental: {
		cpus: 1,
		workerThreads: false,
	},
};
const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;
module.exports = nextConfig;
