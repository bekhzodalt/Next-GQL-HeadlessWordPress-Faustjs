import { gql } from '@apollo/client'
import { PublicLayout, Carousel, ZoomCard, SEO } from '@archipress/components'
import { CarouselSlide } from '@archipress/components/Carousels/Carousel'
import InstagramFeed from '@archipress/components/Instagram/Feed'
import NavigationLink from '@archipress/components/Links/Navigation'
import style from '@styles/pages/home.module.scss'

export default function Component(props: any) {
	const { title, content, gridLinks, homePageCarousel } = props?.data?.page

	const media = homePageCarousel.media ?? []

	const slides: CarouselSlide[] = media.map(
		(item: any) =>
			item && {
				src: item.uploadImage?.mediaItemUrl ?? item.externalMediaLink,
				type: item.mediaType,
			}
	)

	const gridItems = gridLinks.gridItems ?? []

	const cards = gridItems.map((item: any) => ({
		label: item.gridLabel,
		image: item.gridImage?.mediaItemUrl ?? '',
		dataUrl: item.gridImage?.dataUrl,
		alt: `Image for ${item.gridLabel}`,
		path: item.gridUrl,
	}))
	return (
		<PublicLayout
			seo={{
				title,
			}}
		>
			<>
				<Carousel slides={slides} />

				{content ? (
					<section
						className={style.content}
						dangerouslySetInnerHTML={{ __html: content }}
					/>
				) : null}

				<section className={style.cards}>
					{cards.map(
						(
							card: {
								path: string
								label: string
								image: any
								alt: string
								dataUrl: string
							},
							i: number
						) => {
							return (
								<NavigationLink href={card.path ?? '/'} key={i}>
									<ZoomCard
										label={card.label}
										image={card.image}
										dataURL={card.dataUrl}
										alt={card.alt}
									/>
								</NavigationLink>
							)
						}
					)}
				</section>

				<InstagramFeed tokenName="Home" />
			</>
		</PublicLayout>
	)
}

Component.variables = ({ databaseId }: { databaseId: string }, ctx: any) => {
	return {
		databaseId,
		asPreview: ctx?.asPreview,
	}
}

Component.query = gql`
	query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
		page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			title
			content
			gridLinks {
				gridItems {
					gridLabel
					gridUrl
					gridImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
				}
			}
			homePageCarousel {
				media {
					externalMediaLink
					uploadImage {
						mediaItemUrl
					}
					mediaType
				}
			}
		}
	}
`
