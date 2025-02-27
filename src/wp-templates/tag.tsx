import { gql } from '@apollo/client'

import {
	Container,
	EntryHeader,
	FeaturedImage,
	Post,
	PublicLayout,
} from '@archipress/components'

export default function Component(props: any) {
	const { name, posts } = props.data.nodeByUri

	return (
		<>
			<PublicLayout
				seo={{
					title: name,
				}}
			>
				<>
					<EntryHeader title={`Tag: ${name}`} />
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
	query GetTagPage($uri: String!) {
		nodeByUri(uri: $uri) {
			... on Tag {
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
