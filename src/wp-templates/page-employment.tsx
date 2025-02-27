import { PublicLayout, Carousel } from '@archipress/components'
import { gql } from '@apollo/client'
import style from '@styles/pages/employment.module.scss'
import { CarouselSlide } from '@archipress/components/Carousels/Carousel'

export default function Component(props: any) {
	// Loading state for previews
	if (props.loading) {
		return <>Loading...</>
	}

	const { content, employmentPageContent, title } = props?.data?.page

	const media = employmentPageContent?.employmentCarouselMedia ?? []
	const employmentButton = employmentPageContent?.employmentButton

	const slides: CarouselSlide[] = media.map(
		(item: any) =>
			item && {
				src: item.uploadMedia?.mediaItemUrl,
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
					<a
						href={employmentButton?.link}
						target="_blank"
						rel="noreferrer"
						className={style.button}
					>
						{employmentButton?.label}
					</a>
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
			employmentPageContent {
				employmentButton {
					label
					link
				}
				employmentCarouselMedia {
					mediaType
					uploadMedia {
						mediaItemUrl
					}
				}
			}
		}
	}
`
