import { gql } from '@apollo/client'

import {
	Container,
	EntryHeader,
	ContentWrapper,
	FeaturedImage,
	PublicLayout,
} from '@archipress/components'

export default function Component(props: any) {
	// Loading state for previews
	if (props.loading) {
		return <>Loading...</>
	}

	const { title, content, featuredImage, date, author } = props.data.post

	return (
		<>
			<PublicLayout
				seo={{
					title,
				}}
			>
				<>
					<EntryHeader
						title={title}
						image={featuredImage?.node}
						date={date}
						author={author?.node?.name}
					/>
					<Container>
						<ContentWrapper content={content} />
					</Container>
				</>
			</PublicLayout>
		</>
	)
}

Component.query = gql`
	${FeaturedImage.fragments.entry}
	query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
		post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			title
			content
			date
			author {
				node {
					name
				}
			}
			...FeaturedImageFragment
		}
	}
`

Component.variables = ({ databaseId }: { databaseId: string }, ctx: any) => {
	return {
		databaseId,
		asPreview: ctx?.asPreview,
	}
}
