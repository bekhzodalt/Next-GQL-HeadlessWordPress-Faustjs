const { withFaust, getWpHostname } = require('@faustwp/core')

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withFaust({
	reactStrictMode: true,
	distDir: process.env.BUILD_DIR || '.next',
	sassOptions: {
		includePaths: ['node_modules'],
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 's3.amazonaws.com',
				pathname: '/pacesetter_assets/**',
			},
		],
		domains: [
			getWpHostname(),
			'scontent.cdninstagram.com',
			'app.pacesettertechnology.com',
		],
	},
	i18n: {
		locales: ['en'],
		defaultLocale: 'en',
	},
	async headers() {
		return [
			{
				source: '/(.*?)',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: process.env.NEXT_PUBLIC_WORDPRESS_URL,
					},
				],
			},
		]
	},
	async redirects() {
		return [
			{
				source: '/admin',
				has: [
					{
						type: 'cookie',
						key: 'club_user',
					},
				],
				permanent: false,
				destination: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin`,
			},
			{
				source: '/wp-content/uploads/:path*',
				permanent: false,
				destination: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/:path*`,
			},
		]
	},
})
