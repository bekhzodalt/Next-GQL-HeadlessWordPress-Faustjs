import { gql, useLazyQuery } from '@apollo/client'
import InstagramPost, { IGMedia } from '@archipress/components/Instagram/Post'
import { useEffect, useState } from 'react'
import style from '@styles/components/Instagram/Feed.module.scss'
import SocialLink from '@archipress/components/Links/Social'

export default function InstagramFeed({
	tokenName,
	limit = 6,
	pageURI = 'home',
	className = 'feed',
	overlayPost = true,
}: {
	tokenName: string
	limit?: number
	pageURI?: string
	className?: 'feed' | 'golfFeed'
	overlayPost?: boolean
}) {
	const [getInstagramMedia, { loading, data, error }] =
		useLazyQuery(InstagramFeedQuery)

	async function GetMedia() {
		try {
			const { data } = await getInstagramMedia({
				variables: {
					tokenName,
					limit,
					databaseId: pageURI,
				},
			})

			return data
		} catch (error) {
			console.error('Failed to get instagram media:', error)
		}
	}

	const [state, setState] = useState({
		media: [],
		page: {} as any,
	})

	useEffect(() => {
		if (loading || error) return
		GetMedia().then(data => {
			const media = data?.instagramMedia as IGMedia[]
			const page = data?.page

			setState({
				media,
				page,
			})
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	return (
		<div className={style[className]}>
			{state?.page?.instagramFeedContent?.igFeedTitle ? (
				<span>{state?.page?.instagramFeedContent?.igFeedTitle}</span>
			) : null}

			<div className={style.wrapper}>
				{state?.media?.map(item => (
					<InstagramPost
						key={item.id}
						media={item}
						overlay={
							(typeof overlayPost === 'boolean' && overlayPost) ||
							className === 'golfFeed'
						}
					/>
				))}
			</div>

			{state?.page?.instagramFeedContent?.socials ? (
				<>
					<div className={style.socials}>
						{state?.page?.instagramFeedContent?.socialCtaText ? (
							<span>{state?.page?.instagramFeedContent?.socialCtaText}</span>
						) : null}

						{state?.page?.instagramFeedContent?.socials?.map(
							(social: any, i: number) => (
								<SocialLink
									key={i}
									type={social?.socialType}
									to={social?.socialLink}
								/>
							)
						)}
					</div>
				</>
			) : null}
		</div>
	)
}

export const InstagramFeedQuery = gql`
	query GetInstagramMedia($tokenName: String, $limit: Int, $databaseId: ID!) {
		instagramMedia(tokenName: $tokenName, limit: $limit) {
			id
			caption
			media_url
			thumbnail_url
			permalink
		}

		page(id: $databaseId, idType: URI) {
			id
			instagramFeedContent {
				socialCtaText
				igFeedTitle
				socials {
					show
					socialLink
					socialType
				}
			}
		}
	}
`
