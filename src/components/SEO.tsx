import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * Provide SEO related meta tags to a page.
 *
 * @param {Props} props The props object.
 * @param {string} props.title Used for the page title, og:title, twitter:title, etc.
 * @param {string} props.description Used for the meta description, og:description, twitter:description, etc.
 * @param {string} props.imageUrl Used for the og:image and twitter:image.
 * @param {string} props.path Used for the og:url and twitter:url.
 *
 * @returns {React.ReactElement} The SEO component
 */

interface SEOProps {
	title?: string
	description?: string
	imageUrl?: string
	path?: string
}

export default function SEO({ title, description, imageUrl, path }: SEOProps) {
	const router = useRouter()
	useEffect(() => {
		if (window.self !== window.top)
			parent.postMessage(
				{
					event: 'routeChange',
					title: title,
					path: router.asPath,
				},
				'https://www.unionleague.org'
			)
	}, [router.asPath, title])

	if (!title && !description && !imageUrl && !path) {
		return null
	}

	return (
		<Head>
			<meta property="og:type" content="website" />
			<meta property="twitter:card" content="summary_large_image" />

			{title && (
				<>
					<title>{title}</title>
					<meta name="title" content={title} />
					<meta property="og:title" content={title} />
					<meta property="twitter:title" content={title} />
				</>
			)}

			{description && (
				<>
					<meta name="description" content={description} />
					<meta property="og:description" content={description} />
					<meta property="twitter:description" content={description} />
				</>
			)}

			{imageUrl && (
				<>
					<meta property="og:image" content={imageUrl} />
					<meta property="twitter:image" content={imageUrl} />
				</>
			)}

			{path && (
				<>
					<meta property="og:url" content={path} />
					<meta property="twitter:url" content={path} />
				</>
			)}
		</Head>
	)
}
