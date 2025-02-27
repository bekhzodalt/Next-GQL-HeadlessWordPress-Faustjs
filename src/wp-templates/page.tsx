import {
	Main,
	Container,
	ContentWrapper,
	PublicLayout,
} from '@archipress/components'
import { gql } from '@apollo/client'

export default function Component(props: any) {
	// Loading state for previews
	if (props.loading) {
		return <>Loading...</>
	}

	const { content, title } = props?.data?.page

	return (
		<>
			<PublicLayout
				seo={{
					title,
				}}
			>
				<Main>
					<>
						<Container>
							<ContentWrapper content={content} />
						</Container>
					</>
				</Main>
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
		}
	}
`
