import { gql } from '@apollo/client'

import {
	Container,
	Post,
	FeaturedImage,
	PublicLayout,
} from '@archipress/components'

export default function Component(props: any) {
	const { posts } = props?.data?.nodeByUri
	const title = props?.data?.name

	return (
		<>
			<PublicLayout
				seo={{
					title,
				}}
			>
				<>
					<Container>
						{posts.edges.map((post: any) => (
							<Post
								key={post.databaseId}
								title={post.node.title}
								content={post.node.content}
								date={post.node.date}
								author={post.node.author?.node.name}
								uri={post.node.uri}
								featuredImage={post.node.featuredImage?.node}
							/>
						))}
					</Container>
				</>
			</PublicLayout>
		</>
	)
}

Component.query = gql`
	${FeaturedImage.fragments.entry}
	query GetCategoryPage($uri: String!) {
		nodeByUri(uri: $uri) {
			... on Category {
				name
				posts {
					edges {
						node {
							id
							title
							content
							date
							uri
							...FeaturedImageFragment
							author {
								node {
									name
								}
							}
						}
					}
				}
			}
		}
	}
`

Component.variables = ({ uri }: { uri: string }) => {
	return {
		uri,
	}
}
