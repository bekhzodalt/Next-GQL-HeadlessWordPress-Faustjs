import { PublicLayout, Carousel } from '@archipress/components'
import { gql } from '@apollo/client'
import style from '@styles/pages/history.module.scss'
import { CarouselSlide } from '@archipress/components/Carousels/Carousel'

export default function Component(props: any) {
	// Loading state for previews
	if (props.loading) {
		return <>Loading...</>
	}

	const { content, historyPageCarousel, title } = props?.data?.page

	const media = historyPageCarousel?.media ?? []

	const slides: CarouselSlide[] = media.map(
		(item: any) =>
			item && {
				src: item.uploadImage?.mediaItemUrl,
				type: item.mediaType,
			}
	)

	return (
		<>
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
				</>
			</PublicLayout>
		</>
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
			historyPageCarousel {
				media {
					uploadImage {
						mediaItemUrl
					}
					mediaType
				}
			}
		}
	}
`
